class NeoScreenApp {
    constructor() {
        this.initializeEventListeners();
        this.testConnection();
    }

    async testConnection() {
        try {
            const response = await fetch('/health');
            if (response.ok) {
                console.log('✅ Backend connection successful');
            } else {
                console.log('❌ Backend connection failed');
            }
        } catch (error) {
            console.log('❌ Backend connection error:', error);
        }
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }

    async handleFileUpload(file) {
        console.log('📤 Uploading file:', file.name, file.type, file.size);
        
        // Validate file type
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (PNG, JPG, JPEG)');
            return;
        }

        // Show loading
        this.showLoading();

        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', file);

            console.log('🔄 Sending request to server...');
            
            // Send to backend with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Server response:', result);
            this.displayResults(result, file);

        } catch (error) {
            console.error('❌ Upload error:', error);
            
            if (error.name === 'AbortError') {
                alert('Request timeout. Please try again with a smaller image.');
            } else {
                alert('Error analyzing image: ' + error.message);
            }
        } finally {
            this.hideLoading();
        }
    }

    displayResults(result, file) {
        // Show results section
        document.getElementById('resultsSection').style.display = 'block';

        // Display quality assessment
        const qualityStatus = document.getElementById('qualityStatus');
        const qualityMessage = document.getElementById('qualityMessage');

        if (result.status === 'error') {
            // Non-standard view
            qualityStatus.textContent = 'NON-STANDARD';
            qualityStatus.className = 'status-badge non-standard';
            qualityMessage.textContent = result.message;
            
            // Hide analysis results
            document.getElementById('analysisResults').style.display = 'none';
        } else {
            // Standard view
            qualityStatus.textContent = 'STANDARD';
            qualityStatus.className = 'status-badge standard';
            qualityMessage.textContent = `Quality confidence: ${(result.quality_confidence * 100).toFixed(1)}%`;

            // Show analysis results
            this.displayAnalysisResults(result, file);
        }

        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    displayAnalysisResults(result, file) {
        // Show analysis section
        const analysisResults = document.getElementById('analysisResults');
        analysisResults.style.display = 'block';

        // Display original image
        const originalImage = document.getElementById('originalImage');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Display masked image
        const maskedImage = document.getElementById('maskedImage');
        if (result.masked_image) {
            maskedImage.src = 'data:image/png;base64,' + result.masked_image;
        } else {
            maskedImage.src = originalImage.src; // Fallback
        }

        // Display measurements
        document.getElementById('thicknessValue').textContent = result.nt_thickness_px;
        document.getElementById('thresholdValue').textContent = result.risk_threshold;

        // Display risk assessment
        const riskLevel = document.getElementById('riskLevel');
        const riskConfidence = document.getElementById('riskConfidence');
        
        riskLevel.textContent = result.risk_category;
        riskLevel.className = `risk-level ${result.risk_category.toLowerCase().replace(' ', '-')}`;
        riskConfidence.textContent = `Confidence: ${result.confidence}`;

        // Display recommendation
        document.getElementById('recommendationText').textContent = result.clinical_recommendation;
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    new NeoScreenApp();
});
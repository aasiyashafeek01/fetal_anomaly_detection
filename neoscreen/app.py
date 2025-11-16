from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/')
def home():
    return open('index.html').read()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'status': 'error', 'message': 'No file uploaded'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'status': 'error', 'message': 'No file selected'})
        
        # Simple mock analysis - always works
        filename = file.filename.lower()
        
        if any(word in filename for word in ['nonstandard', 'poor', 'invalid']):
            return jsonify({
                'status': 'error',
                'message': 'Non-standard ultrasound view detected',
                'quality_confidence': round(random.uniform(0.1, 0.4), 3),
                'recommendation': 'Please acquire standard NT view'
            })
        
        # Standard view - return success
        risk_type = 'High Risk' if any(word in filename for word in ['high', 'risk', 'thick']) else 'Low Risk'
        
        return jsonify({
            'status': 'success',
            'quality_confidence': round(random.uniform(0.8, 0.95), 3),
            'nt_thickness_px': random.randint(35, 50) if risk_type == 'High Risk' else random.randint(18, 25),
            'risk_category': risk_type,
            'confidence': 'High',
            'risk_threshold': 30,
            'clinical_recommendation': 'Consult your healthcare provider for detailed analysis' if risk_type == 'High Risk' else 'Continue routine monitoring',
            'masked_image': None  # No image processing in simple version
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    print("🚀 NeoScreen running on http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
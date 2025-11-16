# fetal_anomaly_detection
The project objective is to create a Deep Learning model to detect Down Syndrome anomaly in fetus from first trimester ultrasound scans (NT scans) using Nuchal Translucency(NT) as marker. The goal is to assist medical professionals by providing an automated system that supports early anomaly screening and improves diagnostic reliability.

PROJECT OVERVIEW:
A CNN model was developed first to classify the input ultrasound scans as standard or non-standard based on the visibility of NT region.
After extensive preprocessing steps, a U-Net segmentation model was then used to isolate the Nuchal Translucency (NT) region from the images classified as standard, and the NT thickness was then measured using image processing techniques.
Based on the measured NT value, a rule-based classification approach was applied using a threshold derived from the dataset’s NT value distribution to determine the risk of fetus having down syndrome.

RESULTS AND LIMITATIONS:
A complete and functional pipeline was successfully developed, covering NT region segmentation using U-Net, NT thickness measurement, threshold-based anomaly indication. While the workflow demonstrates a feasible proof-of-concept system, the model performance and reliability are constrained by several factors.
Primariy, there is a general lack of publicly available datasets suitable for this specific objective. NT-focused ultrasound datasets especially those containing DICOM images with clinical metadata and reliable NT annotations are extremely scarce, which restricts both model training and proper validation. The dataset used in this project therefore affects the models reliability in real world due to these limitations. Additionally, because an established clinical threshold was not available, the classification threshold had to be statistically estimated from the data distribution, reducing clinical interpretability and diagnostic confidence. As a result, the pipeline serves as a proof of concept rather than a clinically deployable solution.

The dataset used is Dataset for Fetus Framework from Mendeley Data. (https://data.mendeley.com/datasets/n2rbrb9t4f/1)



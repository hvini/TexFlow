#!/bin/bash

# 1. Set your project ID
export PROJECT_ID=$(gcloud config get-value project)

# 2. Build the container image
# This stores the image in GCP Artifact Registry
gcloud builds submit --tag gcr.io/$PROJECT_ID/texflow-server

# 3. Deploy to Cloud Run
# --allow-unauthenticated: Makes it public (remove this if you want to secure it)
# --memory 1Gi: Gives enough RAM for compilation
gcloud run deploy texflow-server \
  --image gcr.io/$PROJECT_ID/texflow-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --max-instances 10
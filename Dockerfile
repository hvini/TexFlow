# Use a lightweight Alpine Linux base
FROM python:3.9-alpine

# Install minimal TeX Live and required tools
# 'texlive' is the basic set. Add 'texlive-full' if you are okay paying ~$0.40/month for storage.
RUN apk update && apk add --no-cache \
    texlive \
    texlive-xetex \
    texlive-dvi \
    ghostscript \
    # Add other specific packages you need here to keep size low
    # e.g., texlive-mathscience
    && pip install flask gunicorn flask-cors

# Set up working directory
WORKDIR /app

# Copy the server script (see Step 2)
COPY app.py .

# Run the web server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "8", "--timeout", "0", "app:app"]
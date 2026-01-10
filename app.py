
import os
import uuid
import shutil
import subprocess
import base64
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = app.logger

TEMP_DIR = '/tmp/texflow_compilations'

@app.route('/compile', methods=['POST'])
def compile_tex():
    data = request.json
    if not data or 'latex' not in data:
        return jsonify({'error': 'No latex code provided'}), 400

    latex_code = data['latex']
    images = data.get('images', [])
    timeout = data.get('timeout', 30)

    # validate timeout limit (cap at 300s for safety)
    timeout = min(int(timeout), 300)

    # Create a unique temporary directory for this compilation
    compile_id = str(uuid.uuid4())
    work_dir = os.path.join(TEMP_DIR, compile_id)
    os.makedirs(work_dir, exist_ok=True)

    try:
        # Write the main LaTeX file
        tex_file_path = os.path.join(work_dir, 'main.tex')
        with open(tex_file_path, 'w') as f:
            f.write(latex_code)

        # Handle images
        for img in images:
            img_name = img.get('name')
            img_url = img.get('url')
            
            if not img_name or not img_url:
                continue

            img_path = os.path.join(work_dir, img_name)
            
            try:
                if img_url.startswith('data:'):
                    # Handle base64 encoded images
                    header, encoded = img_url.split(',', 1)
                    img_data = base64.b64decode(encoded)
                    with open(img_path, 'wb') as f:
                        f.write(img_data)
                else:
                    # Handle validation/security for external URLs if needed
                    # For V1 we might skip external URL fetching or implement it carefully
                    # But the frontend usually sends data URLs for user uploads.
                    # If it's a public URL, we might need requests.
                    pass 
            except Exception as e:
                logger.warning(f"Failed to process image {img_name}: {str(e)}")

        # Run pdflatex
        # -interaction=nonstopmode prevents hanging on errors
        # -halt-on-error stops on the first error
        command = ['pdflatex', '-interaction=nonstopmode', '-halt-on-error', 'main.tex']
        
        # Run twice for references/toc if needed, but once is usually enough for simple snippets.
        # For a full editor, running twice is safer but slower. Let's run once for now.
        process = subprocess.run(
            command,
            cwd=work_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout
        )

        if process.returncode != 0:
            # Compilation failed
            stdout = process.stdout.decode('utf-8', errors='ignore')
            return jsonify({
                'error': 'Compilation failed',
                'logs': stdout
            }), 400

        pdf_path = os.path.join(work_dir, 'main.pdf')
        if os.path.exists(pdf_path):
            # Read PDF and return appropriate response
            # We can return file directly or base64. 
            # Returning file allows the browser to display it easily via blob.
            return send_file(pdf_path, mimetype='application/pdf')
        else:
            return jsonify({'error': 'PDF not generated despite exit code 0'}), 500

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Compilation timed out'}), 508
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        # Cleanup
        shutil.rmtree(work_dir, ignore_errors=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

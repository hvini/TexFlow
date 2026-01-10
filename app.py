
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

        # Helper to run command
        def run_command(cmd, timeout_val):
            return subprocess.run(
                cmd,
                cwd=work_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=timeout_val
            )

        # 1. First Pass (pdflatex)
        # -interaction=nonstopmode prevents hanging on errors
        process = run_command(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', 'main.tex'], timeout)

        # Check for BibTeX requirement
        aux_path = os.path.join(work_dir, 'main.aux')
        needs_bibtex = False
        if os.path.exists(aux_path):
            try:
                with open(aux_path, 'r', errors='ignore') as f:
                    content = f.read()
                    if r'\bibdata' in content:
                        needs_bibtex = True
            except:
                pass

        if needs_bibtex and process.returncode == 0:
            logger.info("BibTeX trigger detected. Running bibtex...")
            # 2. Run BibTeX
            # We don't halt on error for bibtex as it can be noisy but non-fatal
            bib_process = run_command(['bibtex', 'main'], 30)
            if bib_process.returncode != 0:
                logger.error(f"BibTeX failed: {bib_process.stdout.decode('utf-8', errors='ignore')}")
            else:
                logger.info("BibTeX ran successfully.")
            
            # 3. Second Pass (pdflatex) - Apply bibliography
            process = run_command(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', 'main.tex'], timeout)
            
            # 4. Third Pass (pdflatex) - Fix Cross-refs
            process = run_command(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', 'main.tex'], timeout)
        else:
             logger.info(f"Skipping BibTeX. Needs BibTeX: {needs_bibtex}, Return Code: {process.returncode}")

        if process.returncode != 0:
            # Compilation failed
            stdout = process.stdout.decode('utf-8', errors='ignore')
            # Try to grab stderr too
            stderr = process.stderr.decode('utf-8', errors='ignore')
            full_log = f"{stdout}\n\nErrors:\n{stderr}"
            return jsonify({
                'error': 'Compilation failed',
                'logs': full_log
            }), 400

        pdf_path = os.path.join(work_dir, 'main.pdf')
        if os.path.exists(pdf_path):
            return send_file(pdf_path, mimetype='application/pdf')
        else:
            # Try to return logs if PDF missing despite success code (rare but possible)
            stdout = process.stdout.decode('utf-8', errors='ignore')
            return jsonify({'error': 'PDF not generated', 'logs': stdout}), 500

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

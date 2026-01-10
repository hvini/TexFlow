import requests
import base64

def test_compilation():
    url = 'http://localhost:8080/compile'
    
    latex_code = r"""
    \documentclass{article}
    \begin{document}
    Hello, Server-Side TeX!
    \end{document}
    """
    
    payload = {
        'latex': latex_code,
        'images': []
    }
    
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            print("Success! PDF received.")
            with open('test_output.pdf', 'wb') as f:
                f.write(response.content)
            print("Saved test_output.pdf")
        else:
            print(f"Failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_compilation()

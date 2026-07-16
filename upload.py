import base64
import json
import os
import urllib.request
import urllib.error

# Config
REPO_OWNER = "mouleeswarid-user"
REPO_NAME = "SecureInsiderAI"
FILES_TO_UPLOAD = ["index.html", "styles.css", "app.js", "package.json", "README.md"]

def get_file_sha(path, token):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{path}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("User-Agent", "SecureInsiderAI-Uploader")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        print(f"Error checking {path} SHA: {e.read().decode()}")
        return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def upload_file(path, token, sha=None):
    if not os.path.exists(path):
        print(f"File {path} not found locally. Skipping.")
        return False

    with open(path, "rb") as f:
        content_bytes = f.read()
    
    # Base64 encode file content
    content_b64 = base64.b64encode(content_bytes).decode('utf-8')
    
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{path}"
    
    body = {
        "message": f"Upload {path} via SecureInsiderAI automated uploader",
        "content": content_b64,
        "branch": "main"
    }
    if sha:
        body["sha"] = sha

    req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), method="PUT")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("User-Agent", "SecureInsiderAI-Uploader")

    try:
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                print(f"Successfully uploaded: {path}")
                return True
    except urllib.error.HTTPError as e:
        print(f"Failed to upload {path}: {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"Error uploading {path}: {e}")
    return False

def main():
    print("====================================================")
    print("      SecureInsiderAI GitHub Automated Uploader     ")
    print("====================================================")
    print(f"Target Repo: {REPO_OWNER}/{REPO_NAME}")
    
    token = input("Please enter your GitHub Personal Access Token (PAT): ").strip()
    if not token:
        print("Error: Token cannot be empty.")
        return

    print("\nStarting upload...")
    success_count = 0
    for path in FILES_TO_UPLOAD:
        print(f"Processing {path}...")
        sha = get_file_sha(path, token)
        if sha:
            print(f"Existing file found (SHA: {sha[:8]}...). Overwriting.")
        else:
            print("New file path.")
        
        if upload_file(path, token, sha):
            success_count += 1
            
    print("\n----------------------------------------------------")
    print(f"Upload completed. {success_count}/{len(FILES_TO_UPLOAD)} files uploaded successfully.")
    print("====================================================")

if __name__ == "__main__":
    main()

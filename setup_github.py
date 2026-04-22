import requests
import json
from nacl import encoding, public
import subprocess

SECRETS = {
    "VITE_SUPABASE_URL": "https://sccwjipreeyqdodyaqnu.supabase.co",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_LAIgtbcqV1XI9b6xCCjK5Q_pYGgT_n_"
}

TOKEN = "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"
REPO = "vikashsaravanann/hearwise-child-health"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

def set_secret(secret_name, secret_value, key_id, key_val):
    public_key = public.PublicKey(key_val.encode("utf-8"), encoding.Base64Encoder())
    sealed_box = public.SealedBox(public_key)
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    b64_encrypted = encoding.Base64Encoder().encode(encrypted).decode("utf-8")
    
    url = f"https://api.github.com/repos/{REPO}/actions/secrets/{secret_name}"
    data = {"encrypted_value": b64_encrypted, "key_id": key_id}
    r = requests.put(url, headers=HEADERS, json=data)
    r.raise_for_status()
    print(f"Set secret {secret_name}")

def main():
    # 1. Get repo public key for secrets
    url = f"https://api.github.com/repos/{REPO}/actions/secrets/public-key"
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    key_info = r.json()
    key_id = key_info["key_id"]
    key_val = key_info["key"]
    
    # 2. Set secrets
    for k, v in SECRETS.items():
        set_secret(k, v, key_id, key_val)
        
    # 3. Enable GitHub Pages to use GitHub Actions
    url = f"https://api.github.com/repos/{REPO}/pages"
    r = requests.put(url, headers=HEADERS, json={"build_type": "workflow"})
    if r.status_code == 404 or r.status_code == 400:
        # Create it instead
        data = {"source": {"branch": "main", "path": "/"}, "build_type": "workflow"}
        r = requests.post(url, headers=HEADERS, json={"build_type": "workflow"})
        if not r.ok:
            print("Fallback for pages create:", r.text)

    print("Enabled GitHub Pages via GitHub Actions")
    
if __name__ == "__main__":
    main()

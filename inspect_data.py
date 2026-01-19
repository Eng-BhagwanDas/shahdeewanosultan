import requests
import json

BASE_URL = "http://localhost:3000/api"

def get_all_saints():
    print("--- Fetching English Saints ---")
    try:
        response = requests.get(f"{BASE_URL}/saints?language=en", timeout=10)
        if response.status_code == 200:
            saints = response.json().get('saints', [])
            print(f"Found {len(saints)} English records.")
            
            # Check for duplicates
            ids = [s.get('id') or s.get('saintId') for s in saints]
            unique_ids = set(ids)
            if len(ids) != len(unique_ids):
                print("⚠️  DUPLICATES FOUND in English records!")
                from collections import Counter
                counts = Counter(ids)
                for id, count in counts.items():
                    if count > 1:
                        print(f"  - ID '{id}' appears {count} times.")
            else:
                print("✅ No duplicate IDs in English records.")
                
            print("\n--- Raw Data (First 5) ---")
            print(json.dumps(saints[:5], indent=2))
            
        else:
            print(f"Error: {response.status_code}")
    except Exception as e:
        print(f"Failed: {e}")

    print("\n--- Fetching Urdu Saints ---")
    try:
        response = requests.get(f"{BASE_URL}/saints?language=ur", timeout=10)
        saints = response.json().get('saints', [])
        print(f"Found {len(saints)} Urdu records.")
        ids = [s.get('id') or s.get('saintId') for s in saints]
        unique_ids = set(ids)
        if len(ids) != len(unique_ids):
            print("⚠️  DUPLICATES FOUND in Urdu records!")
    except:
        pass

if __name__ == "__main__":
    get_all_saints()

import requests
import json

BASE_URL = "http://localhost:3000/api"

def inspect_books():
    print("--- Fetching English Books ---")
    try:
        response = requests.get(f"{BASE_URL}/books?language=en", timeout=10)
        books = response.json().get('books', [])
        print(f"Found {len(books)} English books.")
        for b in books:
            print(f" - Title: {b.get('title')}, Lang: {b.get('language')}")
    except Exception as e:
        print(f"Error fetching EN: {e}")

    print("\n--- Fetching Urdu Books ---")
    try:
        response = requests.get(f"{BASE_URL}/books?language=ur", timeout=10)
        books = response.json().get('books', [])
        print(f"Found {len(books)} Urdu books.")
        for b in books:
            print(f" - Title: {b.get('title')}, Lang: {b.get('language')}")
    except Exception as e:
        print(f"Error fetching UR: {e}")

    print("\n--- Fetching Sindhi Books ---")
    try:
        response = requests.get(f"{BASE_URL}/books?language=sd", timeout=10)
        books = response.json().get('books', [])
        print(f"Found {len(books)} Sindhi books.")
        for b in books:
            print(f" - Title: {b.get('title')}, Lang: {b.get('language')}")
    except Exception as e:
        print(f"Error fetching SD: {e}")

if __name__ == "__main__":
    inspect_books()

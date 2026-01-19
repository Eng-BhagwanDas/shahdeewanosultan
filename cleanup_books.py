import requests

BASE_URL = "http://localhost:3000/api"

def cleanup_books():
    print("--- Scanning for Ghost Books (Empty Titles) ---")
    
    languages = ['en', 'ur', 'sd']
    
    for lang in languages:
        try:
            response = requests.get(f"{BASE_URL}/books?language={lang}", timeout=10)
            books = response.json().get('books', [])
            
            for b in books:
                title = b.get('title', '').strip()
                b_id = b.get('id')
                
                if not title:
                    print(f"👻 Found Ghost Book in {lang.upper()} (ID: {b_id}). Deleting...")
                    try:
                        del_res = requests.delete(f"{BASE_URL}/books?id={b_id}")
                        if del_res.status_code == 200:
                             print("   ✅ Deleted successfully.")
                        else:
                             print(f"   ⚠️ Failed: {del_res.text}")
                    except Exception as e:
                        print(f"   ⚠️ Error: {e}")
                else:
                    # Optional: Print valid books to confirm
                    # print(f"✅ Keep: {title} ({lang})")
                    pass
                    
        except Exception as e:
            print(f"Error scanning {lang}: {e}")

if __name__ == "__main__":
    cleanup_books()

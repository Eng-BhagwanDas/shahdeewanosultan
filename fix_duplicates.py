import requests

BASE_URL = "http://localhost:3000/api"

def fix_duplicates():
    print("--- Scanning for Duplicates ---")
    
    languages = ['en', 'ur', 'sd']
    
    for lang in languages:
        print(f"\nProcessing Language: {lang.upper()}")
        try:
            response = requests.get(f"{BASE_URL}/saints?language={lang}", timeout=10)
            saints = response.json().get('saints', [])
        except Exception as e:
            print(f"Failed to fetch {lang}: {e}")
            continue

        # Map of "Clean ID" -> It exists
        clean_ids = set()
        for s in saints:
            s_id = s.get('id', '')
            if len(s_id) < 30: # Simple ID (saint1)
                clean_ids.add(s_id)
                
        print(f"Found clean IDs: {clean_ids}")
        
        for s in saints:
            s_id = s.get('id', '')
            s_saintId = s.get('saintId', '')
            
            # If this is a Long ID (UUID)
            if len(s_id) > 30:
                # Check if it is a duplicate of a clean ID
                # The 'saintId' field in the UUID record usually holds the target ID (e.g., saint1)
                target_clean_id = s_saintId
                
                if target_clean_id in clean_ids:
                    print(f"❌ FOUND DUPLICATE: UUID-Record {s_id} (saintId: {target_clean_id})")
                    print(f"   Matches existing Clean-Record {target_clean_id}. DELETING UUID-Record...")
                    
                    # Delete it
                    try:
                        del_res = requests.delete(f"{BASE_URL}/saints?id={s_id}")
                        if del_res.status_code == 200:
                            print("   ✅ Deleted successfully.")
                        else:
                            print(f"   ⚠️ Failed to delete: {del_res.text}")
                    except Exception as e:
                        print(f"   ⚠️ Error deleting: {e}")
                else:
                    print(f"ℹ️ Found UUID record {s_id} but no clean duplicate '{target_clean_id}' found. Keeping it.")

if __name__ == "__main__":
    fix_duplicates()

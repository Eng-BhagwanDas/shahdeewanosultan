import requests
import json

BASE_URL = "http://localhost:3000/api"

def inspect_audio():
    print("--- Fetching Audio Files ---")
    try:
        response = requests.get(f"{BASE_URL}/audio?language=en", timeout=10)
        audio_files = response.json().get('audioFiles', [])
        print(f"Found {len(audio_files)} audio files.\n")
        
        for audio in audio_files:
            print(f"Title: {audio.get('title')}")
            print(f"  - audioUrl: {audio.get('audioUrl')}")
            print(f"  - Language: {audio.get('language')}")
            print(f"  - Category: {audio.get('category')}")
            print()
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_audio()

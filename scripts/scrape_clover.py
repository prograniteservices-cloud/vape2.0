import requests
import json
import os
import time

MERCHANT_ID = "WV2BFYZ60SBX1"
OUTPUT_FILE = "inventory_full.json"
PARTIAL_FILE = "inventory_part_1.json"

def scrape_inventory():
    print(f"Starting scrape for Merchant: {MERCHANT_ID}")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://vape-more.cloveronline.com/"
    }

    # Load existing items
    all_items = []
    if os.path.exists(PARTIAL_FILE):
        try:
            with open(PARTIAL_FILE, 'r', encoding='utf-8') as f:
                all_items = json.load(f)
            print(f"Loaded {len(all_items)} items from {PARTIAL_FILE}")
        except Exception as e:
            print(f"Error loading {PARTIAL_FILE}: {e}")

    # Set initial offset based on existing items
    offset = len(all_items)
    limit = 100
    
    print(f"Continuing from offset {offset}...")

    while True:
        # Note: Internal Clover Online Ordering API endpoint for items
        paginated_url = f"https://www.clover.com/online-ordering/api/v1/merchants/{MERCHANT_ID}/items?limit={limit}&offset={offset}"
        try:
            res = requests.get(paginated_url, headers=headers)
            res.raise_for_status()
            batch = res.json()
            items = batch.get('items', [])
            
            if not items:
                print("No more items found.")
                break
                
            all_items.extend(items)
            print(f"Fetched {len(all_items)} items total...")
            
            # Save progress incrementally
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(all_items, f, indent=2)
            
            offset += limit
            time.sleep(0.5) # Be polite
            
            if len(items) < limit:
                print("Reached end of inventory.")
                break
                
        except Exception as ex:
            print(f"Pagination failed at offset {offset}: {ex}")
            break
    
    if all_items:
        print(f"Successfully saved {len(all_items)} items to {OUTPUT_FILE}.")

if __name__ == "__main__":
    scrape_inventory()

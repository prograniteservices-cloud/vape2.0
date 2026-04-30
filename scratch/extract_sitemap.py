import re
import json

sitemap_path = r'C:\Users\heath\.gemini\antigravity\brain\0c046d8c-a229-4c98-abf1-ad71ad8d0f62\.system_generated\steps\159\content.md'

with open(sitemap_path, 'r', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'https://vape-more.cloveronline.com/[^<\s]+', content)
items = []
for url in urls:
    # Typical format: https://vape-more.cloveronline.com/name-ID
    # We can try to extract the name
    parts = url.split('/')[-1].split('-')
    if len(parts) > 1:
        id = parts[-1]
        name = ' '.join(parts[:-1]).replace('%20', ' ').title()
        items.append({"name": name, "url": url})

with open('sitemap_items.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2)

print(f"Extracted {len(items)} items from sitemap.")

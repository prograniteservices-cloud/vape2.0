import json
with open('inventory_part_1.json', 'r') as f:
    data = json.load(f)
print(len(data))

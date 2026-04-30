const fs = require('fs');
const path = require('path');

const INVENTORY_FILE = path.join(__dirname, '..', 'src', 'data', 'inventory.json');

const categoryToImage = {
    'All Items': '/assets/categories/vapes.png',
    'Cigarettes': '/assets/categories/cigarettes.png',
    'Lighters & Torches': '/assets/categories/lighters_torches.png',
    'Smoking Accessories': '/assets/categories/smoking_accessories.png',
    'Adult Novelties': '/assets/categories/adult_novelties.png',
    'Vape Devices': '/assets/categories/vape_devices.png',
    'Candy & Snacks': '/assets/categories/candy_snacks.png',
    'Vapes': '/assets/categories/vapes.png',
    'CBD & Delta': '/assets/categories/cbd_delta.png',
    'Cigars': '/assets/categories/cigars.png',
    'Chewing Tobacco': '/assets/categories/chewing_tobacco.png',
    'E-Liquids': '/assets/categories/e_liquids.png',
    'Glassware': '/assets/categories/glassware.png',
    'Miscellaneous': '/assets/categories/miscellaneous.png'
};

function main() {
    if (!fs.existsSync(INVENTORY_FILE)) {
        console.error('Inventory file not found!');
        return;
    }

    const inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
    
    const updatedInventory = inventory.map(item => {
        const newImage = categoryToImage[item.category] || '/assets/categories/miscellaneous.png';
        return {
            ...item,
            image: newImage
        };
    });

    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(updatedInventory, null, 2));
    console.log(`Updated images for ${updatedInventory.length} items.`);
}

main();

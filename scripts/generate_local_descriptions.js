const fs = require('fs');
const path = require('path');

const INVENTORY_FILE = path.join(__dirname, '..', 'src', 'data', 'inventory.json');

// Helper to check if name contains any of the keywords (case-insensitive)
function hasWord(name, words) {
    const lowerName = name.toLowerCase();
    return words.some(w => lowerName.includes(w.toLowerCase()));
}

// Extract flavor profile from name
function extractFlavor(name) {
    const flavors = [
        'Kiwi', 'Berry', 'Melon', 'Sweet', 'Watermelon', 'Grape', 'Mint', 'Ice', 
        'Strawberry', 'Mango', 'Peach', 'Apple', 'Blueberry', 'Cherry', 'Lemon', 
        'Pineapple', 'Banana', 'Vanilla', 'Caramel', 'Chocolate', 'Coffee', 'Tobacco', 
        'Menthol', 'Blue Razz', 'Cotton Candy', 'Lush Ice', 'Cool Mint', 'Gummy',
        'Sour Apple', 'Pina Colada', 'Dragonfruit', 'Guava', 'Lychee', 'Papaya', 'Cola',
        'Energy', 'Rainbow', 'Tropical'
    ];
    
    const found = flavors.filter(f => name.toLowerCase().includes(f.toLowerCase()));
    if (found.length > 0) {
        return found.join(' and ');
    }
    return null;
}

// Generate description based on heuristics
function generateDescription(item) {
    const name = item.name;
    const cat = item.category || 'All Items';
    const lowerName = name.toLowerCase();
    
    // Check specific brands/terms first
    if (hasWord(name, ['3CHI'])) return 'Premium 3CHI product delivering a pure, potent, and uplifting experience.';
    if (hasWord(name, ['Swisher Sweets'])) return 'Classic Swisher Sweets cigarillos for a reliably smooth and sweet smoke.';
    if (hasWord(name, ['Backwood', 'Backwoods'])) return 'Authentic Backwoods cigars wrapped in a natural leaf for a robust, rustic flavor.';
    if (hasWord(name, ['5 Hour Energy'])) return 'Quick, effective 5-Hour Energy shot to keep you focused and energized all day.';
    if (hasWord(name, ['White Owl'])) return 'Smooth-smoking White Owl cigars with a slow burn and excellent flavor.';
    if (hasWord(name, ['Kush'])) return 'High-quality Kush blend offering a deeply relaxing and soothing experience.';
    if (hasWord(name, ['Kratom', 'Organikratom', 'Opms'])) return 'Premium kratom product sourced for maximum purity and effectiveness.';
    if (hasWord(name, ['Live Resin'])) return 'Top-tier live resin extract preserving natural terpenes for maximum flavor and potency.';
    if (hasWord(name, ['Grinder'])) return 'Durable multi-piece grinder designed for a smooth, consistent crush every time.';
    if (hasWord(name, ['Cart Battery', '510 Cart', '510 Battery'])) return 'Reliable 510-threaded battery to power your favorite vape cartridges.';
    if (hasWord(name, ['Elf Bar', 'Elfbar'])) return 'Popular Elf Bar disposable vape known for exceptional flavor and long-lasting puffs.';
    if (hasWord(name, ['Geek Bar', 'Geekbar'])) return 'Premium Geek Bar disposable featuring advanced mesh coils and intense flavor profiles.';
    if (hasWord(name, ['Raw', 'Raw Cone', 'Raw Paper'])) return 'Authentic RAW unrefined rolling papers and cones for a clean, natural smoke.';
    if (hasWord(name, ['Clipper', 'Bic', 'Torch'])) return 'Dependable lighter or torch, perfect for an even and reliable flame every time.';
    if (hasWord(name, ['Bong', 'Water Pipe'])) return 'High-quality glass water pipe offering smooth, water-filtered hits.';
    if (hasWord(name, ['Gummies', 'Edible'])) return 'Delicious and potent infused gummies for a long-lasting, enjoyable experience.';

    // Flavor based generic descriptions
    const flavor = extractFlavor(name);

    if (cat === 'Vapes' || cat === 'Vape Devices' || hasWord(name, ['Vape', 'Disposable', 'Puff'])) {
        if (flavor) return `Convenient and flavorful disposable vape featuring a delicious ${flavor.toLowerCase()} profile.`;
        return `High-quality disposable vape device engineered for smooth hits and long-lasting satisfaction.`;
    }

    if (cat === 'E-Liquids' || hasWord(name, ['Juice', 'Liquid', 'Salt Nic'])) {
        if (flavor) return `Premium e-liquid blend delivering an intense and satisfying ${flavor.toLowerCase()} flavor.`;
        return `Top-shelf vape juice crafted for optimal vapor production and rich taste.`;
    }

    if (cat === 'Cigars') {
        if (flavor) return `Premium cigar infused with notes of ${flavor.toLowerCase()} for a relaxing, aromatic smoke.`;
        return `Expertly crafted cigar providing a rich, complex flavor and a smooth draw.`;
    }

    if (cat === 'Cigarettes') {
        if (hasWord(name, ['Menthol'])) return `Classic menthol cigarettes offering a crisp, refreshing, and smooth smoke.`;
        return `Premium brand cigarettes known for their consistent quality and classic tobacco flavor.`;
    }

    if (cat === 'Chewing Tobacco' || hasWord(name, ['Dip', 'Snuff', 'Zyn', 'Rogue'])) {
        if (hasWord(name, ['Zyn', 'Rogue', 'Pouches'])) return `Tobacco-free nicotine pouches for a clean, discreet, and satisfying experience.`;
        return `Premium smokeless tobacco offering a robust flavor and satisfying pinch.`;
    }

    if (cat === 'CBD & Delta' || hasWord(name, ['CBD', 'Delta', 'THC'])) {
        if (hasWord(name, ['Cart', 'Cartridge'])) return `High-potency extract cartridge designed for a smooth, fast-acting experience.`;
        return `Premium hemp-derived product carefully crafted for consistent quality and relaxation.`;
    }

    if (cat === 'Glassware' || hasWord(name, ['Pipe', 'Bowl', 'Chillum'])) {
        return `Hand-crafted glass piece designed for durability, easy cleaning, and smooth performance.`;
    }

    if (cat === 'Candy & Snacks') {
        if (flavor) return `Tasty snack featuring a burst of ${flavor.toLowerCase()} flavor to satisfy your cravings.`;
        return `Delicious and satisfying snack, perfect for a quick treat on the go.`;
    }

    if (cat === 'Adult Novelties') {
        return `High-quality novelty item designed for fun, excitement, and ultimate satisfaction.`;
    }

    if (cat === 'Smoking Accessories' || hasWord(name, ['Tray', 'Scale', 'Cleaner', 'Wrap', 'Paper'])) {
        return `Essential smoking accessory crafted to elevate and simplify your daily routine.`;
    }
    
    if (cat === 'Lighters & Torches') {
        return `Reliable and powerful lighter, built to deliver a steady flame whenever you need it.`;
    }

    // Fallbacks
    if (flavor) {
        return `Premium product featuring an enjoyable and refreshing ${flavor.toLowerCase()} essence.`;
    }
    
    // Very generic fallback
    return `High-quality smoke shop essential offering great value and reliable performance.`;
}

function main() {
    if (!fs.existsSync(INVENTORY_FILE)) {
        console.error('Inventory file not found!');
        return;
    }

    const inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf-8'));
    let updatedCount = 0;

    for (let i = 0; i < inventory.length; i++) {
        const item = inventory[i];
        
        // Always generate a fresh description unless they manually wrote a non-default one, 
        // but given the prompt, we want to enrich the ones that are empty or "High-quality"
        if (!item.description || item.description.startsWith('High-quality') || item.description === '') {
            item.description = generateDescription(item);
            updatedCount++;
        }
    }

    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
    console.log(`Successfully generated and updated ${updatedCount} descriptions locally!`);
}

main();
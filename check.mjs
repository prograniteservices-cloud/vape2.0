import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/inventory.json', 'utf8'));

const rawCategoryMap = {
    'vapes': 'vapes',
    'cigarettes': 'cigarettes',
    'lighters & torches': 'lighters-torches',
    'smoking accessories': 'smoking-accessories',
    'adult novelties': 'adult-novelties',
    'vape devices': 'vape-devices',
    'candy & snacks': 'candy-snacks',
    'cbd & delta': 'cbd-delta',
    'cigars': 'cigars',
    'chewing tobacco': 'chewing-tobacco',
    'e-liquids': 'e-liquids',
    'glassware': 'glassware',
    'miscellaneous': 'miscellaneous',
    'all items': 'root'
};

const products = data.map((item, index) => {
    const rawCategory = String(item.category || '').trim().toLowerCase();
    const categoryId = rawCategoryMap[rawCategory] || 'miscellaneous';
    return {
        id: `prod-${index}`,
        name: item.name,
        category: item.category,
        categoryId
    };
});

console.log('Total products:', products.length);
console.log('Cigars:', products.filter(p => p.categoryId === 'cigars').length);
console.log('Sample cigars:', products.filter(p => p.categoryId === 'cigars').slice(0, 2));

console.log('Vapes:', products.filter(p => p.categoryId === 'vapes').length);

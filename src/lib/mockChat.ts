export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    type?: 'text' | 'rich' | 'tour';
    metadata?: {
        highlights?: string[]; // IDs of elements to highlight
        suggestions?: string[];
        links?: { label: string; action: string }[];
    };
}

export const SCRIPTED_RESPONSES: Record<string, string[]> = {
    'Find watermelon flavored vapes': [
        "I'm scanning our inventory for watermelon options...",
        "I've found 48 items with watermelon notes! I can showcase the top-rated ones for you, or filter them by brand.",
        "In the full version of our AI, I would instantly filter your dashboard to show only matching products."
    ],
    'Show me Elf Bar products': [
        "Looking up the Elf Bar collection...",
        "We have a wide variety of Elf Bar disposables in stock, ranging from 5000 to 10000 hits.",
        "Clicking this would normally narrow your view to just the Elf Bar brand tree."
    ],
    'What vapes have 10000 hits?': [
        "Searching for high-capacity vapes...",
        "I've identified 12 models that offer 10,000+ puffs, including the latest BC10000 series.",
        "Live AI can compare the battery life and price-per-puff for all these options simultaneously."
    ],
    'Help me find a blue vape': [
        "Searching products by visual color...",
        "Matching 'Blue' aesthetic across all categories...",
        "I can find every product with blue packaging or blue LEDs. This is part of our upcoming Visual Intelligence update!"
    ],
    "What's the difference between brands?": [
        "Analyzing brand profiles...",
        "Brand A focuses on intense flavor profiles, while Brand B is known for its smooth airflow and device durability.",
        "In the future, I can generate a side-by-side comparison table for any two brands you're interested in."
    ],
    'Show me sale items': [
        "Checking current promotions...",
        "The 'Sale' category is currently featuring 15% off on all fruit flavors!",
        "I would normally highlight the 'Sale' button in the sidebar and show you the best deals first."
    ]
};

export const GUIDED_TOUR_SCRIPT: string[] = [
    "Welcome to Vape 2.0! I'm your AI guide.",
    "On your left, you'll find our dynamic category tree. It expands as you explore to keep things simple.",
    "In the center is our irregular card grid—designed for 2026-era visual impact.",
    "Try clicking one of the examples below to see what I can do for you!"
];

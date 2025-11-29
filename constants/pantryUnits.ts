export type UnitCategory = 'volume' | 'weight' | 'count' | 'custom';

export interface Unit {
    value: string;
    label: string; 
    category: UnitCategory;
    abbreviation?: string;
}

export const PANTRY_UNITS: Unit[] = [
    { value: 'ml', label: 'Milliliters (ml)', category: 'volume', abbreviation: 'ml' },
    { value: 'l', label: 'Liters (L)', category: 'volume', abbreviation: 'L' },

    { value: 'tsp', label: 'Teaspoon (L)', category: 'volume', abbreviation: 'tsp' },
    { value: 'tbsp', label: 'Tablespoon (tbsp)', category: 'volume', abbreviation: 'tbsp' },
    { value: 'floz', label: 'Fluid Ounces (fl oz)', category: 'volume', abbreviation: 'fl oz' },
    { value: 'cup', label: 'Cup', category: 'volume', abbreviation: 'cup' },
    { value: 'pint', label: 'Pint (pt)', category: 'volume', abbreviation: 'pt' },
    { value: 'quart', label: 'Quart (qt)', category: 'volume', abbreviation: 'qt' },
    { value: 'gallon', label: 'Gallon (gal)', category: 'volume', abbreviation: 'gal' },

    { value: 'g', label: 'Grams (g)', category: 'weight', abbreviation: 'g' },
    { value: 'kg', label: 'Kilograms (kg)', category: 'weight', abbreviation: 'kg' },
    
    { value: 'oz', label: 'Ounces (oz)', category: 'weight', abbreviation: 'oz' },
    { value: 'lb', label: 'Pounds (lb)', category: 'weight', abbreviation: 'lb' },

    { value: 'piece', label: 'Piece(s)', category: 'count'},
    { value: 'item', label: 'Item(s)', category: 'count'},
    { value: 'package', label: 'Package(s)', category: 'count'},
    { value: 'can', label: 'Can(s)', category: 'count'},
    { value: 'bottle', label: 'Bottle(s)', category: 'count'},
    { value: 'box', label: 'Box(es)', category: 'count'},
    { value: 'bag', label: 'Bag(s)', category: 'count'},
    { value: 'bunch', label: 'Bunch(es)', category: 'count'},
];

export const UNIT_CATEGORIES = [
    { key: 'volume', label: 'Volume' },
    { key: 'weight', label: 'Weight' },
    { key: 'count', label: 'Count' },    
] as const;

export function getUnitDisplay(unitValue: string, quantity?: string | number): string {
    const unit = PANTRY_UNITS.find(u => u.value === unitValue);

    if (!unit) { return unitValue; }

    return unit.abbreviation || unit.value;
}

export function formatQuantityWithUnit(quantity?: string | number, unit?: string): string {
    if (!quantity) { return 'not specified'; }
    if (!unit) { return String(quantity); }

    return `${quantity} ${getUnitDisplay(unit, quantity)}`;
}

export function parseQuantityString(quantityString: string): { 
    quantity: string; 
    unit: string 
} {
    const trimmed = quantityString.trim();
    const match = trimmed.match(/^([\d.]+)\s*(.*)$/);

    if (match) {
        return {
            quantity: match[1],
            unit: match[2] || '',
        };
    }

    return {
        quantity: trimmed,
        unit: '',
    };
}
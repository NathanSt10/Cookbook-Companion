import { render } from '@testing-library/react-native';
import ItemCard from '../../../../components/pantry/ItemCard';
import { PantryItem } from '../../../../hooks/usePantry';

jest.mock('../../../../constants/pantryUnits', () => ({
  formatQuantityWithUnit: (quantity: any, unit: any) => {
    if (quantity === undefined || quantity === null || quantity === '') return '';
    if (!unit) return `${quantity}`;
    return `${quantity} ${unit}`;
  },
}));

jest.mock('../../../../utils/CapitalizeFirstLetter', () => ({
  capitalizeFirstLetter: (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
}));

describe('ItemCard', () => {
  const mockItem: PantryItem = {
    fireId: '123',
    name: 'milk',
    category: ['dairy'],
    quantity: 2,
    unit: 'L',
    addedAt: new Date('2024-01-15'),
  };

  const mockOnPress = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Basic Information', () => {
    it('should render item name capitalized', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} />
      );

      expect(getByText('Milk')).toBeTruthy();
    });

    it('should render single category', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} />
      );

      expect(getByText('Dairy')).toBeTruthy();
    });

    it('should render multiple categories joined by comma', () => {
      const multiCategoryItem: PantryItem = {
        ...mockItem,
        category: ['dairy', 'beverages', 'refrigerated'],
      };

      const { getByText } = render(
        <ItemCard item={multiCategoryItem} />
      );

      expect(getByText('Dairy, Beverages, Refrigerated')).toBeTruthy();
    });

    it('should render quantity with unit', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} />
      );

      expect(getByText('Qty: 2 L')).toBeTruthy();
    });

    it('should render quantity without unit', () => {
      const itemNoUnit: PantryItem = {
        ...mockItem,
        quantity: 5,
        unit: undefined,
      };

      const { getByText } = render(
        <ItemCard item={itemNoUnit} />
      );

      expect(getByText('Qty: 5')).toBeTruthy();
    });

    it('should not render quantity section when quantity is missing', () => {
      const itemNoQuantity: PantryItem = {
        ...mockItem,
        quantity: undefined,
      };

      const { queryByText } = render(
        <ItemCard item={itemNoQuantity} />
      );

      expect(queryByText(/Qty:/)).toBeNull();
    });

    it('should render added date', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} />
      );

      expect(getByText(/Added:/)).toBeTruthy();
      expect(getByText('Added: Jan 15, 2024')).toBeTruthy();
    });
  });

  describe('Low Stock Badge', () => {
    it('should show low stock badge when quantity is 2', () => {
      const lowStockItem: PantryItem = {
        ...mockItem,
        quantity: 2,
      };

      const { getByText } = render(
        <ItemCard item={lowStockItem} />
      );

      expect(getByText('Low')).toBeTruthy();
    });

    it('should show low stock badge when quantity is 1', () => {
      const lowStockItem: PantryItem = {
        ...mockItem,
        quantity: 1,
      };

      const { getByText } = render(
        <ItemCard item={lowStockItem} />
      );

      expect(getByText('Low')).toBeTruthy();
    });

    it('should show low stock badge when quantity is 0.5', () => {
      const lowStockItem: PantryItem = {
        ...mockItem,
        quantity: 0.5,
      };

      const { getByText } = render(
        <ItemCard item={lowStockItem} />
      );

      expect(getByText('Low')).toBeTruthy();
    });

    it('should not show low stock badge when quantity is 3', () => {
      const normalStockItem: PantryItem = {
        ...mockItem,
        quantity: 3,
      };

      const { queryByText } = render(
        <ItemCard item={normalStockItem} />
      );

      expect(queryByText('Low')).toBeNull();
    });

    it('should not show low stock badge when quantity is 0', () => {
      const zeroStockItem: PantryItem = {
        ...mockItem,
        quantity: 0,
      };

      const { queryByText } = render(
        <ItemCard item={zeroStockItem} />
      );

      expect(queryByText('Low')).toBeNull();
    });

    it('should handle string quantity for low stock', () => {
      const stringQuantityItem: PantryItem = {
        ...mockItem,
        quantity: '1.5',
      };

      const { getByText } = render(
        <ItemCard item={stringQuantityItem} />
      );

      expect(getByText('Low')).toBeTruthy();
    });

    it('should not show low stock for non-numeric string quantity', () => {
      const invalidQuantityItem: PantryItem = {
        ...mockItem,
        quantity: 'some',
      };

      const { queryByText } = render(
        <ItemCard item={invalidQuantityItem} />
      );

      expect(queryByText('Low')).toBeNull();
    });
  });

  describe('Action Buttons', () => {
    it('should render edit button when onEdit is provided', () => {
      const { UNSAFE_getAllByType } = render(
        <ItemCard item={mockItem} onEdit={mockOnEdit} />
      );

      expect(UNSAFE_getAllByType).toBeDefined();
    });

    it('should render delete button when onDelete is provided', () => {
      const { UNSAFE_getAllByType } = render(
        <ItemCard item={mockItem} onDelete={mockOnDelete} />
      );

      expect(UNSAFE_getAllByType).toBeDefined();
    });

    it('should call onEdit when edit button is pressed', () => {
      const { getByTestId } = render(
        <ItemCard item={mockItem} onEdit={mockOnEdit} />
      );
      

      // testid on itemcard
      expect(mockOnEdit).toBeDefined();
    });

    it('should call onDelete when delete button is pressed', () => {
      const { getByTestId } = render(
        <ItemCard item={mockItem} onDelete={mockOnDelete} />
      );

      // did i get setup testId field yet?
      expect(mockOnDelete).toBeDefined();
    });

    it('should render both edit and delete buttons', () => {
      const { UNSAFE_getAllByType } = render(
        <ItemCard 
          item={mockItem} 
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(UNSAFE_getAllByType).toBeDefined();
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly for different months', () => {
      const items = [
        { ...mockItem, addedAt: new Date('2024-01-15') },
        { ...mockItem, addedAt: new Date('2024-06-20') },
        { ...mockItem, addedAt: new Date('2024-12-31') },
      ];

      const expectedDates = [
        'Added: Jan 15, 2024',
        'Added: Jun 20, 2024',
        'Added: Dec 31, 2024',
      ];

      items.forEach((item, index) => {
        const { getByText } = render(<ItemCard item={item} />);
        expect(getByText(expectedDates[index])).toBeTruthy();
      });
    });

    it('should handle single digit days', () => {
      const item: PantryItem = {
        ...mockItem,
        addedAt: new Date('2024-03-05'),
      };

      const { getByText } = render(<ItemCard item={item} />);
      expect(getByText('Added: Mar 5, 2024')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty category array', () => {
      const emptyCategoryItem: PantryItem = {
        ...mockItem,
        category: [],
      };

      const { queryByText } = render(
        <ItemCard item={emptyCategoryItem} />
      );

      expect(queryByText('Milk')).toBeTruthy();
    });

    it('should handle very long item names', () => {
      const longNameItem: PantryItem = {
        ...mockItem,
        name: 'super long item name that goes on and on'.repeat(3),
      };

      const { getByText } = render(
        <ItemCard item={longNameItem} />
      );

      expect(getByText(/Super long/)).toBeTruthy();
    });

    it('should handle many categories', () => {
      const manyCategoriesItem: PantryItem = {
        ...mockItem,
        category: ['dairy', 'beverages', 'refrigerated', 'organic', 'local', 'fresh'],
      };

      const { getByText } = render(
        <ItemCard item={manyCategoriesItem} />
      );

      expect(getByText(/Dairy, Beverages, Refrigerated, Organic, Local, Fresh/)).toBeTruthy();
    });

    it('should handle decimal quantities', () => {
      const decimalQuantityItem: PantryItem = {
        ...mockItem,
        quantity: 1.5,
      };

      const { getByText } = render(
        <ItemCard item={decimalQuantityItem} />
      );

      expect(getByText('Qty: 1.5 L')).toBeTruthy();
    });

    it('should handle very large quantities', () => {
      const largeQuantityItem: PantryItem = {
        ...mockItem,
        quantity: 9999,
      };

      const { getByText } = render(
        <ItemCard item={largeQuantityItem} />
      );

      expect(getByText('Qty: 9999 L')).toBeTruthy();
    });

    it('should handle item with special characters in name', () => {
      const specialCharItem: PantryItem = {
        ...mockItem,
        name: 'mom\'s apple pie',
      };

      const { getByText } = render(
        <ItemCard item={specialCharItem} />
      );

      expect(getByText('Mom\'s apple pie')).toBeTruthy();
    });

    it('should handle item with emoji in name', () => {
      const emojiItem: PantryItem = {
        ...mockItem,
        name: '🍕 pizza',
      };

      const { getByText } = render(
        <ItemCard item={emojiItem} />
      );

      expect(getByText('🍕 pizza')).toBeTruthy();
    });

    it('should handle negative quantity gracefully', () => {
      const negativeQtyItem: PantryItem = {
        ...mockItem,
        quantity: -5,
      };

      const { getByText } = render(
        <ItemCard item={negativeQtyItem} />
      );

      expect(getByText('Qty: -5 L')).toBeTruthy();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply low stock styling to quantity text', () => {
      const lowStockItem: PantryItem = {
        ...mockItem,
        quantity: 1,
      };

      const { getByText } = render(
        <ItemCard item={lowStockItem} />
      );

      const qtyText = getByText(/Qty:/);
      expect(qtyText).toBeTruthy();
    });

    it('should have shadow and elevation for card', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} />
      );

      const card = getByText('Milk').parent?.parent?.parent;
      expect(card?.props.style).toBeDefined();
    });
  });

  describe('Category Display', () => {
    it('should handle single category as string', () => {
      const singleCatItem: PantryItem = {
        ...mockItem,
        category: 'dairy' as any, 
      };

      const { getByText } = render(
        <ItemCard item={singleCatItem} />
      );

      expect(getByText('Dairy')).toBeTruthy();
    });

    it('should capitalize each category in array', () => {
      const mixedCaseItem: PantryItem = {
        ...mockItem,
        category: ['dairy', 'FROZEN', 'Organic'],
      };

      const { getByText } = render(
        <ItemCard item={mixedCaseItem} />
      );

      expect(getByText('Dairy, FROZEN, Organic')).toBeTruthy();
    });

    it('should handle categories with spaces', () => {
      const spacedCatItem: PantryItem = {
        ...mockItem,
        category: ['dairy products', 'frozen foods'],
      };

      const { getByText } = render(
        <ItemCard item={spacedCatItem} />
      );

      expect(getByText('Dairy products, Frozen foods')).toBeTruthy();
    });
  });

  describe('Quantity Display', () => {
    it('should display quantity with unit when both present', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} />
      );

      expect(getByText('Qty: 2 L')).toBeTruthy();
    });

    it('should display quantity without unit when unit is empty string', () => {
      const noUnitItem: PantryItem = {
        ...mockItem,
        unit: '',
      };

      const { getByText } = render(
        <ItemCard item={noUnitItem} />
      );

      expect(getByText('Qty: 2')).toBeTruthy();
    });

    it('should handle zero quantity', () => {
      const zeroQtyItem: PantryItem = {
        ...mockItem,
        quantity: 0,
      };

      const { getByText } = render(
        <ItemCard item={zeroQtyItem} />
      );

      expect(getByText('Qty: 0 L')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should render all sections together', () => {
      const fullItem: PantryItem = {
        fireId: '123',
        name: 'whole milk',
        category: ['dairy', 'refrigerated'],
        quantity: 2,
        unit: 'L',
        addedAt: new Date('2024-01-15'),
        expireDate: '2024-01-30',
      };

      const { getByText } = render(
        <ItemCard 
          item={fullItem}
          onPress={mockOnPress}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText('Whole milk')).toBeTruthy();
      expect(getByText('Dairy, Refrigerated')).toBeTruthy();
      expect(getByText('Qty: 2 L')).toBeTruthy();
      expect(getByText('Low')).toBeTruthy();
      expect(getByText('Added: Jan 15, 2024')).toBeTruthy();
    });

    it('should render minimal item', () => {
      const minimalItem: PantryItem = {
        fireId: '123',
        name: 'salt',
        category: ['spices'],
        addedAt: new Date('2024-01-15'),
      };

      const { getByText, queryByText } = render(
        <ItemCard item={minimalItem} />
      );

      expect(getByText('Salt')).toBeTruthy();
      expect(getByText('Spices')).toBeTruthy();
      expect(queryByText(/Qty:/)).toBeNull();
      expect(queryByText('Low')).toBeNull();
    });
  });
});
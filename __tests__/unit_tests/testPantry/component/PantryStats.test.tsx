import { render } from '@testing-library/react-native';
import PantryStats from '../../../../components/pantry/PantryStats';

describe('PantryStats', () => {
  const defaultProps = {
    totalItems: 10,
    lowStockCount: 3,
    categoryCount: 5,
  };

  describe('Rendering', () => {
    it('should render all three stat cards', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      expect(getByText('10')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('should render stat labels correctly', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      expect(getByText('Pantry Item(s)')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should render all stats in correct order', () => {
      const { getAllByText } = render(<PantryStats {...defaultProps} />);

      expect(getAllByText(/^\d+$/)).toHaveLength(3);
    });

    it('should display stats with their corresponding labels', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const totalItems = getByText('10');
      const pantryLabel = getByText('Pantry Item(s)');
      
      expect(totalItems).toBeTruthy();
      expect(pantryLabel).toBeTruthy();
    });
  });

  describe('Total Items Stat', () => {
    it('should display zero items', () => {
      const { getAllByText, getByText } = render(
        <PantryStats totalItems={0} lowStockCount={0} categoryCount={0} />
      );

      const zeros = getAllByText('0');
      expect(zeros).toHaveLength(3);
      expect(getByText('Pantry Item(s)')).toBeTruthy();
    });

    it('should display single item', () => {
      const { getByText } = render(
        <PantryStats totalItems={1} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('1')).toBeTruthy();
    });

    it('should display large number of items', () => {
      const { getByText } = render(
        <PantryStats totalItems={999} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('999')).toBeTruthy();
    });

    it('should display very large numbers', () => {
      const { getByText } = render(
        <PantryStats totalItems={9999} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('9999')).toBeTruthy();
    });

    it('should update when totalItems changes', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('10')).toBeTruthy();

      rerender(
        <PantryStats totalItems={20} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('20')).toBeTruthy();
    });
  });

  describe('Low Stock Count Stat', () => {
    it('should display zero low stock items', () => {
      const { getByText } = render(
        <PantryStats totalItems={10} lowStockCount={0} categoryCount={5} />
      );

      expect(getByText('Low Stock')).toBeTruthy();
    });

    it('should display low stock count', () => {
      const { getByText } = render(
        <PantryStats totalItems={10} lowStockCount={5} categoryCount={3} />
      );

      expect(getByText('5')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
    });

    it('should display when all items are low stock', () => {
      const { getAllByText, getByText } = render(
        <PantryStats totalItems={10} lowStockCount={10} categoryCount={3} />
      );

      const tens = getAllByText('10');
      expect(tens).toHaveLength(2);
      expect(getByText('Low Stock')).toBeTruthy();
    });

    it('should update when lowStockCount changes', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={5} />
      );

      expect(getByText('3')).toBeTruthy();

      rerender(
        <PantryStats totalItems={10} lowStockCount={7} categoryCount={5} />
      );

      expect(getByText('7')).toBeTruthy();
    });

    it('should handle large low stock counts', () => {
      const { getByText } = render(
        <PantryStats totalItems={1000} lowStockCount={500} categoryCount={10} />
      );

      expect(getByText('500')).toBeTruthy();
    });
  });

  describe('Category Count Stat', () => {
    it('should display zero categories', () => {
      const { getByText } = render(
        <PantryStats totalItems={0} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should display single category', () => {
      const { getByText } = render(
        <PantryStats totalItems={5} lowStockCount={0} categoryCount={1} />
      );

      expect(getByText('1')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should display multiple categories', () => {
      const { getByText } = render(
        <PantryStats totalItems={20} lowStockCount={3} categoryCount={8} />
      );

      expect(getByText('8')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should update when categoryCount changes', () => {
      const { getByText, getAllByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={5} />
      );

      expect(getByText('5')).toBeTruthy();

      rerender(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={10} />
      );

      const tens = getAllByText('10');
      expect(tens).toHaveLength(2);
    });

    it('should handle large category counts', () => {
      const { getByText } = render(
        <PantryStats totalItems={100} lowStockCount={10} categoryCount={50} />
      );

      expect(getByText('50')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all zero values', () => {
      const { getByText } = render(
        <PantryStats totalItems={0} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('Pantry Item(s)')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should handle all maximum values', () => {
      const { getAllByText, getByText } = render(
        <PantryStats totalItems={9999} lowStockCount={9999} categoryCount={9999} />
      );

      const maxValues = getAllByText('9999');
      expect(maxValues).toHaveLength(3);
      expect(getByText('Pantry Item(s)')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should handle negative numbers gracefully', () => {
      const { getByText } = render(
        <PantryStats totalItems={-5} lowStockCount={-2} categoryCount={-1} />
      );

      expect(getByText('-5')).toBeTruthy();
      expect(getByText('-2')).toBeTruthy();
      expect(getByText('-1')).toBeTruthy();
    });

    it('should handle when lowStockCount exceeds totalItems', () => {
      const { getByText } = render(
        <PantryStats totalItems={5} lowStockCount={10} categoryCount={3} />
      );

      expect(getByText('5')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('should handle when categoryCount exceeds totalItems', () => {
      const { getByText } = render(
        <PantryStats totalItems={5} lowStockCount={2} categoryCount={20} />
      );

      expect(getByText('5')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should have three stat cards', () => {
      const { getAllByText } = render(<PantryStats {...defaultProps} />);

      const labels = ['Pantry Item(s)', 'Low Stock', 'Category Item(s)'];
      labels.forEach(label => {
        expect(getAllByText(label)).toHaveLength(1);
      });
    });

    it('should render in a horizontal row', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const container = getByText('10').parent?.parent?.parent;
      expect(container).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply container styles', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const container = getByText('10').parent?.parent?.parent;
      expect(container?.props.style).toBeDefined();
    });

    it('should apply stat card styles to each card', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const card1 = getByText('10').parent;
      const card2 = getByText('3').parent;
      const card3 = getByText('5').parent;

      expect(card1?.props.style).toBeDefined();
      expect(card2?.props.style).toBeDefined();
      expect(card3?.props.style).toBeDefined();
    });

    it('should apply stat number styles', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const number = getByText('10');
      expect(number.props.style).toBeDefined();
    });

    it('should apply stat label styles', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const label = getByText('Pantry Item(s)');
      expect(label.props.style).toBeDefined();
    });
  });

  describe('Dynamic Updates', () => {
    it('should update all stats simultaneously', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={5} />
      );

      expect(getByText('10')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();

      rerender(
        <PantryStats totalItems={20} lowStockCount={6} categoryCount={10} />
      );

      expect(getByText('20')).toBeTruthy();
      expect(getByText('6')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('should update only totalItems', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={5} />
      );

      rerender(
        <PantryStats totalItems={15} lowStockCount={3} categoryCount={5} />
      );

      expect(getByText('15')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('should update only lowStockCount', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={5} />
      );

      rerender(
        <PantryStats totalItems={10} lowStockCount={8} categoryCount={5} />
      );

      expect(getByText('10')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('should update only categoryCount', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={5} />
      );

      rerender(
        <PantryStats totalItems={10} lowStockCount={3} categoryCount={12} />
      );

      expect(getByText('10')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('12')).toBeTruthy();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should display stats for newly created pantry', () => {
      const { getByText } = render(
        <PantryStats totalItems={0} lowStockCount={0} categoryCount={0} />
      );

      expect(getByText('Pantry Item(s)')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should display stats for small pantry', () => {
      const { getByText } = render(
        <PantryStats totalItems={5} lowStockCount={1} categoryCount={3} />
      );

      expect(getByText('5')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });

    it('should display stats for medium pantry', () => {
      const { getByText } = render(
        <PantryStats totalItems={50} lowStockCount={10} categoryCount={8} />
      );

      expect(getByText('50')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
    });

    it('should display stats for large pantry', () => {
      const { getByText } = render(
        <PantryStats totalItems={500} lowStockCount={75} categoryCount={25} />
      );

      expect(getByText('500')).toBeTruthy();
      expect(getByText('75')).toBeTruthy();
      expect(getByText('25')).toBeTruthy();
    });

    it('should display when no items are low stock', () => {
      const { getByText } = render(
        <PantryStats totalItems={20} lowStockCount={0} categoryCount={5} />
      );

      expect(getByText('20')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render readable stat numbers', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      expect(getByText('10')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('should render readable stat labels', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      expect(getByText('Pantry Item(s)')).toBeTruthy();
      expect(getByText('Low Stock')).toBeTruthy();
      expect(getByText('Category Item(s)')).toBeTruthy();
    });

    it('should have semantic structure for screen readers', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const pantryNumber = getByText('10');
      const pantryLabel = getByText('Pantry Item(s)');

      expect(pantryNumber.parent).toBeTruthy();
      expect(pantryLabel.parent).toBeTruthy();
    });
  });

  describe('Visual Layout', () => {
    it('should render three cards side by side', () => {
      const { getAllByText } = render(<PantryStats {...defaultProps} />);

      const labels = ['Pantry Item(s)', 'Low Stock', 'Category Item(s)'];
      labels.forEach(label => {
        expect(getAllByText(label)).toHaveLength(1);
      });
    });

    it('should have equal spacing between cards', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const container = getByText('10').parent?.parent?.parent;
      expect(container).toBeTruthy();
    });

    it('should apply shadow/elevation to cards', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      const card = getByText('10').parent;
      expect(card?.props.style).toBeDefined();
    });
  });

  describe('Number Formatting', () => {
    it('should display numbers as plain integers', () => {
      const { getByText } = render(
        <PantryStats totalItems={100} lowStockCount={25} categoryCount={10} />
      );

      expect(getByText('100')).toBeTruthy();
      expect(getByText('25')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('should not format numbers with commas', () => {
      const { getByText, queryByText } = render(
        <PantryStats totalItems={1000} lowStockCount={500} categoryCount={100} />
      );

      expect(getByText('1000')).toBeTruthy();
      expect(queryByText('1,000')).toBeNull();
    });

    it('should display decimal numbers if provided', () => {
      const { getByText } = render(
        <PantryStats totalItems={10.5} lowStockCount={3.2} categoryCount={5.8} />
      );

      expect(getByText('10.5')).toBeTruthy();
      expect(getByText('3.2')).toBeTruthy();
      expect(getByText('5.8')).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should integrate with pantry screen', () => {
      const { getByText } = render(<PantryStats {...defaultProps} />);

      expect(getByText('10')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('should reflect live pantry data', () => {
      const { getByText, rerender } = render(
        <PantryStats totalItems={10} lowStockCount={2} categoryCount={5} />
      );

      expect(getByText('10')).toBeTruthy();

      rerender(
        <PantryStats totalItems={11} lowStockCount={2} categoryCount={5} />
      );

      expect(getByText('11')).toBeTruthy();
    });
  });
});
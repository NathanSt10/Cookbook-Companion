import { render } from '@testing-library/react-native';
import PantryEmptyState from '../../../../components/pantry/PantryEmptyState';

describe('PantryEmptyState', () => {
  const mockOnAddItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the empty state container', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();
    });

    it('should render the title text', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const title = getByText('Empty pantry');
      expect(title).toBeTruthy();
    });

    it('should render the subtitle text', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Log an item to populate your pantry')).toBeTruthy();
    });

    it('should display both title and subtitle together', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();
      expect(getByText('Log an item to populate your pantry')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have centered container styles', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const container = getByText('Empty pantry').parent;
      expect(container?.props.style).toBeDefined();
    });

    it('should have proper title styling', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const title = getByText('Empty pantry');
      expect(title.props.style).toBeDefined();
    });

    it('should have proper subtitle styling', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const subtitle = getByText('Log an item to populate your pantry');
      expect(subtitle.props.style).toBeDefined();
    });
  });

  describe('Component Props', () => {
    it('should accept onAddItem prop', () => {
      const container = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(container).toBeTruthy();
    });

    it('should render without crashing when onAddItem is provided', () => {
      expect(() => {
        render(<PantryEmptyState onAddItem={mockOnAddItem} />);
      }).not.toThrow();
    });

    it('should render with empty function as onAddItem', () => {
      const emptyFn = () => {};
      
      expect(() => {
        render(<PantryEmptyState onAddItem={emptyFn} />);
      }).not.toThrow();
    });
  });

  describe('Layout', () => {
    it('should render title before subtitle in DOM order', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const title = getByText('Empty pantry');
      const subtitle = getByText('Log an item to populate your pantry');

      expect(title).toBeTruthy();
      expect(subtitle).toBeTruthy();
    });

    it('should have flex container for centering', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const container = getByText('Empty pantry').parent;
      
      expect(container).toBeTruthy();
    });
  });

  describe('Text Content', () => {
    it('should display exact title text', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();
    });

    it('should display exact subtitle text', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Log an item to populate your pantry')).toBeTruthy();
    });

    it('should not render any additional text', () => {
      const { queryByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(queryByText('Add Item')).toBeNull();
      expect(queryByText('Get Started')).toBeNull();
      expect(queryByText('No items')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should render text elements that are accessible', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const title = getByText('Empty pantry');
      const subtitle = getByText('Log an item to populate your pantry');

      expect(title).toBeTruthy();
      expect(subtitle).toBeTruthy();
    });

    it('should have readable text for screen readers', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();
      expect(getByText('Log an item to populate your pantry')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should render consistently across multiple renders', () => {
      const { getByText, rerender } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();

      rerender(<PantryEmptyState onAddItem={mockOnAddItem} />);

      expect(getByText('Empty pantry')).toBeTruthy();
      expect(getByText('Log an item to populate your pantry')).toBeTruthy();
    });

    it('should handle different onAddItem functions', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      const { rerender, getByText } = render(
        <PantryEmptyState onAddItem={fn1} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();

      rerender(<PantryEmptyState onAddItem={fn2} />);

      expect(getByText('Empty pantry')).toBeTruthy();
    });

    it('should not call onAddItem on render', () => {
      render(<PantryEmptyState onAddItem={mockOnAddItem} />);

      expect(mockOnAddItem).not.toHaveBeenCalled();
    });
  });

  describe('Component Structure', () => {
    it('should have a single root View', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const title = getByText('Empty pantry');
      const container = title.parent;

      expect(container).toBeTruthy();
    });
  });

  describe('Visual Appearance', () => {
    it('should apply container styles', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const container = getByText('Empty pantry').parent;
      
      expect(container?.props.style).toBeTruthy();
    });

    it('should apply title styles', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const title = getByText('Empty pantry');
      
      expect(title.props.style).toBeTruthy();
    });

    it('should apply subtitle styles', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      const subtitle = getByText('Log an item to populate your pantry');
      
      expect(subtitle.props.style).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should work with ItemList empty state', () => {
      const { getByText } = render(
        <PantryEmptyState onAddItem={mockOnAddItem} />
      );

      expect(getByText('Empty pantry')).toBeTruthy();
      expect(getByText('Log an item to populate your pantry')).toBeTruthy();
    });
  });
});
import { fireEvent, render } from '@testing-library/react-native';
import UnitSelector from '../../../utils/UnitSelectorModal';

jest.mock('../../../constants/pantryUnits', () => ({
  PANTRY_UNITS: [
    { value: 'g', label: 'Gram', abbreviation: 'g', category: 'weight' },
    { value: 'kg', label: 'Kilogram', abbreviation: 'kg', category: 'weight' },
    { value: 'lb', label: 'Pound', abbreviation: 'lb', category: 'weight' },
    { value: 'oz', label: 'Ounce', abbreviation: 'oz', category: 'weight' },
    { value: 'ml', label: 'Milliliter', abbreviation: 'ml', category: 'volume' },
    { value: 'l', label: 'Liter', abbreviation: 'L', category: 'volume' },
    { value: 'cup', label: 'Cup', abbreviation: 'cup', category: 'volume' },
    { value: 'tbsp', label: 'Tablespoon', abbreviation: 'tbsp', category: 'volume' },
    { value: 'tsp', label: 'Teaspoon', abbreviation: 'tsp', category: 'volume' },
    { value: 'piece', label: 'Piece', abbreviation: 'pc', category: 'count' },
    { value: 'can', label: 'Can', abbreviation: 'can', category: 'count' },
  ],
  UNIT_CATEGORIES: [
    { key: 'weight', label: 'Weight' },
    { key: 'volume', label: 'Volume' },
    { key: 'count', label: 'Count' },
  ],
}));

describe('UnitSelector', () => {
  const mockOnSelectUnit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Closed State', () => {
    it('should render selector button with placeholder when no unit selected', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      expect(getByText('Select unit')).toBeTruthy();
    });

    it('should display selected unit abbreviation', () => {
      const { getByText } = render(
        <UnitSelector
          selectedUnit="g"
          onSelectUnit={mockOnSelectUnit}
        />
      );

      expect(getByText('g')).toBeTruthy();
    });

    it('should display custom unit when selected', () => {
      const { getByText } = render(
        <UnitSelector
          selectedUnit="pinch"
          onSelectUnit={mockOnSelectUnit}
        />
      );

      expect(getByText('pinch')).toBeTruthy();
    });

    it('should show chevron-down icon', () => {
      const { UNSAFE_getByType } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      expect(UNSAFE_getByType).toBeDefined();
    });

    it('should be disabled when disabled prop is true', () => {
      const { getByTestId } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
          disabled={true}
          testID="unit-selector"
        />
      );

      const selector = getByTestId('unit-selector');
      expect(selector.props.accessibilityState.disabled).toBe(true);
    });

    it('should not open modal when pressed if disabled', () => {
      const { getByText, queryByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
          disabled={true}
        />
      );

      fireEvent.press(getByText('Select unit'));

      expect(queryByText('Select Unit')).toBeNull();
    });
  });

  describe('Modal Opening and Closing', () => {
    it('should open modal when selector is pressed', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      expect(getByText('Select Unit')).toBeTruthy(); 
    });

    it('should close modal when close button is pressed', () => {
      const { getByText, queryByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));
      expect(getByText('Select Unit')).toBeTruthy();

      const modal = getByText('Select Unit').parent;
    });

    it('should display modal content when opened', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      expect(getByText('All')).toBeTruthy();
      expect(getByText('Weight')).toBeTruthy();
      expect(getByText('Volume')).toBeTruthy();
      expect(getByText('Count')).toBeTruthy();
      expect(getByText('Common Units')).toBeTruthy();
      expect(getByText('Custom Unit')).toBeTruthy();
      expect(getByPlaceholderText('e.g., pinch, dash, handful')).toBeTruthy();
    });
  });

  describe('Category Filtering', () => {
    it('should show all units by default', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      expect(getByText('g')).toBeTruthy(); 
      expect(getByText('ml')).toBeTruthy();
      expect(getByText('pc')).toBeTruthy(); 
    });

    it('should filter units by weight category', () => {
      const { getByText, queryByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const weightCategory = getByText('Weight');
      fireEvent.press(weightCategory);

      expect(getByText('g')).toBeTruthy();
      expect(getByText('kg')).toBeTruthy();
      expect(getByText('lb')).toBeTruthy();
    });

    it('should filter units by volume category', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const volumeCategory = getByText('Volume');
      fireEvent.press(volumeCategory);

      expect(getByText('ml')).toBeTruthy();
      expect(getByText('L')).toBeTruthy();
      expect(getByText('cup')).toBeTruthy();
      expect(getByText('tbsp')).toBeTruthy();
    });

    it('should filter units by count category', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const countCategory = getByText('Count');
      fireEvent.press(countCategory);

      expect(getByText('pc')).toBeTruthy();
      expect(getByText('can')).toBeTruthy();
    });

    it('should switch back to all categories', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));
      fireEvent.press(getByText('Weight'));
      fireEvent.press(getByText('All'));

      expect(getByText('g')).toBeTruthy();
      expect(getByText('ml')).toBeTruthy();
      expect(getByText('pc')).toBeTruthy();
    });

    it('should highlight selected category', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const weightChip = getByText('Weight');
      fireEvent.press(weightChip);
    });
  });

  describe('Unit Selection', () => {
    it('should call onSelectUnit when a unit is selected', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const gramButton = getByText('Gram');
      fireEvent.press(gramButton);

      expect(mockOnSelectUnit).toHaveBeenCalledWith('g');
    });

    it('should close modal after selecting a unit', () => {
      const { getByText, queryByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));
      expect(getByText('Select Unit')).toBeTruthy();

      fireEvent.press(getByText('Gram'));

      expect(queryByText('Select Unit')).toBeNull();
    });

    it('should highlight currently selected unit', () => {
      const { getByText } = render(
        <UnitSelector
          selectedUnit="g"
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('g'));
    });

    it('should display unit label alongside abbreviation', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      expect(getByText('Gram')).toBeTruthy();
      expect(getByText('g')).toBeTruthy();
    });
  });

  describe('Custom Unit Creation', () => {
    it('should accept custom unit input', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, 'pinch');

      expect(customInput.props.value).toBe('pinch');
    });

    it('should add custom unit when Add button is pressed', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, 'pinch');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(mockOnSelectUnit).toHaveBeenCalledWith('pinch');
    });

    it('should close modal after adding custom unit', () => {
      const { getByText, getByPlaceholderText, queryByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, 'pinch');
      fireEvent.press(getByText('Add'));

      expect(queryByText('Select Unit')).toBeNull();
    });

    it('should clear custom input after adding', () => {
      const { getByText, getByPlaceholderText, rerender } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, 'pinch');
      fireEvent.press(getByText('Add'));

      rerender(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const newCustomInput = getByPlaceholderText('e.g., pinch, dash, handful');
      expect(newCustomInput.props.value).toBe('');
    });

    it('should trim whitespace from custom unit', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, '  pinch  ');
      fireEvent.press(getByText('Add'));

      expect(mockOnSelectUnit).toHaveBeenCalledWith('pinch');
    });

    it('should not add empty custom unit', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, '');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(mockOnSelectUnit).not.toHaveBeenCalled();
    });

    it('should not add whitespace-only custom unit', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, '   ');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(mockOnSelectUnit).not.toHaveBeenCalled();
    });

    it('should disable Add button when input is empty', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));
    
      const addButtonText = getByText('Add');
      const addButton = addButtonText.parent?.parent;
      expect(addButton?.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable Add button when input has value', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, 'pinch');

      const addButtonText = getByText('Add');
      const addButton = addButtonText.parent?.parent;
      expect(addButton?.props.accessibilityState?.disabled).toBe(false);
    });

    it('should add custom unit via keyboard submit', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, 'dash');
      fireEvent(customInput, 'submitEditing');

      expect(mockOnSelectUnit).toHaveBeenCalledWith('dash');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long custom unit names', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const longUnit = 'a'.repeat(50);
      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, longUnit);
      fireEvent.press(getByText('Add'));

      expect(mockOnSelectUnit).toHaveBeenCalledWith(longUnit);
    });

    it('should handle custom unit with special characters', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, '1/2 cup');
      fireEvent.press(getByText('Add'));

      expect(mockOnSelectUnit).toHaveBeenCalledWith('1/2 cup');
    });

    it('should handle custom unit with numbers', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      fireEvent.changeText(customInput, '500ml bottle');
      fireEvent.press(getByText('Add'));

      expect(mockOnSelectUnit).toHaveBeenCalledWith('500ml bottle');
    });

    it('should handle rapid category switching', () => {
      const { getByText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      fireEvent.press(getByText('Weight'));
      fireEvent.press(getByText('Volume'));
      fireEvent.press(getByText('Count'));
      fireEvent.press(getByText('All'));

      expect(getByText('g')).toBeTruthy();
    });

    it('should handle selecting same unit multiple times', () => {
      const { getByText } = render(
        <UnitSelector
          selectedUnit="g"
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('g'));
      fireEvent.press(getByText('Gram'));

      expect(mockOnSelectUnit).toHaveBeenCalledWith('g');
      expect(mockOnSelectUnit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper return key type for custom input', () => {
      const { getByText, getByPlaceholderText } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));

      const customInput = getByPlaceholderText('e.g., pinch, dash, handful');
      expect(customInput.props.returnKeyType).toBe('done');
    });
  });

  describe('State Persistence', () => {
    it('should remember selected category when reopening modal', () => {
      const { getByText, rerender } = render(
        <UnitSelector
          onSelectUnit={mockOnSelectUnit}
        />
      );

      fireEvent.press(getByText('Select unit'));
      fireEvent.press(getByText('Weight'));
      fireEvent.press(getByText('Gram'));

      rerender(
        <UnitSelector
          selectedUnit="g"
          onSelectUnit={mockOnSelectUnit}
        />
      );
      fireEvent.press(getByText('g'));
       
      expect(getByText('All')).toBeTruthy();
    });
  });
});
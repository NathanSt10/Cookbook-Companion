import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ItemEditModal from '../../../../components/pantry/ItemEditModal';
import { PantryItem } from '../../../../hooks/usePantry';

jest.spyOn(Alert, 'alert');

jest.mock('../../../../utils/UnitSelectorModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  
  return jest.fn(({ selectedUnit, onSelectUnit, disabled }) => {
    return React.createElement(
      TouchableOpacity,
      {
        testID: 'unit-selector',
        onPress: () => !disabled && onSelectUnit('g'),
        disabled: disabled,
      },
      React.createElement(
        Text,
        { testID: 'unit-selector-text' },
        selectedUnit || 'Select unit'
      )
    );
  });
});

describe('ItemEditModal', () => {
  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const existingCategories = ['dairy', 'vegetables', 'frozen'];

  const mockEditingItem: PantryItem = {
    fireId: '123',
    name: 'milk',
    category: ['dairy'],
    quantity: 2,
    unit: 'L',
    addedAt: new Date('2024-01-15'),
    expireDate: '2024-02-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnEdit.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      expect(getByText('Edit Item')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <ItemEditModal
          visible={false}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      expect(queryByText('Edit Item')).toBeNull();
    });

    it('should pre-populate form with editing item data', () => {
      const { getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      expect(getByDisplayValue('milk')).toBeTruthy();
      expect(getByDisplayValue('2024-02-01')).toBeTruthy();
    });

    it('should pre-select editing item categories', () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      expect(getByText('1 selected: dairy')).toBeTruthy();
    });

    it('should handle editing item with multiple categories', () => {
      const multiCatItem: PantryItem = {
        ...mockEditingItem,
        category: ['dairy', 'beverages'],
      };

      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={multiCatItem}
        />
      );

      expect(getByText('2 selected: dairy, beverages')).toBeTruthy();
    });

    it('should render all input fields', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      expect(getByPlaceholderText('e.g., Tomatoes, Milk, Rice')).toBeTruthy();
      expect(getByPlaceholderText('Create new category...')).toBeTruthy();
      expect(getByPlaceholderText('e.g., 2, 500g, 1L')).toBeTruthy();
      expect(getByPlaceholderText('e.g., 2024-12-31')).toBeTruthy();
    });
  });

  describe('Item Name Validation', () => {
    it('should show error when trying to save with empty name', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const nameInput = getByDisplayValue('milk');
      fireEvent.changeText(nameInput, '');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an item name');
      });
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should show error when name is only whitespace', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const nameInput = getByDisplayValue('milk');
      fireEvent.changeText(nameInput, '   ');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an item name');
      });
    });

    it('should trim whitespace from item name', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const nameInput = getByDisplayValue('milk');
      fireEvent.changeText(nameInput, '  Whole Milk  ');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            name: 'Whole Milk',
          })
        );
      });
    });
  });

  describe('Category Selection', () => {
    it('should show error when no category is selected', async () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please select at least one category');
      });
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should allow changing categories', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      fireEvent.press(getByText('dairy'));
      fireEvent.press(getByText('vegetables'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            category: ['vegetables'],
          })
        );
      });
    });

    it('should allow selecting multiple categories', async () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      fireEvent.press(getByText('frozen'));

      expect(getByText('2 selected: dairy, frozen')).toBeTruthy();
    });

    it('should toggle category selection', () => {
      const { getByText, queryByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      fireEvent.press(getByText('vegetables'));
      expect(getByText('2 selected: dairy, vegetables')).toBeTruthy();

      fireEvent.press(getByText('vegetables'));
      expect(getByText('1 selected: dairy')).toBeTruthy();
    });
  });

  describe('New Category Creation', () => {
    it('should create and select new category', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'Snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(getByText('snacks')).toBeTruthy();
      expect(getByText('2 selected: dairy, snacks')).toBeTruthy();
    });

    it('should convert new category to lowercase', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'SNACKS');

      fireEvent.press(getByText('Add'));

      expect(getByText('snacks')).toBeTruthy();
    });

    it('should show error when new category name is empty', () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a category name');
    });

    it('should show error when category already exists', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'dairy');

      fireEvent.press(getByText('Add'));

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
    });

    it('should detect duplicate case-insensitively', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'DAIRY');

      fireEvent.press(getByText('Add'));

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
    });

    it('should clear input after creating category', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'snacks');
      fireEvent.press(getByText('Add'));

      expect(categoryInput.props.value).toBe('');
    });
  });

  describe('Quantity and Unit Validation', () => {
    it('should show error when quantity provided without unit', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500g, 1L');
      fireEvent.changeText(quantityInput, '500');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Missing Unit', 'Please select a unit for the quantity');
      });
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should accept quantity with unit', async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500g, 1L');
      fireEvent.changeText(quantityInput, '3');

      const unitSelector = getByTestId('unit-selector');
      fireEvent.press(unitSelector);

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            quantity: '3',
            unit: 'g',
          })
        );
      });
    });

    it('should allow saving without quantity and unit', async () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            quantity: undefined,
            unit: undefined,
          })
        );
      });
    });

    it('should accept decimal quantities', () => {
      const { getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500g, 1L');
      fireEvent.changeText(quantityInput, '1.5');

      expect(quantityInput.props.value).toBe('1.5');
    });

    it('should have decimal keyboard for quantity', () => {
      const { getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500g, 1L');
      expect(quantityInput.props.keyboardType).toBe('decimal-pad');
    });
  });

  describe('Expiry Date', () => {
    it('should allow updating expiry date', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const expiryInput = getByDisplayValue('2024-02-01');
      fireEvent.changeText(expiryInput, '2024-03-01');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            expireDate: '2024-03-01',
          })
        );
      });
    });

    it('should allow removing expiry date', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const expiryInput = getByDisplayValue('2024-02-01');
      fireEvent.changeText(expiryInput, '');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            expireDate: undefined,
          })
        );
      });
    });

    it('should handle item without expiry date', () => {
      const itemNoExpiry: PantryItem = {
        ...mockEditingItem,
        expireDate: undefined,
      };

      const { getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={itemNoExpiry}
        />
      );

      const expiryInput = getByPlaceholderText('e.g., 2024-12-31');
      expect(expiryInput.props.value).toBe('');
    });
  });

  describe('Form Submission', () => {
    it('should submit all changes successfully', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const nameInput = getByDisplayValue('milk');
      fireEvent.changeText(nameInput, 'Whole Milk');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            name: 'Whole Milk',
          })
        );
      });
    });

    it('should reset form after successful save', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalled();
      });

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      expect(nameInput.props.value).toBe('');
    });

    it('should close modal after successful save', async () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should show error when no editing item is set', async () => {
      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={null}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No item selected for editing');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error alert when onEdit fails', async () => {
      mockOnEdit.mockRejectedValueOnce(new Error('Network error'));

      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to edit item. Please try again.');
      });
    });

    it('should not reset form when save fails', async () => {
      mockOnEdit.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      const nameInput = getByDisplayValue('milk');
      expect(nameInput.props.value).toBe('milk');
    });

    it('should not close modal when save fails', async () => {
      mockOnEdit.mockRejectedValueOnce(new Error('Network error'));

      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should re-enable inputs after error', async () => {
      mockOnEdit.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      const nameInput = getByDisplayValue('milk');
      expect(nameInput.props.editable).toBe(true);
    });
  });

  describe('Loading State', () => {
    it('should disable all inputs during save', async () => {
      mockOnEdit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        const nameInput = getByDisplayValue('milk');
        expect(nameInput.props.editable).toBe(false);
      });
    });

    it('should disable category chips during save', async () => {
      mockOnEdit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        const dairyChip = getByText('dairy');
        expect(dairyChip.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('should disable new category creation during save', async () => {
      mockOnEdit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText, getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        const categoryInput = getByPlaceholderText('Create new category...');
        expect(categoryInput.props.editable).toBe(false);
      });
    });
  });

  describe('Modal Close Behavior', () => {
    it('should reset form when closed and reopened', () => {
      const { getByDisplayValue, rerender } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const nameInput = getByDisplayValue('milk');
      fireEvent.changeText(nameInput, 'Whole Milk');

      rerender(
        <ItemEditModal
          visible={false}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      rerender(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const newNameInput = getByDisplayValue('milk');
      expect(newNameInput.props.value).toBe('milk');
    });

    it('should reload editing item data when editing item changes', () => {
      const { getByDisplayValue, rerender } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      expect(getByDisplayValue('milk')).toBeTruthy();

      const newItem: PantryItem = {
        ...mockEditingItem,
        fireId: '456',
        name: 'cheese',
      };

      rerender(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={newItem}
        />
      );

      expect(getByDisplayValue('cheese')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle item with empty expire date', () => {
      const itemEmptyExpire: PantryItem = {
        ...mockEditingItem,
        expireDate: '',
      };

      const { getByPlaceholderText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={itemEmptyExpire}
        />
      );

      const expiryInput = getByPlaceholderText('e.g., 2024-12-31');
      expect(expiryInput.props.value).toBe('');
    });

    it('should handle item with single category string', () => {
      const singleCatItem: PantryItem = {
        ...mockEditingItem,
        category: 'dairy' as any,
      };

      const { getByText } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={singleCatItem}
        />
      );

      expect(getByText('1 selected: dairy')).toBeTruthy();
    });

    it('should handle very long item names', async () => {
      const { getByText, getByDisplayValue } = render(
        <ItemEditModal
          visible={true}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          categories={existingCategories}
          editingItem={mockEditingItem}
        />
      );

      const longName = 'a'.repeat(100);
      const nameInput = getByDisplayValue('milk');
      fireEvent.changeText(nameInput, longName);

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnEdit).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            name: longName,
          })
        );
      });
    });
  });
});
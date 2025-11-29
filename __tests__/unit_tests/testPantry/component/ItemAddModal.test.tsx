import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ItemAddModal from '../../../../components/pantry/ItemAddModal';

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

describe('ItemAddModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();
  const existingCategories = ['dairy', 'vegetables', 'frozen'];

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAdd.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(getByText('Add Item')).toBeTruthy();
      expect(getByPlaceholderText('e.g., Tomatoes, Milk, Rice')).toBeTruthy();
      expect(getByText('Item Name *')).toBeTruthy();
      expect(getByText('Category *')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <ItemAddModal
          visible={false}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(queryByText('Add Item')).toBeNull();
    });

    it('should display existing categories as chips', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(getByText('dairy')).toBeTruthy();
      expect(getByText('vegetables')).toBeTruthy();
      expect(getByText('frozen')).toBeTruthy();
    });

    it('should render all input fields', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(getByPlaceholderText('e.g., Tomatoes, Milk, Rice')).toBeTruthy();
      expect(getByPlaceholderText('Create new category...')).toBeTruthy();
      expect(getByPlaceholderText('e.g., 2, 500, 1.5')).toBeTruthy();
      expect(getByPlaceholderText('e.g., 2024-12-31')).toBeTruthy();
      expect(getByText('Quantity (Optional)')).toBeTruthy();
      expect(getByText('Expire Date (Optional)')).toBeTruthy();
    });

    it('should show hint text for quantity', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(getByText('Enter amount and select a unit (e.g., "500" + "g" for 500 grams)')).toBeTruthy();
    });

    it('should show hint text for categories', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(getByText('Tap categories to select multiple, or create a new one above')).toBeTruthy();
    });
  });

  describe('Item Name Input Validation', () => {
    it('should show error when trying to add item without name', async () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an item name');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should show error when item name is only whitespace', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, '   ');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an item name');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should trim whitespace from item name', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, '  Milk  ');

      const dairyChip = getByText('dairy');
      fireEvent.press(dairyChip);

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Milk',
          })
        );
      });
    });

    it('should accept item names with special characters', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Mom\'s Apple Pie');

      const dairyChip = getByText('dairy');
      fireEvent.press(dairyChip);

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Mom\'s Apple Pie',
          })
        );
      });
    });
  });

  describe('Category Selection', () => {
    it('should show warning when no category is selected', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Warning', 'No category selected, defaulting to Other');
      });

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            category: ['other'],
          })
        );
      });
    });

    it('should toggle category selection when chip is pressed', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const dairyChip = getByText('dairy');
      fireEvent.press(dairyChip);

      expect(getByText('1 selected: dairy')).toBeTruthy();
    });

    it('should allow selecting multiple categories', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      fireEvent.press(getByText('dairy'));
      fireEvent.press(getByText('vegetables'));

      expect(getByText('2 selected: dairy, vegetables')).toBeTruthy();
    });

    it('should deselect category when pressed again', () => {
      const { getByText, queryByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const dairyChip = getByText('dairy');
      fireEvent.press(dairyChip);
      expect(getByText('1 selected: dairy')).toBeTruthy();

      fireEvent.press(dairyChip);
      expect(queryByText('1 selected: dairy')).toBeNull();
    });

    it('should submit with selected categories', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));
      fireEvent.press(getByText('frozen'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Milk',
            category: expect.arrayContaining(['dairy', 'frozen']),
          })
        );
      });
    });

    it('should not show selected count when no categories selected', () => {
      const { queryByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      expect(queryByText(/selected:/)).toBeNull();
    });
  });

  describe('New Category Creation', () => {
    it('should create and select new category when Add is pressed', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'Snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(getByText('snacks')).toBeTruthy();
      expect(getByText('1 selected: snacks')).toBeTruthy();
    });

    it('should convert new category to lowercase', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'SNACKS');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(getByText('snacks')).toBeTruthy();
    });

    it('should trim whitespace from new category', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, '  snacks  ');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(getByText('snacks')).toBeTruthy();
    });

    it('should show error when new category name is empty', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a category name');
    });

    it('should show error when new category name is only whitespace', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, '   ');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a category name');
    });

    it('should show error when category already exists', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'dairy');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
    });

    it('should detect duplicate category case-insensitively', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'DAIRY');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
    });

    it('should clear input after creating category', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      expect(categoryInput.props.value).toBe('');
    });

    it('should allow creating category via keyboard submit', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'snacks');
      fireEvent(categoryInput, 'submitEditing');

      expect(getByText('snacks')).toBeTruthy();
    });

    it('should disable Add button when input is empty', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const addButton = getByText('Add');
      expect(addButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should merge new categories with existing categories', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'snacks');
      fireEvent.press(getByText('Add'));

      expect(getByText('dairy')).toBeTruthy();
      expect(getByText('vegetables')).toBeTruthy();
      expect(getByText('frozen')).toBeTruthy();
      expect(getByText('snacks')).toBeTruthy();
    });
  });

  describe('Quantity and Unit Input', () => {
    it('should accept valid quantity with unit', async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      fireEvent.changeText(quantityInput, '2');

      const unitSelector = getByTestId('unit-selector');
      fireEvent.press(unitSelector);

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Milk',
            quantity: '2',
            unit: 'g',
          })
        );
      });
    });

    it('should show error when quantity is provided without unit', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      fireEvent.changeText(quantityInput, '500');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Missing Unit', 'Please select a unit for the quantity');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should allow saving without quantity and unit', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Milk',
            quantity: undefined,
            unit: undefined,
          })
        );
      });
    });

    it('should allow unit without quantity', async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const unitSelector = getByTestId('unit-selector');
      fireEvent.press(unitSelector);

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Milk',
            quantity: undefined,
            unit: 'g',
          })
        );
      });
    });

    it('should have decimal keyboard for quantity input', () => {
      const { getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      expect(quantityInput.props.keyboardType).toBe('decimal-pad');
    });

    it('should accept decimal quantities', async () => {
      const { getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      fireEvent.changeText(quantityInput, '1.5');

      expect(quantityInput.props.value).toBe('1.5');
    });

    it('should render UnitSelector component', () => {
      const { getByTestId } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const unitSelector = getByTestId('unit-selector');
      expect(unitSelector).toBeTruthy();
    });

    it('should show "Select unit" placeholder when no unit selected', () => {
      const { getByTestId } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const unitSelectorText = getByTestId('unit-selector-text');
      expect(unitSelectorText.props.children).toBe('Select unit');
    });

    it('should trim whitespace from quantity', async () => {
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      fireEvent.changeText(quantityInput, '  500  ');

      const unitSelector = getByTestId('unit-selector');
      fireEvent.press(unitSelector);

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: '500',
          })
        );
      });
    });
  });

  describe('Expiry Date Input', () => {
    it('should accept expiry date', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const expiryInput = getByPlaceholderText('e.g., 2024-12-31');
      fireEvent.changeText(expiryInput, '2024-12-31');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            expireDate: '2024-12-31',
          })
        );
      });
    });

    it('should allow saving without expiry date', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            expireDate: undefined,
          })
        );
      });
    });

    it('should trim whitespace from expiry date', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      const expiryInput = getByPlaceholderText('e.g., 2024-12-31');
      fireEvent.changeText(expiryInput, '  2024-12-31  ');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            expireDate: '2024-12-31',
          })
        );
      });
    });
  });

  describe('Complete Item Submission', () => {
    it('should submit item with all fields filled', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Whole Milk');

      fireEvent.press(getByText('dairy'));

      const expiryInput = getByPlaceholderText('e.g., 2024-12-31');
      fireEvent.changeText(expiryInput, '2024-12-31');

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith({
          name: 'Whole Milk',
          category: ['dairy'],
          quantity: undefined,
          unit: undefined,
          expireDate: '2024-12-31',
        });
      });
    });

    it('should reset form after successful submission', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalled();
      });

      expect(nameInput.props.value).toBe('');
    });

    it('should close modal after successful submission', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should submit with newly created category', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Chips');

      const categoryInput = getByPlaceholderText('Create new category...');
      fireEvent.changeText(categoryInput, 'snacks');
      fireEvent.press(getByText('Add'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Chips',
            category: ['snacks'],
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error alert when onAdd fails', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to add item. Please try again.');
      });
    });

    it('should not reset form when onAdd fails', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      expect(nameInput.props.value).toBe('Milk');
    });

    it('should not close modal when onAdd fails', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should re-enable inputs after error', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      expect(nameInput.props.editable).toBe(true);
    });
  });

  describe('Loading State', () => {
    it('should disable all inputs during submission', async () => {
      mockOnAdd.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(nameInput.props.editable).toBe(false);
      });
    });

    it('should disable category chips during submission', async () => {
      mockOnAdd.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        const dairyChip = getByText('dairy');
        expect(dairyChip.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it('should disable new category creation during submission', async () => {
      mockOnAdd.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        const categoryInput = getByPlaceholderText('Create new category...');
        expect(categoryInput.props.editable).toBe(false);
      });
    });
  });

  describe('Modal Close Behavior', () => {
    it('should reset form when modal is closed and reopened', () => {
      const { getByPlaceholderText, rerender } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, 'Milk');

      rerender(
        <ItemAddModal
          visible={false}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      rerender(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const newNameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      expect(newNameInput.props.value).toBe('');
    });

    it('should call onClose when back button is pressed', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      // This would need testID in ModalHeaderFor component
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty categories array', () => {
      const { queryByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={[]}
        />
      );

      expect(queryByText('dairy')).toBeNull();
    });

    it('should handle very long item names', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const longName = 'A'.repeat(100);
      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, longName);

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: longName,
          })
        );
      });
    });

    it('should handle item names with emoji', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const nameInput = getByPlaceholderText('e.g., Tomatoes, Milk, Rice');
      fireEvent.changeText(nameInput, '🍕 Pizza');

      fireEvent.press(getByText('dairy'));

      const saveButton = getByText('Save');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '🍕 Pizza',
          })
        );
      });
    });

    it('should handle rapid category toggling', () => {
      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const dairyChip = getByText('dairy');

      fireEvent.press(dairyChip);
      fireEvent.press(dairyChip);
      fireEvent.press(dairyChip);
      fireEvent.press(dairyChip);

      expect(getByText('dairy')).toBeTruthy();
    });

    it('should handle many categories', () => {
      const manyCategories = Array.from({ length: 50 }, (_, i) => `category${i}`);

      const { getByText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={manyCategories}
        />
      );

      expect(getByText('category0')).toBeTruthy();
      expect(getByText('category49')).toBeTruthy();
    });

    it('should handle creating multiple new categories', () => {
      const { getByText, getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const categoryInput = getByPlaceholderText('Create new category...');

      fireEvent.changeText(categoryInput, 'snacks');
      fireEvent.press(getByText('Add'));

      fireEvent.changeText(categoryInput, 'beverages');
      fireEvent.press(getByText('Add'));

      expect(getByText('snacks')).toBeTruthy();
      expect(getByText('beverages')).toBeTruthy();
    });

    it('should handle negative quantities', async () => {
      const { getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      fireEvent.changeText(quantityInput, '-5');

      expect(quantityInput.props.value).toBe('-5');
    });

    it('should handle zero quantity', async () => {
      const { getByPlaceholderText } = render(
        <ItemAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          categories={existingCategories}
        />
      );

      const quantityInput = getByPlaceholderText('e.g., 2, 500, 1.5');
      fireEvent.changeText(quantityInput, '0');

      expect(quantityInput.props.value).toBe('0');
    });
  });
});
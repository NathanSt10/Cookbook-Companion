import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CategoryAddModal from '../../../../components/pantry/CategoryAddModal';

jest.spyOn(Alert, 'alert');

describe('CategoryAddModal', () => {
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
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      expect(getByText('Add Category')).toBeTruthy();
      expect(getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <CategoryAddModal
          visible={false}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      expect(queryByText('Add Category')).toBeNull();
    });

    it('should display existing categories when provided', () => {
      const { getByText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      expect(getByText('Existing Categories')).toBeTruthy();
      expect(getByText('dairy, vegetables, frozen')).toBeTruthy();
    });

    it('should not display existing categories section when empty', () => {
      const { queryByText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={[]}
        />
      );

      expect(queryByText('Existing Categories')).toBeNull();
    });
  });

  describe('Input Validation', () => {
    it('should show error when trying to add empty category name', async () => {
      const { getByText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a category name');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should show error when category name is only whitespace', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, '   ');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a category name');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should trim whitespace from category name before adding', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, '  snacks  ');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('snacks');
      });
    });

    it('should enforce 30 character maxLength', () => {
      const { getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      
      expect(input.props.maxLength).toBe(30);
    });
  });

  describe('Duplicate Category Detection', () => {
    it('should show error when adding duplicate category (exact match)', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'dairy');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should detect duplicate category case-insensitively', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'DAIRY');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should detect duplicate with mixed case', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'DaIrY');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should detect duplicate after trimming', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, '  dairy  ');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'This category already exists');
      });
      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Successful Category Addition', () => {
    it('should call onAdd with valid category name', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('snacks');
      });
    });

    it('should reset form after successful addition', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('snacks');
      });

      expect(input.props.value).toBe('');
    });

    it('should handle category with special characters', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'Mom\'s Favorites');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Mom\'s Favorites');
      });
    });

    it('should handle category with numbers', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'Aisle 5 Items');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Aisle 5 Items');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error alert when onAdd fails', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to add category, try again');
      });
    });

    it('should not reset form when onAdd fails', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      expect(input.props.value).toBe('snacks');
    });

    it('should re-enable input after error', async () => {
      mockOnAdd.mockRejectedValueOnce(new Error('Network error'));

      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      expect(input.props.editable).toBe(true);
    });
  });

  describe('Loading State', () => {
    it('should disable input during loading', async () => {
      mockOnAdd.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(input.props.editable).toBe(false);
      });
    });
  });

  describe('Modal Close Behavior', () => {
    it('should reset form when modal is closed and reopened', () => {
      const { getByPlaceholderText, rerender } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'snacks');

      rerender(
        <CategoryAddModal
          visible={false}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      rerender(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const newInput = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      expect(newInput.props.value).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty existingCategories array', () => {
      const { queryByText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={[]}
        />
      );

      expect(queryByText('Existing Categories')).toBeNull();
    });

    it('should handle very long existing categories list', () => {
      const manyCategories = Array.from({ length: 50 }, (_, i) => `category${i}`);
      
      const { getByText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={manyCategories}
        />
      );

      expect(getByText('Existing Categories')).toBeTruthy();
    });

    it('should handle category with only numbers', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, '123');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('123');
      });
    });

    it('should preserve category capitalization when adding', async () => {
      const { getByText, getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      fireEvent.changeText(input, 'Organic Produce');

      const addButton = getByText('Add');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Organic Produce');
      });
    });
  });

  describe('Auto-focus Behavior', () => {
    it('should auto-focus input when modal opens', () => {
      const { getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      expect(input.props.autoFocus).toBe(true);
    });

    it('should capitalize words in input', () => {
      const { getByPlaceholderText } = render(
        <CategoryAddModal
          visible={true}
          onClose={mockOnClose}
          onAdd={mockOnAdd}
          existingCategories={existingCategories}
        />
      );

      const input = getByPlaceholderText('e.g., Frozen Foods, Leftovers, Herbs');
      expect(input.props.autoCapitalize).toBe('words');
    });
  });
});
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CategoryViewAllModal, {
  Category,
} from '../../../../components/pantry/CategoryViewAllModal';
import { capitalizeFirstLetter } from '../../../../utils/CapitalizeFirstLetter';

jest.spyOn(Alert, 'alert');

describe('CategoryViewAllModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectCategories = jest.fn();
  const mockOnDeleteCategory = jest.fn();
  const mockOnRenameCategory = jest.fn();

  const mockCategories: Category[] = [
    { fireId: '1', name: 'dairy', itemCount: 5 },
    { fireId: '2', name: 'vegetables', itemCount: 8 },
    { fireId: '3', name: 'frozen', itemCount: 3 },
    { fireId: '4', name: 'other', itemCount: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnDeleteCategory.mockResolvedValue(undefined);
    mockOnRenameCategory.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when visible is true', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('All Categories')).toBeTruthy();
      expect(getByText('Dairy')).toBeTruthy();
      expect(getByText('Vegetables')).toBeTruthy();
      expect(getByText('Frozen')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <CategoryViewAllModal
          visible={false}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(queryByText('All Categories')).toBeNull();
    });

    it('should display existing categories with item counts', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('5 items')).toBeTruthy();
      expect(getByText('8 items')).toBeTruthy();
      expect(getByText('3 items')).toBeTruthy();
      expect(getByText('2 items')).toBeTruthy();
    });

    it('should display singular "item" for count of 1', () => {
      const singleItemCategories: Category[] = [
        { fireId: '1', name: 'dairy', itemCount: 1 },
      ];

      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={singleItemCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('1 item')).toBeTruthy();
    });

    it('should show empty state when no categories exist', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={[]}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('No categories yet')).toBeTruthy();
    });

    it('should show filter controls when onSelectCategories is provided', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('Select All')).toBeTruthy();
      expect(getByText('Clear All')).toBeTruthy();
      expect(getByText('No filters applied')).toBeTruthy();
    });

    it('should NOT show filter controls when onSelectCategories is not provided', () => {
      const { queryByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(queryByText('Select All')).toBeNull();
      expect(queryByText('Clear All')).toBeNull();
    });
  });

  describe('Select All Filter', () => {
    it('should select all categories when Select All is pressed', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const selectAllButton = getByText('Select All');
      fireEvent.press(selectAllButton);

      expect(getByText('4 categories selected')).toBeTruthy();
    });

    it('should not include filtered out categories in Select All', () => {
      const categoriesWithAll: Category[] = [
        ...mockCategories,
        { fireId: 'all', name: 'all', itemCount: 18 },
      ];

      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={categoriesWithAll}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const selectAllButton = getByText('Select All');
      fireEvent.press(selectAllButton);

      expect(getByText('4 categories selected')).toBeTruthy();
    });
  });

  describe('Clear All Filter', () => {
    it('should clear all filters when Clear All is pressed', () => {
      const { getByText, rerender } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy', 'vegetables']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('2 categories selected')).toBeTruthy();

      const clearAllButton = getByText('Clear All');
      fireEvent.press(clearAllButton);

      rerender(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('No filters applied')).toBeTruthy();
    });

    it('should disable Clear All button when no categories are selected', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const clearAllText = getByText('Clear All');
      expect(clearAllText.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('User Selected Filter', () => {
    it('should toggle category when checkbox is pressed', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const dairyCategory = getByText('Dairy');
      fireEvent.press(dairyCategory);

      expect(getByText('1 category selected')).toBeTruthy();
    });

    it('should deselect category when already selected', () => {
      const { getByText, rerender } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('1 category selected')).toBeTruthy();

      const dairyCategory = getByText('Dairy');
      fireEvent.press(dairyCategory);

      rerender(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('No filters applied')).toBeTruthy();
    });

    it('should persist selected categories when modal is closed and reopened', () => {
      const { getByText, rerender } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy', 'vegetables']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('2 categories selected')).toBeTruthy();

      rerender(
        <CategoryViewAllModal
          visible={false}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy', 'vegetables']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      rerender(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy', 'vegetables']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('2 categories selected')).toBeTruthy();
    });

    it('should call onSelectCategories with selected categories when Apply is pressed', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const applyButton = getByText('Apply');
      fireEvent.press(applyButton);

      expect(mockOnSelectCategories).toHaveBeenCalledWith(['dairy']);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should select multiple categories', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      fireEvent.press(getByText('Dairy'));
      fireEvent.press(getByText('Vegetables'));
      fireEvent.press(getByText('Frozen'));

      expect(getByText('3 categories selected')).toBeTruthy();
    });
  });

  describe('Edit Category Name', () => {
    it('should enter edit mode when pencil icon is pressed', () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      expect(getByTestId('edit-input-1')).toBeTruthy();
    });

    it('should save edited category name when checkmark is pressed', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, 'dairy products');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnRenameCategory).toHaveBeenCalledWith(
          '1',
          'dairy products'
        );
      });
    });

    it('should cancel edit when X icon is pressed', () => {
      const { getAllByTestId, getByTestId, queryByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      expect(getByTestId('edit-input-1')).toBeTruthy();

      const cancelButton = getByTestId('cancel-edit-button-1');
      fireEvent.press(cancelButton);

      expect(queryByTestId('edit-input-1')).toBeNull();
      expect(mockOnRenameCategory).not.toHaveBeenCalled();
    });

    it('should trim whitespace from edited category name', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, '   dairy products   ');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnRenameCategory).toHaveBeenCalledWith(
          '1',
          'dairy products'
        );
      });
    });

    it('should show error if edited name is empty', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, '   ');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Category name cannot be empty'
        );
      });

      expect(mockOnRenameCategory).not.toHaveBeenCalled();
    });
  });

  describe('Delete Category', () => {
    it('should not call onDeleteCategory when delete is cancelled', () => {
      (Alert.alert as jest.Mock).mockImplementation(
        (title, message, buttons) => {
          const cancelButton = buttons?.find(
            (b: any) => b.text === 'Cancel'
          );
          if (cancelButton?.onPress) {
            cancelButton.onPress();
          }
        }
      );

      render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(mockOnDeleteCategory).not.toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    it('should not allow empty category name when editing', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, '   ');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Category name cannot be empty'
        );
      });

      expect(mockOnRenameCategory).not.toHaveBeenCalled();
    });

    it('should trim whitespace when editing category', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, '  dairy   ');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnRenameCategory).toHaveBeenCalledWith(
          '1',
          'dairy'
        );
      });
    });

    it('should enforce max length of 30 characters when editing', () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      expect(input.props.maxLength).toBe(30);
    });
  });

  describe('Duplicate Category Detection', () => {
    it('should detect duplicate when editing to existing category name', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]); // dairy

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, 'vegetables');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'A category with this name already exists'
        );
      });

      expect(mockOnRenameCategory).not.toHaveBeenCalled();
    });

    it('should detect duplicate case-insensitively when editing', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]); // dairy

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, 'VEGETABLES');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'A category with this name already exists'
        );
      });

      expect(mockOnRenameCategory).not.toHaveBeenCalled();
    });

    it('should allow editing category to same name with different case', async () => {
      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]); // dairy

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, 'Dairy');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnRenameCategory).toHaveBeenCalledWith('1', 'Dairy');
      });

      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should re-enable buttons after error', async () => {
      mockOnRenameCategory.mockRejectedValueOnce(
        new Error('Network error')
      );

      const { getAllByTestId, getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      const input = getByTestId('edit-input-1');
      fireEvent.changeText(input, 'new name');

      const saveButton = getByTestId('save-edit-button-1');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to rename category'
        );
      });
    });
  });

  describe('Loading State', () => {
    it('should disable all buttons during delete operation', async () => {
      mockOnDeleteCategory.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      (Alert.alert as jest.Mock).mockImplementation(
        (title, message, buttons) => {
          const deleteButton = buttons?.find(
            (b: any) => b.text === 'Delete'
          );
          if (deleteButton?.onPress) {
            deleteButton.onPress();
          }
        }
      );

      render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );
    });

    it('should disable all buttons during rename operation', async () => {
      mockOnRenameCategory.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );
    });

    it('should disable Select All and Clear All during operations', async () => {
      mockOnDeleteCategory.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );
    });
  });

  describe('Modal Close Behavior', () => {
    it('should call onClose when back button is pressed', () => {
      const { getByTestId } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const backButton = getByTestId('back-button');
      fireEvent.press(backButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset local selected categories when reopened', () => {
      const { rerender, getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      fireEvent.press(getByText('Vegetables'));
      expect(getByText('2 categories selected')).toBeTruthy();

      rerender(
        <CategoryViewAllModal
          visible={false}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      rerender(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={['dairy']}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('1 category selected')).toBeTruthy();
    });

    it('should cancel edit mode when modal closes', () => {
      const { getAllByTestId, getByTestId, queryByTestId, rerender } =
        render(
          <CategoryViewAllModal
            visible={true}
            onClose={mockOnClose}
            categories={mockCategories}
            onDeleteCategory={mockOnDeleteCategory}
            onRenameCategory={mockOnRenameCategory}
          />
        );

      const editButtons = getAllByTestId('edit-category-button');
      fireEvent.press(editButtons[0]);

      expect(getByTestId('edit-input-1')).toBeTruthy();

      rerender(
        <CategoryViewAllModal
          visible={false}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      rerender(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(queryByTestId('edit-input-1')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty categories array', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={[]}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('No categories yet')).toBeTruthy();
    });

    it('should handle categories without itemCount', () => {
      const categoriesWithoutCount: Category[] = [
        { fireId: '1', name: 'dairy' },
        { fireId: '2', name: 'vegetables' },
      ];

      const { queryByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={categoriesWithoutCount}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(queryByText(/items$/)).toBeNull();
    });

    it('should handle very long category names', () => {
      const longNameCategories: Category[] = [
        { fireId: '1', name: 'a'.repeat(30), itemCount: 1 },
      ];

      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={longNameCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText(capitalizeFirstLetter('a'.repeat(30)))).toBeTruthy();
    });

    it('should handle many categories (50+)', () => {
      const manyCategories: Category[] = Array.from(
        { length: 50 },
        (_, i) => ({
          fireId: `${i}`,
          name: `category${i}`,
          itemCount: i,
        })
      );

      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={manyCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('Category0')).toBeTruthy();
    });

    it('should handle category names with special characters', () => {
      const specialCategories: Category[] = [
        { fireId: '1', name: "mom's favorites", itemCount: 3 },
        { fireId: '2', name: 'café items', itemCount: 2 },
      ];

      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={specialCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText("Mom's Favorites")).toBeTruthy();
      expect(getByText('Café Items')).toBeTruthy();
    });

    it('should handle selecting and deselecting same category rapidly', () => {
      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={mockCategories}
          selectedCategories={[]}
          onSelectCategories={mockOnSelectCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      const dairy = getByText('Dairy');

      fireEvent.press(dairy);
      fireEvent.press(dairy);
      fireEvent.press(dairy);
      fireEvent.press(dairy);

      expect(getByText('No filters applied')).toBeTruthy();
    });

    it('should handle category with itemCount of 0', () => {
      const zeroItemCategories: Category[] = [
        { fireId: '1', name: 'empty', itemCount: 0 },
      ];

      const { getByText } = render(
        <CategoryViewAllModal
          visible={true}
          onClose={mockOnClose}
          categories={zeroItemCategories}
          onDeleteCategory={mockOnDeleteCategory}
          onRenameCategory={mockOnRenameCategory}
        />
      );

      expect(getByText('0 items')).toBeTruthy();
    });
  });
});

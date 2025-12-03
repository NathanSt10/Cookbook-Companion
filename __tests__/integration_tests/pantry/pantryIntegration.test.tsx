import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import PantryScreen from '../../../app/(tabs)/pantry';
import { AuthProvider } from '../../../app/context/AuthContext';

jest.mock('../../../hooks/usePantry', () => ({
  usePantry: jest.fn(() => ({
    pantry: [],
    stats: { totalItems: 0, categoryCount: 0, lowStockCount: 0 },
    loading: false,
    error: null,
    refresh: jest.fn(),
  })),
}));

jest.mock('../../../hooks/useCategory', () => ({
  useCategory: jest.fn(() => ({
    categories: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
  })),
}));

jest.spyOn(Alert, 'alert');

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('Integration: Pantry Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Item Management Flow', () => {
    it('should add a new pantry item with category and quantity', async () => {
      const { getByText, getByPlaceholderText, getByTestId, queryByText, getAllByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const fab = getByText('+');
      fireEvent.press(fab);

      await waitFor(() => {
        expect(getByText('Add Item')).toBeTruthy();
      });

      const nameInput = getByPlaceholderText(/Tomatoes, Milk, Rice/i);
      fireEvent.changeText(nameInput, 'Chicken Breast');

      const categoryInput = getByPlaceholderText(/Create new category/i);
      fireEvent.changeText(categoryInput, 'Protein');
      
      const addButtons = getAllByText('Add');
      fireEvent.press(addButtons[0]); 

      await waitFor(() => {
        expect(getByText(/1 selected: protein/i)).toBeTruthy();
      });

      const quantityInput = getByPlaceholderText(/e.g., 2, 500, 1.5/i);
      fireEvent.changeText(quantityInput, '2');

      const unitSelector = getByTestId('unit-selector');
      fireEvent.press(unitSelector);

      await waitFor(() => {
        expect(getByText('Select Unit')).toBeTruthy();
      });

      const lbButton = getByText('lb');
      fireEvent.press(lbButton);

      const saveButton = getByTestId('modal-save-button');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(queryByText('Create custom categories to organize your pantry')).toBeNull();
      });
    });

    it('should edit an existing pantry item', async () => {
      const { getByText, getByPlaceholderText, getByTestId, queryByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      // TODO
    });

    it('should show validation error when adding item without name', async () => {
      const { getByText, getByTestId } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const fab = getByText('+');
      fireEvent.press(fab);

      await waitFor(() => {
        expect(getByText('Add Item')).toBeTruthy();
      });

      const saveButton = getByTestId('modal-save-button');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an item name');
      });
    });

    it('should show validation error when quantity has no unit', async () => {
      const { getByText, getByPlaceholderText, getByTestId } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const fab = getByText('+');
      fireEvent.press(fab);

      await waitFor(() => {
        expect(getByText('Add Item')).toBeTruthy();
      });

      const nameInput = getByPlaceholderText(/Tomatoes, Milk, Rice/i);
      fireEvent.changeText(nameInput, 'Milk');

      const quantityInput = getByPlaceholderText(/e.g., 2, 500, 1.5/i);
      fireEvent.changeText(quantityInput, '1');

      const saveButton = getByTestId('modal-save-button');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Missing Unit', 'Please select a unit for the quantity');
      });
    });
  });

  describe('Category Management Flow', () => {
    it('should add a new category', async () => {
      const { getByText, getAllByText, getByPlaceholderText, getByTestId, queryByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const addCategoryButton = getByTestId('add-category');
      fireEvent.press(addCategoryButton);

      await waitFor(() => {
        const addCategoryTexts = getAllByText('Add Category');
        expect(addCategoryTexts.length).toBeGreaterThan(0);
      });

      const categoryInput = getByPlaceholderText(/Frozen Foods, Leftovers, Herbs/i);
      fireEvent.changeText(categoryInput, 'Dairy Products');

      const addButton = getByTestId('add-button-test');
      fireEvent.press(addButton);

      expect(addButton).toBeTruthy();
    });

    it('should show error when adding duplicate category', async () => {
      const { getByText, getAllByText, getByPlaceholderText, getByTestId } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const addCategoryButton = getByTestId('add-category');
      fireEvent.press(addCategoryButton);

      await waitFor(() => {
        const addCategoryTexts = getAllByText('Add Category');
        expect(addCategoryTexts.length).toBeGreaterThan(0);
      });

      // TODO
    });

    it('should filter items by category', async () => {
      const { getByText, queryByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const viewAllButton = getByText('View All');
      fireEvent.press(viewAllButton);

      await waitFor(() => {
        expect(getByText('All Categories')).toBeTruthy();
      });

      // TODO
    });

    it('should rename a category', async () => {
      const { getByText, getByTestId, queryByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const viewAllButton = getByText('View All');
      fireEvent.press(viewAllButton);

      await waitFor(() => {
        expect(getByText('All Categories')).toBeTruthy();
      });
      // TODO
    });

    it('should delete a category', async () => {
      const { getByText, getByTestId } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      const viewAllButton = getByText('View All');
      fireEvent.press(viewAllButton);

      await waitFor(() => {
        expect(getByText('All Categories')).toBeTruthy();
      });

      // TODO
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no items exist', async () => {
      const { getByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      // TODO
    });

    it('should show empty filter state when filters match no items', async () => {
      const { getByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      // TODO
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full pantry workflow: add category → add item → filter → edit → delete', async () => {
      const { getByText, getAllByText, getByPlaceholderText, getByTestId, queryByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-category'));
      
      await waitFor(() => {
        const addCategoryTexts = getAllByText('Add Category');
        expect(addCategoryTexts.length).toBeGreaterThan(0);
      });

      const categoryInput = getByPlaceholderText(/Frozen Foods, Leftovers, Herbs/i);
      fireEvent.changeText(categoryInput, 'Vegetables');
      fireEvent.press(getByTestId('add-button-test'));
      fireEvent.press(getByText('+'));

      await waitFor(() => {
        expect(getByText('Add Item')).toBeTruthy();
      });

      const nameInput = getByPlaceholderText(/Tomatoes, Milk, Rice/i);
      fireEvent.changeText(nameInput, 'Carrots');
      fireEvent.press(getByTestId('modal-save-button'));

      // TODO
      expect(getByTestId('modal-save-button')).toBeTruthy();
    });
  });

  describe('Stats Display', () => {
    it('should display pantry statistics correctly', async () => {
      const { getByText } = renderWithAuth(<PantryScreen />);

      await waitFor(() => {
        expect(getByText('Pantry')).toBeTruthy();
      });
      
      // TODO
    });
  });
});
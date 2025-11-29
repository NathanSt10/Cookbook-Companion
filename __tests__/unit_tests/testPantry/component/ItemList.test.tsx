import { fireEvent, render } from '@testing-library/react-native';
import ItemList from '../../../../components/pantry/ItemList';
import { PantryItem } from '../../../../hooks/usePantry';

jest.mock('../../../../components/pantry/ItemCard', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  
  return jest.fn(({ item, onPress, onEdit, onDelete }) => {
    return React.createElement(
      View,
      { testID: `item-card-${item.fireId}` },
      [
        React.createElement(Text, { key: 'name' }, item.name),
        onPress && React.createElement(
          TouchableOpacity,
          {
            key: 'press',
            testID: `item-press-${item.fireId}`,
            onPress: onPress,
          },
          React.createElement(Text, null, 'Press')
        ),
        onEdit && React.createElement(
          TouchableOpacity,
          {
            key: 'edit',
            testID: `item-edit-${item.fireId}`,
            onPress: onEdit,
          },
          React.createElement(Text, null, 'Edit')
        ),
        onDelete && React.createElement(
          TouchableOpacity,
          {
            key: 'delete',
            testID: `item-delete-${item.fireId}`,
            onPress: onDelete,
          },
          React.createElement(Text, null, 'Delete')
        ),
      ]
    );
  });
});

jest.mock('../../../../components/pantry/PantryEmptyState', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  
  return jest.fn(({ onAddItem }) => {
    return React.createElement(
      View,
      { testID: 'empty-state' },
      [
        React.createElement(Text, { key: 'text' }, 'No items yet'),
        React.createElement(
          TouchableOpacity,
          {
            key: 'button',
            testID: 'empty-state-add-button',
            onPress: onAddItem,
          },
          React.createElement(Text, null, 'Add Item')
        ),
      ]
    );
  });
});

describe('ItemList', () => {
  const mockItems: PantryItem[] = [
    {
      fireId: '1',
      name: 'milk',
      category: ['dairy'],
      quantity: 2,
      unit: 'L',
      addedAt: new Date('2024-01-15'),
    },
    {
      fireId: '2',
      name: 'bread',
      category: ['grains'],
      quantity: 1,
      unit: 'loaf',
      addedAt: new Date('2024-01-16'),
    },
    {
      fireId: '3',
      name: 'eggs',
      category: ['dairy'],
      quantity: 12,
      unit: 'pieces',
      addedAt: new Date('2024-01-17'),
    },
  ];

  const mockOnEditItem = jest.fn();
  const mockOnDeleteItem = jest.fn();
  const mockOnItemPress = jest.fn();
  const mockOnAddItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering with Items', () => {
    it('should render all items in the list', () => {
      const { getByText } = render(
        <ItemList items={mockItems} />
      );

      expect(getByText('milk')).toBeTruthy();
      expect(getByText('bread')).toBeTruthy();
      expect(getByText('eggs')).toBeTruthy();
    });

    it('should use fireId as key for each item', () => {
      const { getByTestId } = render(
        <ItemList items={mockItems} />
      );

      expect(getByTestId('item-card-1')).toBeTruthy();
      expect(getByTestId('item-card-2')).toBeTruthy();
      expect(getByTestId('item-card-3')).toBeTruthy();
    });

    it('should render ItemCard for each item', () => {
      const { getAllByTestId } = render(
        <ItemList items={mockItems} />
      );

      const itemCards = getAllByTestId(/item-card-/);
      expect(itemCards).toHaveLength(3);
    });

    it('should pass item data to ItemCard', () => {
      const ItemCardMock = require('../../../../components/pantry/ItemCard');
      
      render(<ItemList items={mockItems} />);

      // Check the first call (index 0)
      expect(ItemCardMock.mock.calls[0][0]).toMatchObject({
        item: expect.objectContaining({
          fireId: '1',
          name: 'milk',
        }),
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when items array is empty', () => {
      const { getByTestId } = render(
        <ItemList items={[]} />
      );

      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('should pass onAddItem to empty state', () => {
      const { getByTestId } = render(
        <ItemList items={[]} onAddItem={mockOnAddItem} />
      );

      const addButton = getByTestId('empty-state-add-button');
      fireEvent.press(addButton);

      expect(mockOnAddItem).toHaveBeenCalled();
    });

    it('should not show empty state when items exist', () => {
      const { queryByTestId } = render(
        <ItemList items={mockItems} />
      );

      expect(queryByTestId('empty-state')).toBeNull();
    });

    it('should handle empty items array without onAddItem callback', () => {
      const { getByTestId } = render(
        <ItemList items={[]} />
      );

      expect(getByTestId('empty-state')).toBeTruthy();
      
      const addButton = getByTestId('empty-state-add-button');
      fireEvent.press(addButton);
    });
  });

  describe('Item Interactions', () => {
    it('should call onEditItem with item when edit is pressed', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onEditItem={mockOnEditItem}
        />
      );

      const editButton = getByTestId('item-edit-1');
      fireEvent.press(editButton);

      expect(mockOnEditItem).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should call onDeleteItem with id and name when delete is pressed', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const deleteButton = getByTestId('item-delete-1');
      fireEvent.press(deleteButton);

      expect(mockOnDeleteItem).toHaveBeenCalledWith('1', 'milk');
    });

    it('should call onItemPress with item when item is pressed', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onItemPress={mockOnItemPress}
        />
      );

      const pressButton = getByTestId('item-press-1');
      fireEvent.press(pressButton);

      expect(mockOnItemPress).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should handle edit for different items', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onEditItem={mockOnEditItem}
        />
      );

      fireEvent.press(getByTestId('item-edit-1'));
      expect(mockOnEditItem).toHaveBeenCalledWith(mockItems[0]);

      fireEvent.press(getByTestId('item-edit-2'));
      expect(mockOnEditItem).toHaveBeenCalledWith(mockItems[1]);

      fireEvent.press(getByTestId('item-edit-3'));
      expect(mockOnEditItem).toHaveBeenCalledWith(mockItems[2]);
    });

    it('should handle delete for different items', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      fireEvent.press(getByTestId('item-delete-2'));
      expect(mockOnDeleteItem).toHaveBeenCalledWith('2', 'bread');

      fireEvent.press(getByTestId('item-delete-3'));
      expect(mockOnDeleteItem).toHaveBeenCalledWith('3', 'eggs');
    });
  });

  describe('Optional Callbacks', () => {
    it('should not pass onPress to ItemCard when onItemPress is not provided', () => {
      const ItemCardMock = require('../../../../components/pantry/ItemCard');
      
      render(<ItemList items={mockItems} />);

      ItemCardMock.mock.calls.forEach((call: any) => {
        expect(call[0].onPress).toBeUndefined();
      });
    });

    it('should not pass onEdit to ItemCard when onEditItem is not provided', () => {
      const ItemCardMock = require('../../../../components/pantry/ItemCard');
      
      render(<ItemList items={mockItems} />);

      ItemCardMock.mock.calls.forEach((call: any) => {
        expect(call[0].onEdit).toBeUndefined();
      });
    });

    it('should not pass onDelete to ItemCard when onDeleteItem is not provided', () => {
      const ItemCardMock = require('../../../../components/pantry/ItemCard');
      
      render(<ItemList items={mockItems} />);

      ItemCardMock.mock.calls.forEach((call: any) => {
        expect(call[0].onDelete).toBeUndefined();
      });
    });

    it('should pass all callbacks when provided', () => {
      const ItemCardMock = require('../../../../components/pantry/ItemCard');
      
      render(
        <ItemList
          items={mockItems}
          onEditItem={mockOnEditItem}
          onDeleteItem={mockOnDeleteItem}
          onItemPress={mockOnItemPress}
        />
      );

      ItemCardMock.mock.calls.forEach((call: any) => {
        expect(call[0].onPress).toEqual(expect.any(Function));
        expect(call[0].onEdit).toEqual(expect.any(Function));
        expect(call[0].onDelete).toEqual(expect.any(Function));
      });
    });
  });

  describe('FlatList Behavior', () => {
    it('should hide vertical scroll indicator', () => {
      const { UNSAFE_getByType } = render(
        <ItemList items={mockItems} />
      );

      const FlatList = require('react-native').FlatList;
      const flatList = UNSAFE_getByType(FlatList);
      
      expect(flatList.props.showsVerticalScrollIndicator).toBe(false);
    });

    it('should apply content container style', () => {
      const { UNSAFE_getByType } = render(
        <ItemList items={mockItems} />
      );

      const FlatList = require('react-native').FlatList;
      const flatList = UNSAFE_getByType(FlatList);
      
      expect(flatList.props.contentContainerStyle).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item', () => {
      const singleItem = [mockItems[0]];

      const { getByText, queryByText } = render(
        <ItemList items={singleItem} />
      );

      expect(getByText('milk')).toBeTruthy();
      expect(queryByText('bread')).toBeNull();
      expect(queryByText('eggs')).toBeNull();
    });

    it('should handle very long list of items', () => {
      const manyItems: PantryItem[] = Array.from({ length: 100 }, (_, i) => ({
        fireId: `${i}`,
        name: `item${i}`,
        category: ['test'],
        addedAt: new Date(),
      }));

      const { getByText, getByTestId } = render(
        <ItemList items={manyItems} />
      );

      expect(getByText('item0')).toBeTruthy();
      expect(getByTestId('item-card-0')).toBeTruthy();
    });

    it('should handle items with duplicate names', () => {
      const duplicateItems: PantryItem[] = [
        { ...mockItems[0], fireId: '1' },
        { ...mockItems[0], fireId: '2' },
        { ...mockItems[0], fireId: '3' },
      ];

      const { getAllByText } = render(
        <ItemList items={duplicateItems} />
      );

      const milkItems = getAllByText('milk');
      expect(milkItems).toHaveLength(3);
    });

    it('should handle items without optional fields', () => {
      const minimalItems: PantryItem[] = [
        {
          fireId: '1',
          name: 'salt',
          category: ['spices'],
          addedAt: new Date(),
        },
      ];

      const { getByText } = render(
        <ItemList items={minimalItems} />
      );

      expect(getByText('salt')).toBeTruthy();
    });

    it('should re-render when items array changes', () => {
      const { getByText, queryByText, rerender } = render(
        <ItemList items={[mockItems[0]]} />
      );

      expect(getByText('milk')).toBeTruthy();
      expect(queryByText('bread')).toBeNull();

      rerender(<ItemList items={mockItems} />);

      expect(getByText('milk')).toBeTruthy();
      expect(getByText('bread')).toBeTruthy();
      expect(getByText('eggs')).toBeTruthy();
    });

    it('should transition from items to empty state', () => {
      const { queryByTestId, getByText, rerender } = render(
        <ItemList items={mockItems} />
      );

      expect(getByText('milk')).toBeTruthy();
      expect(queryByTestId('empty-state')).toBeNull();

      rerender(<ItemList items={[]} />);

      expect(queryByTestId('empty-state')).toBeTruthy();
    });

    it('should transition from empty state to items', () => {
      const { queryByTestId, queryByText, rerender } = render(
        <ItemList items={[]} />
      );

      expect(queryByTestId('empty-state')).toBeTruthy();
      expect(queryByText('milk')).toBeNull();

      rerender(<ItemList items={mockItems} />);

      expect(queryByTestId('empty-state')).toBeNull();
      expect(queryByText('milk')).toBeTruthy();
    });
  });

  describe('Multiple Interactions', () => {
    it('should handle multiple edits in sequence', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onEditItem={mockOnEditItem}
        />
      );

      fireEvent.press(getByTestId('item-edit-1'));
      fireEvent.press(getByTestId('item-edit-2'));
      fireEvent.press(getByTestId('item-edit-3'));

      expect(mockOnEditItem).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple deletes in sequence', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      fireEvent.press(getByTestId('item-delete-1'));
      fireEvent.press(getByTestId('item-delete-2'));

      expect(mockOnDeleteItem).toHaveBeenCalledTimes(2);
    });

    it('should handle mixed interactions', () => {
      const { getByTestId } = render(
        <ItemList
          items={mockItems}
          onEditItem={mockOnEditItem}
          onDeleteItem={mockOnDeleteItem}
          onItemPress={mockOnItemPress}
        />
      );

      fireEvent.press(getByTestId('item-press-1'));
      fireEvent.press(getByTestId('item-edit-2'));
      fireEvent.press(getByTestId('item-delete-3'));

      expect(mockOnItemPress).toHaveBeenCalledTimes(1);
      expect(mockOnEditItem).toHaveBeenCalledTimes(1);
      expect(mockOnDeleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    it('should efficiently handle large datasets', () => {
      const largeDataset: PantryItem[] = Array.from({ length: 1000 }, (_, i) => ({
        fireId: `${i}`,
        name: `item${i}`,
        category: ['test'],
        addedAt: new Date(),
      }));

      const { getByText } = render(
        <ItemList items={largeDataset} />
      );

      expect(getByText('item0')).toBeTruthy();
    });

    it('should use fireId as key extractor', () => {
      const { UNSAFE_getByType } = render(
        <ItemList items={mockItems} />
      );

      const FlatList = require('react-native').FlatList;
      const flatList = UNSAFE_getByType(FlatList);
      // flatlist vs scrollview?

      const keyExtractor = flatList.props.keyExtractor;
      expect(keyExtractor(mockItems[0])).toBe('1');
      expect(keyExtractor(mockItems[1])).toBe('2');
    });
  });
});
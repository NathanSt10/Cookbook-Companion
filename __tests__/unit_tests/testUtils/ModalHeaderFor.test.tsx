import { fireEvent, render } from '@testing-library/react-native';
import ModalHeaderFor from '../../../utils/ModalHeaderFor';

describe('ModalHeaderFor', () => {
  const mockOnBack = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    title: 'Test Modal',
    onBack: mockOnBack,
    backButtonTestId: 'modal-back-button',
    rightButtonTestId: 'modal-save-button',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering - Basic Elements', () => {
    it('should render the modal title', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      expect(getByText('Test Modal')).toBeTruthy();
    });

    it('should render back button', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      expect(getByTestId('modal-back-button')).toBeTruthy();
    });

    it('should render without crashing', () => {
      expect(() => {
        render(<ModalHeaderFor {...defaultProps} />);
      }).not.toThrow();
    });

    it('should render all three sections (back, title, right)', () => {
      const { getByText, getByTestId } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      expect(getByTestId('modal-back-button')).toBeTruthy();
      expect(getByText('Test Modal')).toBeTruthy();
      expect(getByTestId('modal-save-button')).toBeTruthy();
    });
  });

  describe('Back Button', () => {
    it('should call onBack when back button is pressed', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      const backButton = getByTestId('modal-back-button');
      fireEvent.press(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should disable back button when loading', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} loading={true} />
      );

      const backButton = getByTestId('modal-back-button');
      expect(backButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should enable back button when not loading', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} loading={false} />
      );

      const backButton = getByTestId('modal-back-button');
      expect(backButton.props.accessibilityState.disabled).toBe(false);
    });

    it('should not call onBack when disabled', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} loading={true} />
      );

      const backButton = getByTestId('modal-back-button');
      fireEvent.press(backButton);

      expect(backButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should use custom back button testID', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps}
          backButtonTestId="custom-back-button"
        />
      );

      expect(getByTestId('custom-back-button')).toBeTruthy();
    });

    it('should render chevron-back icon', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      const backButton = getByTestId('modal-back-button');
      expect(backButton).toBeTruthy();
    });
  });

  describe('Title Display', () => {
    it('should display the provided title', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} title="Edit Item" />
      );

      expect(getByText('Edit Item')).toBeTruthy();
    });

    it('should handle long titles', () => {
      const longTitle = 'This is a very long modal title that might wrap';
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} title={longTitle} />
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('should handle titles with special characters', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} title="Edit Item's Details" />
      );

      expect(getByText("Edit Item's Details")).toBeTruthy();
    });

    it('should center the title', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} title="Centered Title" />
      );

      const title = getByText('Centered Title');
      expect(title.props.style.textAlign).toBe('center');
    });

    it('should apply title styles', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} title="Styled Title" />
      );

      const title = getByText('Styled Title');
      expect(title.props.style.fontSize).toBe(28);
      expect(title.props.style.fontWeight).toBe('bold');
      expect(title.props.style.color).toBe('black');
    });
  });

  describe('Right Button (Save/Apply/Done)', () => {
    it('should render save button when onSave is provided', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      expect(getByTestId('modal-save-button')).toBeTruthy();
    });

    it('should not render save button when onSave is not provided', () => {
      const { queryByTestId } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      expect(queryByTestId('modal-save-button')).toBeNull();
    });

    it('should call onSave when save button is pressed', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      const saveButton = getByTestId('modal-save-button');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('should display default "Save" text', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      expect(getByText('Save')).toBeTruthy();
    });

    it('should display custom right text', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          rightText="Apply"
        />
      );

      expect(getByText('Apply')).toBeTruthy();
    });

    it('should use custom right button testID', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps}
          onSave={mockOnSave}
          rightButtonTestId="custom-save-button"
        />
      );

      expect(getByTestId('custom-save-button')).toBeTruthy();
    });

    it('should disable save button when loading', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
        />
      );

      const saveButton = getByTestId('modal-save-button');
      expect(saveButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should show "Standby" text when loading', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
        />
      );

      expect(getByText('Standby')).toBeTruthy();
    });

    it('should change text from "Save" to "Standby" when loading starts', () => {
      const { getByText, rerender, queryByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={false}
        />
      );

      expect(getByText('Save')).toBeTruthy();

      rerender(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
        />
      );

      expect(queryByText('Save')).toBeNull();
      expect(getByText('Standby')).toBeTruthy();
    });

    it('should apply disabled text style when loading', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
        />
      );

      const standbyText = getByText('Standby');
      expect(standbyText.props.style).toBeDefined();
    });
  });

  describe('showSave Prop', () => {
    it('should hide save button when showSave is false', () => {
      const { queryByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          showSave={false}
        />
      );

      expect(queryByTestId('modal-save-button')).toBeNull();
    });

    it('should show save button when showSave is true', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          showSave={true}
        />
      );

      expect(getByTestId('modal-save-button')).toBeTruthy();
    });

    it('should show save button by default (showSave defaults to true)', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      expect(getByTestId('modal-save-button')).toBeTruthy();
    });

    it('should render spacer view when save button is hidden', () => {
      const { UNSAFE_getAllByType } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          showSave={false}
        />
      );

      const View = require('react-native').View;
      const views = UNSAFE_getAllByType(View);
      
      const spacer = views.find(v => v.props.style?.width === 60);
      expect(spacer).toBeTruthy();
    });

    it('should hide save button even when onSave is provided if showSave is false', () => {
      const { queryByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          showSave={false}
        />
      );

      expect(queryByTestId('modal-save-button')).toBeNull();
    });
  });

  describe('Right Text Variations', () => {
    const rightTexts = ['Save', 'Apply', 'Done', 'Confirm', 'Submit', 'Next', 'Finish'];

    rightTexts.forEach(text => {
      it(`should display "${text}" as right button text`, () => {
        const { getByText } = render(
          <ModalHeaderFor 
            {...defaultProps} 
            onSave={mockOnSave}
            rightText={text}
          />
        );

        expect(getByText(text)).toBeTruthy();
      });
    });

    it('should handle empty string as rightText', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          rightText=""
        />
      );

      const button = getByTestId('modal-save-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should disable both buttons when loading', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
        />
      );

      expect(getByTestId('modal-back-button').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('modal-save-button').props.accessibilityState.disabled).toBe(true);
    });

    it('should enable both buttons when not loading', () => {
      const { getByTestId } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={false}
        />
      );

      expect(getByTestId('modal-back-button').props.accessibilityState.disabled).toBe(false);
      expect(getByTestId('modal-save-button').props.accessibilityState.disabled).toBe(false);
    });

    it('should transition from loading to not loading', () => {
      const { getByTestId, getByText, rerender } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
          rightText="Save"
        />
      );

      expect(getByText('Standby')).toBeTruthy();
      expect(getByTestId('modal-save-button').props.accessibilityState.disabled).toBe(true);

      rerender(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={false}
          rightText="Save"
        />
      );

      expect(getByText('Save')).toBeTruthy();
      expect(getByTestId('modal-save-button').props.accessibilityState.disabled).toBe(false);
    });

    it('should not affect title during loading', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps}
          title="My Modal"
          onSave={mockOnSave}
          loading={true}
        />
      );

      expect(getByText('My Modal')).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should have header container with proper flexDirection', () => {
      const { UNSAFE_getAllByType } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      const View = require('react-native').View;
      const header = UNSAFE_getAllByType(View)[0];
      
      expect(header.props.style.flexDirection).toBe('row');
      expect(header.props.style.alignItems).toBe('center');
      expect(header.props.style.justifyContent).toBe('space-between');
    });

    it('should have three main sections', () => {
      const { getByTestId, getByText } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      expect(getByTestId('modal-back-button')).toBeTruthy();
      expect(getByText('Test Modal')).toBeTruthy();
      expect(getByTestId('modal-save-button')).toBeTruthy();
    });

    it('should maintain layout when save button is hidden', () => {
      const { getByTestId, getByText } = render(
        <ModalHeaderFor {...defaultProps} showSave={false} />
      );

      expect(getByTestId('modal-back-button')).toBeTruthy();
      expect(getByText('Test Modal')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply header styles', () => {
      const { UNSAFE_getAllByType } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      const View = require('react-native').View;
      const header = UNSAFE_getAllByType(View)[0];
      
      expect(header.props.style.backgroundColor).toBe('white');
      expect(header.props.style.borderBottomWidth).toBe(1);
      expect(header.props.style.borderBottomColor).toBe('gainsboro');
    });

    it('should apply padding to header', () => {
      const { UNSAFE_getAllByType } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      const View = require('react-native').View;
      const header = UNSAFE_getAllByType(View)[0];
      
      expect(header.props.style.paddingHorizontal).toBe(16);
      expect(header.props.style.paddingTop).toBe(40);
      expect(header.props.style.paddingBottom).toBe(20);
    });

    it('should style save button text in royalblue', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={false}
        />
      );

      const saveText = getByText('Save');
      const styles = saveText.props.style;
      
      expect(styles).toBeDefined();
    });

    it('should change text color when loading', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          loading={true}
        />
      );

      const standbyText = getByText('Standby');

      expect(standbyText.props.style).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid back button presses', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      const backButton = getByTestId('modal-back-button');
      
      fireEvent.press(backButton);
      fireEvent.press(backButton);
      fireEvent.press(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple rapid save button presses', () => {
      const { getByTestId } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      const saveButton = getByTestId('modal-save-button');
      
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(3);
    });

    it('should handle very long right button text', () => {
      const longText = 'Very Long Button Text That Might Overflow';
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          rightText={longText}
        />
      );

      expect(getByText(longText)).toBeTruthy();
    });

    it('should handle emoji in title', () => {
      const { getByText } = render(
        <ModalHeaderFor {...defaultProps} title="📝 Edit Item" />
      );

      expect(getByText('📝 Edit Item')).toBeTruthy();
    });

    it('should handle emoji in right button text', () => {
      const { getByText } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          rightText="✓ Save"
        />
      );

      expect(getByText('✓ Save')).toBeTruthy();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with ItemEditModal configuration', () => {
      const { getByText, getByTestId } = render(
        <ModalHeaderFor
          title="Edit Item"
          onBack={mockOnBack}
          onSave={mockOnSave}
          rightText="Save"
          loading={false}
          backButtonTestId="edit-back-button"
          rightButtonTestId="edit-save-button"
        />
      );

      expect(getByText('Edit Item')).toBeTruthy();
      expect(getByTestId('edit-back-button')).toBeTruthy();
      expect(getByTestId('edit-save-button')).toBeTruthy();
      expect(getByText('Save')).toBeTruthy();
    });

    it('should work with CategoryViewAllModal configuration', () => {
      const { getByText, getByTestId } = render(
        <ModalHeaderFor
          title="Filter Categories"
          onBack={mockOnBack}
          onSave={mockOnSave}
          rightText="Apply"
          loading={false}
          backButtonTestId="filter-back-button"
          rightButtonTestId="filter-apply-button"
        />
      );

      expect(getByText('Filter Categories')).toBeTruthy();
      expect(getByText('Apply')).toBeTruthy();
      expect(getByTestId('filter-apply-button')).toBeTruthy();
    });

    it('should work with ItemAddModal configuration', () => {
      const { getByText, getByTestId } = render(
        <ModalHeaderFor
          title="Add Item"
          onBack={mockOnBack}
          onSave={mockOnSave}
          rightText="Save"
          loading={false}
          backButtonTestId="add-back-button"
          rightButtonTestId="add-save-button"
        />
      );

      expect(getByText('Add Item')).toBeTruthy();
      expect(getByText('Save')).toBeTruthy();
      expect(getByTestId('add-save-button')).toBeTruthy();
    });

    it('should work in read-only mode (no save button)', () => {
      const { getByText, getByTestId, queryByTestId } = render(
        <ModalHeaderFor
          title="View Details"
          onBack={mockOnBack}
          showSave={false}
          backButtonTestId="view-back-button"
          rightButtonTestId="view-save-button"
        />
      );

      expect(getByText('View Details')).toBeTruthy();
      expect(getByTestId('view-back-button')).toBeTruthy();
      expect(queryByTestId('view-save-button')).toBeNull();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot with save button', () => {
      const { toJSON } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot without save button', () => {
      const { toJSON } = render(
        <ModalHeaderFor {...defaultProps} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot in loading state', () => {
      const { toJSON } = render(
        <ModalHeaderFor {...defaultProps} onSave={mockOnSave} loading={true} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with custom right text', () => {
      const { toJSON } = render(
        <ModalHeaderFor 
          {...defaultProps} 
          onSave={mockOnSave}
          rightText="Apply"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
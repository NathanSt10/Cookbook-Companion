import { fireEvent, render } from '@testing-library/react-native';
import CategoryRowView from '../../../../components/pantry/CategoryRowView';

describe('CategoryRowView', () => {
  it('renders title', () => {
    const { getByText } = render(<CategoryRowView />);
    expect(getByText('Categories')).toBeTruthy();
  });

  it('renders View All when handler is provided', () => {
    const { getByText } = render(
      <CategoryRowView onViewAll={jest.fn()} />
    );
    expect(getByText('View All')).toBeTruthy();
  });

  it('renders Add Category when handler is provided', () => {
    const { getByText } = render(
      <CategoryRowView onAddCategory={jest.fn()} />
    );
    expect(getByText('Add Category')).toBeTruthy();
  });

  it('does not render actions when handlers are missing', () => {
    const { queryByText } = render(<CategoryRowView />);
    expect(queryByText('View All')).toBeNull();
    expect(queryByText('Add Category')).toBeNull();
  });

  it('calls onViewAll when pressed', () => {
    const mock = jest.fn();
    const { getByText } = render(
      <CategoryRowView onViewAll={mock} />
    );
    fireEvent.press(getByText('View All'));
    expect(mock).toHaveBeenCalled();
  });

  it('calls onAddCategory when pressed', () => {
    const mock = jest.fn();
    const { getByText } = render(
      <CategoryRowView onAddCategory={mock} />
    );
    fireEvent.press(getByText('Add Category'));
    expect(mock).toHaveBeenCalled();
  });
});

import { onAuthStateChanged } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../../../app/(tabs)/profile';
import { AuthProvider } from '../../../app/context/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

jest.mock('expo-router');
jest.mock('@react-native-firebase/auth');
jest.mock('@react-native-firebase/firestore');

describe('Integration: Preferences Editing Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'test@example.com',
      });
      return jest.fn();
    });
  });

  it('should complete full preferences editing workflow', async () => {
    const { getByText, getByPlaceholderText, getAllByText, queryByTestId } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      const preferencesTab = getByText('Preferences');
      fireEvent.press(preferencesTab);
    });

    await waitFor(() => {
      const editButton = getByText('Edit Preferences');
      expect(editButton).toBeTruthy();
      fireEvent.press(editButton);
    });

    await waitFor(() => {
      const saveButton = queryByTestId('save-button-id');
      expect(saveButton).toBeTruthy();
    });

    await waitFor(() => {
      const dietaryInput = getByPlaceholderText(/Vegetarian, Keto/i);
      fireEvent.changeText(dietaryInput, 'Vegetarian');
      
      const addButtons = getAllByText('+');
      fireEvent.press(addButtons[0]); 
    });

    await waitFor(() => {
      const allergyInput = getByPlaceholderText(/Peanuts, Dairy/i);
      fireEvent.changeText(allergyInput, 'Peanuts');
      
      const addButtons = getAllByText('+');
      fireEvent.press(addButtons[1]); 
    });

    await waitFor(() => {
      const saveButton = queryByTestId('save-button-id');
      expect(saveButton).toBeTruthy();
      if (saveButton) {
        fireEvent.press(saveButton);
      }
    });

    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
    });
  });

  it('should cancel editing and restore previous preferences', async () => {
    const { getByText, getByPlaceholderText, getByTestId, getAllByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Preferences'));
    });

    await waitFor(() => {
      fireEvent.press(getByText('Edit Preferences'));
    });

    await waitFor(() => {
      const input = getByPlaceholderText(/Vegetarian/i);
      fireEvent.changeText(input, 'Vegan');
      const addButtons = getAllByText('+');
      fireEvent.press(addButtons[0]);
    });

    await waitFor(() => {
      const backButton = getByTestId('back-button-id');
      fireEvent.press(backButton);
    });

    expect(firestore().collection('Users').doc).not.toHaveBeenCalled();
  });
});
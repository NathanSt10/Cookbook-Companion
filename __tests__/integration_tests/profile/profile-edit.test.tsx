import { onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../../../app/(tabs)/profile';
import { AuthProvider } from '../../../app/context/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

jest.mock('expo-router');
jest.mock('@react-native-firebase/auth');
jest.mock('@react-native-firebase/firestore');

describe('Integration: Profile Editing Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'john@example.com',
      });
      return jest.fn();
    });
  });

  it('should edit profile information successfully', async () => {
    const { getByText, getByPlaceholderText, getByTestId, queryByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      const editButton = getByText('Edit Profile');
      fireEvent.press(editButton);
    });

    await waitFor(() => {
      expect(getByPlaceholderText('First Name')).toBeTruthy();
      expect(getByPlaceholderText('Last Name')).toBeTruthy();
    });

    await waitFor(() => {
      const firstNameInput = getByPlaceholderText('First Name');
      fireEvent.changeText(firstNameInput, 'Johnny');
    });

    await waitFor(() => {
      const lastNameInput = getByPlaceholderText('Last Name');
      fireEvent.changeText(lastNameInput, 'Appleseed');
    });

    await waitFor(() => {
      const saveButton = getByTestId('save-button-test');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(queryByText('First Name')).toBeNull();
    });

    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
      expect(getByText('Edit Profile')).toBeTruthy();
    });
  });

  it('should sign out from edit profile modal', async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Edit Profile'));
    });

    await waitFor(() => {
      const signOutButton = getByText('Sign Out');
      fireEvent.press(signOutButton);
    });

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });

  it('should cancel profile edit without saving', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      fireEvent.press(getByText('Edit Profile'));
    });

    await waitFor(() => {
      const firstNameInput = getByPlaceholderText('First Name');
      fireEvent.changeText(firstNameInput, 'Changed');
    });

    await waitFor(() => {
      const backButton = getByTestId('back-button-test');
      fireEvent.press(backButton);
    });

    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy();
    });
  });
});
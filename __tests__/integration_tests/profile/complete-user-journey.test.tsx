import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import SignInScreen from '../../../app/(auth)/signin';
import SignUpScreen from '../../../app/(auth)/signup';
import ProfileScreen from '../../../app/(tabs)/profile';
import { AuthProvider } from '../../../app/context/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

jest.mock('expo-router');
jest.mock('@react-native-firebase/auth');
jest.mock('@react-native-firebase/firestore');

describe('Integration: Complete User Journey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full user journey: signup → profile setup → preferences', async () => {
    const mockUser = {
      uid: 'new-user-123',
      email: 'newuser@example.com',
    };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
      additionalUserInfo: { isNewUser: true },
    });

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const signupScreen = renderWithAuth(<SignUpScreen />);

    fireEvent.changeText(signupScreen.getByPlaceholderText('First name'), 'New');
    fireEvent.changeText(signupScreen.getByPlaceholderText('Last name'), 'User');
    fireEvent.changeText(signupScreen.getByPlaceholderText('email@domain.com'), 'newuser@example.com');
    fireEvent.changeText(signupScreen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(signupScreen.getByText('Continue'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalled();

      const calls = (createUserWithEmailAndPassword as jest.Mock).mock.calls;
      expect(calls[0][1]).toBe('newuser@example.com');
      expect(calls[0][2]).toBe('password123');
    });

    const profileScreen = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      expect(profileScreen.getByText('Test User')).toBeTruthy();
      expect(profileScreen.getByText('test@example.com')).toBeTruthy();
    });

    await waitFor(() => {
      fireEvent.press(profileScreen.getByText('Preferences'));
    });

    await waitFor(() => {
      fireEvent.press(profileScreen.getByText('Edit Preferences'));
    });

    await waitFor(() => {
      const input = profileScreen.getByPlaceholderText(/Vegetarian/i);
      fireEvent.changeText(input, 'Keto');
      
      const addButton = profileScreen.getAllByText('+')[0];
      fireEvent.press(addButton);
    });

    await waitFor(() => {
      const saveButton = profileScreen.getByTestId('save-button-id');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(profileScreen.getByText('Test User')).toBeTruthy();
    });
  });

  it('should handle login → view profile → edit preferences → save', async () => {
    const mockUser = {
      uid: 'existing-user-123',
      email: 'existing@example.com',
    };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const signinScreen = renderWithAuth(<SignInScreen />);

    fireEvent.changeText(signinScreen.getByPlaceholderText('Email'), 'existing@example.com');
    fireEvent.changeText(signinScreen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(signinScreen.getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });

    const profileScreen = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      expect(profileScreen.getByText('Test User')).toBeTruthy();
    });

    fireEvent.press(profileScreen.getByText('Preferences'));

    await waitFor(() => {
      fireEvent.press(profileScreen.getByText('Edit Preferences'));
    });

    await waitFor(() => {
      const input = profileScreen.getByPlaceholderText(/Italian, Mexican/i);
      fireEvent.changeText(input, 'Thai');
      
      const addButton = profileScreen.getAllByText('+')[2]; 
      fireEvent.press(addButton);
    });

    await waitFor(() => {
      fireEvent.press(profileScreen.getByTestId('save-button-id'));
    });

    expect(router.push).not.toHaveBeenCalled(); 
  });
});
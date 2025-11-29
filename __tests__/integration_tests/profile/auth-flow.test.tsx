it('placeholder', () => expect(true).toBe(true));

import auth from '@react-native-firebase/auth';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../../../app/(auth)/signup';
import ProfileScreen from '../../../app/(tabs)/profile';
import { AuthProvider } from '../../../app/context/AuthContext';

const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {}
  }),
}));

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
};

const mockAuthStateChanged = jest.fn();

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: mockFirestoreGet,
        set: mockFirestoreSet,
        update: jest.fn(),
      })),
    })),
  });
});

describe('Profile Auth Flow', async () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockReplace.mockClear();
  });

  auth().createUserWithEmailAndPassword = mockCreateUser;

  mockFirestoreGet.mockResolvedValue(undefined);

  const { getByPlaceholderText, getByText } = render(
    <AuthProvider>
      <SignUpScreen />
    </AuthProvider>
  );

  const emailInput = getByPlaceholderText(/email/i);
  const passInput = getByPlaceholderText(/pass/i);
  const firstNameInput = getByPlaceholderText(/first name/i);
  const lastNameInput = getByPlaceholderText(/last name/i);

  fireEvent.changeText(emailInput, 'testme@example,com');
  fireEvent.changeText(passInput, 'password');
  fireEvent.changeText(firstNameInput, 'Test');
  fireEvent.changeText(lastNameInput, 'Me');

  const signUpButton = getByText(/sign up/i);
  fireEvent.press(signUpButton);

  await waitFor(() => {
    expect(mockCreateUser).toHaveBeenCalledWith(
      'testme@example.com',
      'password',
    );

    expect(mockFirestoreSet).toHaveBeenCalledWith(
     expect.objectContaining({
        email: 'testme@example.com',
        firstName: 'Test',
        lastName: 'Me',
      })
    );
  });

  mockFirestoreGet.mockResolvedValue({
    exists: true,
    data: () => ({
      email: 'testme@example.com',
      firstName: 'Test',
      lastName: 'Me',
    }),
  });

  auth().currentUser = mockUser;

  const { getByText: getByTextProfile } = render(
    <AuthProvider>
      <ProfileScreen />
    </AuthProvider>
  );
  
  await waitFor(() => {
    expect(getByTextProfile('Test Me')).toBeTruthy();
    expect(getByTextProfile('newuser@example.com')).toBeTruthy();
  });
});
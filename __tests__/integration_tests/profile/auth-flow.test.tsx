import { onAuthStateChanged } from '@react-native-firebase/auth';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../../../app/(tabs)/profile';
import { AuthProvider } from '../../../app/context/AuthContext';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

jest.mock('expo-router');
jest.mock('@react-native-firebase/auth');

describe('Auth Flow Tests - Step 5: Profile Screen (Simplified)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render profile screen without crashing', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
      });
      return jest.fn();
    });

    const screen = renderWithAuth(<ProfileScreen />);
    expect(screen).toBeTruthy();
  });

  it('should display user information from Firestore', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'test@example.com',
      });
      return jest.fn();
    });

    const { getByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy(); 
      expect(getByText('test@example.com')).toBeTruthy();
    });
  });

  it('should have profile action buttons', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'test@example.com',
      });
      return jest.fn();
    });

    const { getByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Edit Profile')).toBeTruthy();
      expect(getByText('Liked')).toBeTruthy();
      expect(getByText('Saved')).toBeTruthy();
      expect(getByText('Preferences')).toBeTruthy();
    });
  });

  it('should display liked collection section', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'test@example.com',
      });
      return jest.fn();
    });

    const { getByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText(/Empty.*liked.*collection/i)).toBeTruthy();
      expect(getByText('Click the + button to add to this collection')).toBeTruthy();
    });
  });

  it('should have an add button', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({
        uid: 'test-user-123',
        email: 'test@example.com',
      });
      return jest.fn();
    });

    const { getByText } = renderWithAuth(<ProfileScreen />);

    await waitFor(() => {
      const addButton = getByText('+');
      expect(addButton).toBeTruthy();
      
      fireEvent.press(addButton);
    });
  });

  it('should show loading state when no user is authenticated', () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      return jest.fn();
    });

    const { queryByText } = renderWithAuth(<ProfileScreen />);

    expect(queryByText('Test User')).toBeNull();
  });
});
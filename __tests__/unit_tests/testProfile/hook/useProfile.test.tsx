import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../../../app/context/AuthContext';
import { useProfile } from '../../../../hooks/useProfile';

jest.mock('../../../../app/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockOnSnapshot = jest.fn();
const mockGet = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();

jest.mock('@react-native-firebase/firestore', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      collection: mockCollection,
    })),
  };
});

describe('useProfile hook', () => {
  const mockUser = { uid: 'test-user-123' };
  const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockDoc.mockReturnValue({
      onSnapshot: mockOnSnapshot,
      get: mockGet,
    });
    
    mockCollection.mockReturnValue({
      doc: mockDoc,
    });
  });

  it('should initialize with default values when no user is authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);
    expect(result.current.firstName).toBe('');
    expect(result.current.lastName).toBe('');
    expect(result.current.email).toBe('');
  });

  it('should fetch user profile data successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockDockSnapshot = {
        data: () => mockUserData,
      };
      onSuccess(mockDockSnapshot);
      return jest.fn();
    })

    const { result } = renderHook(() => useProfile());
  
    await waitFor(() => { 
      expect(result.current.loading).toBe(false); 
    }, { timeout: 3000 });

    expect(mockCollection).toHaveBeenCalledWith('Users');
    expect(mockDoc).toHaveBeenCalledWith('test-user-123');
    expect(mockOnSnapshot).toHaveBeenCalled();

    expect(result.current.firstName).toBe('John');
    expect(result.current.lastName).toBe('Doe');
    expect(result.current.email).toBe('john.doe@example.com');
    expect(result.current.error).toBeNull();
  });

  it('should handle missing user data gracefully', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockDockSnapshot = {
        data: () => null, 
      };

      onSuccess(mockDockSnapshot);
      return jest.fn();
    });

    const { result } = renderHook(() => useProfile());
    
    await waitFor(() => { 
      expect(result.current.loading).toBe(false); 
    }, { timeout: 3000 });

    expect(result.current.email).toBe('');
    expect(result.current.firstName).toBe('');
    expect(result.current.lastName).toBe('');
  });

  it('should handle errors during data fetching', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    const mockError = new Error('unable to fetch user');
    mockOnSnapshot.mockImplementation((onSuccess, onError) => {
      onError(mockError);
      return jest.fn();
    });

    const { result } = renderHook(() => useProfile());
    
    await waitFor(() => { 
      expect(result.current.loading).toBe(false); 
    }, { timeout: 3000 });
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe("unable to fetch user");
  });

  it('should refresh data when refresh function is called', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockDockSnapshot = {
        data: () => ({ ...mockUserData, firstName: 'John'}),
      };
      onSuccess(mockDockSnapshot);
      return jest.fn();
    })

    const { result } = renderHook(() => useProfile());
    
    await waitFor(() => { 
      expect(result.current.loading).toBe(false); 
    }, { timeout: 3000 });

    expect(result.current.firstName).toBe('John');

    mockGet.mockResolvedValue({
      data: () => ({ ...mockUserData, firstName: 'Jane' }),
    });

    await result.current.refresh();

    await waitFor(() => {
      expect(result.current.firstName).toBe('Jane');
    }, { timeout: 3000 });
  });
});
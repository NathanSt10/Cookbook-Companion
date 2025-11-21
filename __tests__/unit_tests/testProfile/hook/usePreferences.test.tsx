import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../../../app/context/AuthContext';
import { usePreferences } from '../../../../hooks/usePreferences';

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

describe('usePreferences hook', () => {
  const mockUser = { uid: 'test-user-123' };
  
  const mockPreferencesData = {
    allergies: ['Soy', 'Peanuts', 'Honeydew'],
    dislikes: ['Mushrooms', 'Olives'],
    dietary: ['Vegetarian', 'Gluten-Free'],
    cuisines: ['Italian', 'Mexican'],
    kitchenware: ['Air Fryer', 'Instant Pot'],
    cookingpref: ['Quick Meals', '30 Minutes'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockPreferencesCollection = {
      doc: jest.fn((docId) => ({
        get: mockGet,
      })),
      onSnapshot: mockOnSnapshot,
    };

    mockDoc.mockReturnValue({
      collection: jest.fn(() => mockPreferencesCollection),
    });
    
    mockCollection.mockReturnValue({
      doc: mockDoc,
    });
  });

  it('should initialize with empty arrays for all preference categories', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockSnapshot = {
        forEach: jest.fn(),
      };
      onSuccess(mockSnapshot);
      return jest.fn(); 
    });

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.item.dietary).toEqual([]);
    expect(result.current.item.cuisines).toEqual([]);
    expect(result.current.item.kitchenware).toEqual([]);
    expect(result.current.item.allergies).toEqual([]);
    expect(result.current.item.dislikes).toEqual([]);
    expect(result.current.item.cookingpref).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and populate preferences from firestore subcollection', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockDocs = Object.entries(mockPreferencesData).map(([key, items]) => ({
        id: key,
        data: () => ({ items }),
      }));

      const mockSnapshot = {
        forEach: (callback: any) => {
          mockDocs.forEach(callback);
        },
      };
      
      onSuccess(mockSnapshot);
      return jest.fn(); 
    });

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.item.allergies).toEqual(['Soy', 'Peanuts', 'Honeydew']);
    expect(result.current.item.dislikes).toEqual(['Mushrooms', 'Olives']);
    expect(result.current.item.dietary).toEqual(['Vegetarian', 'Gluten-Free']);
    expect(result.current.item.cuisines).toEqual(['Italian', 'Mexican']);
    expect(result.current.item.kitchenware).toEqual(['Air Fryer', 'Instant Pot']);
    expect(result.current.item.cookingpref).toEqual(['Quick Meals', '30 Minutes']);
    expect(result.current.error).toBeNull();
  });

  it('should handle partial preferences (some categories empty)', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    const partialData = {
      allergies: ['Soy'],
      dietary: ['Vegan'],
      cookingpref: ['Quick Meals'],
    };

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockDocs = Object.entries(partialData).map(([key, items]) => ({
        id: key,
        data: () => ({ items }),
      }));

      const mockSnapshot = {
        forEach: (callback: any) => {
          mockDocs.forEach(callback);
        },
      };
      
      onSuccess(mockSnapshot);
      return jest.fn();
    });

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.item.allergies).toEqual(['Soy']);
    expect(result.current.item.dislikes).toEqual([]);
    expect(result.current.item.dietary).toEqual(['Vegan']);
    expect(result.current.item.cuisines).toEqual([]);
  });

  it('should handle Firestore errors gracefully', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    const mockError = new Error('Failed to fetch preferences');
    
    mockOnSnapshot.mockImplementation((onSuccess, onError) => {
      onError(mockError);
      return jest.fn();
    });

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Failed to fetch preferences');
  });

  it('should test the refresh function with subcollection structure', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockSnapshot = { forEach: jest.fn() };
      onSuccess(mockSnapshot);
      return jest.fn();
    });

    const mockGetResults = Object.entries(mockPreferencesData).map(([key, items]) => ({
      id: key,
      data: () => ({ items }),
    }));
    
    mockGet.mockResolvedValue(mockGetResults[0]); 

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    
    await result.current.refresh();
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalled();
    });
  });

  it('should verify correct firestore path structure', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    mockOnSnapshot.mockImplementation((onSuccess) => {
      const mockSnapshot = { forEach: jest.fn() };
      onSuccess(mockSnapshot);
      return jest.fn();
    });

    renderHook(() => usePreferences());

    await waitFor(() => {
      expect(mockCollection).toHaveBeenCalledWith('Users');
      expect(mockDoc).toHaveBeenCalledWith('test-user-123');
      expect(mockCollection).toHaveBeenCalledWith('preferences');
    });
  });
});
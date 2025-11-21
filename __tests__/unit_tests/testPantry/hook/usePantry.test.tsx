import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../../../app/context/AuthContext';
import { usePantry } from '../../../../hooks/usePantry';

jest.mock('../../../../app/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockOnSnapshot = jest.fn();
const mockGet = jest.fn();

const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    onSnapshot: mockOnSnapshot,
    get: mockGet,
};


jest.mock('@react-native-firebase/firestore', () => {
    const fire = () => mockFirestore;
    fire.FieldValue = { serverTimestamp: jest.fn() }; // for services
    return { __esModule: true, default: fire };
});

describe('usePantry hook', () => {
    const mockUser = { uid: 'test-user-123' };

    const pantryDocuments = [
        {
            fireId: 'pantry-doc-1',
            data: () => ({
                addedAt: 'November 7, 2025 at 12:19:50 PM UTC-6',
                category: ['fruit'],
                expiresAt: null,
                name: 'apple',
                quantity: 4,
            }),
        },
        {
            fireId: 'pantry-doc-2',
            data: () => ({
                addedAt: 'November 7, 2025 at 12:19:50 PM UTC-6',
                category: ['fruit', 'freezer'],
                expiresAt: null,
                name: 'banana',
                quantity: 8,
            }),
        },
        {
            fireId: 'pantry-doc-3',
            data: () => ({
                addedAt: 'November 7, 2025 at 12:19:50 PM UTC-6',
                category: ['freezer'],
                expiresAt: null,
                name: 'strawberry shortcake icecream bar',
                quantity: 5,
            }),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be able to fetch an empty pantry', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapShot = {
                forEach: jest.fn(),
            };
            onSuccess(mockSnapShot);
            return jest.fn();
        });

        const { result } = renderHook(() => usePantry());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.pantry.length).toEqual(0);
        expect(result.current.error).toBeNull();
    });

    it('should be able to fetch pantry items', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                docs: pantryDocuments,
                forEach: (field: any) => pantryDocuments.forEach(field),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => usePantry());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 3000 });

        expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
        expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
        expect(mockFirestore.collection).toHaveBeenCalledWith('pantry');

        expect(result.current.pantry).toHaveLength(3);
        expect(result.current.pantry[0].name).toBe('apple');
        expect(result.current.pantry[1].name).toBe('banana');
        expect(result.current.pantry[2].name).toBe('strawberry shortcake icecream bar');
        expect(result.current.error).toBeNull();
    });

    it('should be able to refresh when refresh() has been called', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { docs: [], forEach: (field: any) => {} };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        mockGet.mockResolvedValue({
            docs: pantryDocuments,
            forEach: (field: any) => pantryDocuments.forEach(field),
        });

        const { result } = renderHook(() => usePantry());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.pantry).toHaveLength(0);

        await result.current.refresh();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalled();
        });
    });

    it('should be able handle errors during pantry fetching', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        const mockError = new Error("unable to fetch pantry");
        mockOnSnapshot.mockImplementation((onSuccess, onError) => {
            onError(mockError);
            return jest.fn();
        });

        const { result } = renderHook(() => usePantry());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe("unable to fetch pantry");
    });

    it('should verify correct firestore path structure', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { forEach: jest.fn() };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        renderHook(() => usePantry());

        await waitFor(() => {
            expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
            expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
            expect(mockFirestore.collection).toHaveBeenCalledWith('pantry');
        });
    });
});
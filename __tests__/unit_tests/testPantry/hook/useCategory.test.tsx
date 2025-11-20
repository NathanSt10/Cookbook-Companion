import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../../../app/context/AuthContext';
import { useCategory } from '../../../../hooks/useCategory';

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
    fire.FieldValue = { serverTimestamp: jest.fn() }; //for services
    return { __esModule: true, default: fire};
});

describe('useCategory hook', () => {
    const mockUser = { uid: 'test-user-123'};

    const categoriesDocuments = [
        {
            fireId: 'categories-doc-1',
            data: () => ({
                name: 'Fruits',
                addedAt: 'November 7, 2025 at 12:19:50 PM UTC-6'
            }),
        },
        {
            fireId: 'categories-doc-2',
            data: () => ({
                name: 'Meats',
                addedAt: 'November 7, 2025 at 12:19:50 PM UTC-6'
            }),
        },
        {
            fireId: 'categories-doc-1',
            data: () => ({
                name: 'Frozen',
                addedAt: 'November 7, 2025 at 12:19:50 PM UTC-6'
            }),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be able to fetch an empty category collection successfully', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                forEach: jest.fn(),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => useCategory());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.categories.length).toEqual(0);
        expect(result.current.error).toBeNull();
    });
    
    it('should be able to fetch categories successfully', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                docs: categoriesDocuments,
                forEach: (field: any) => categoriesDocuments.forEach(field),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => useCategory());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 3000 });

        expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
        expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
        expect(mockFirestore.collection).toHaveBeenCalledWith('categories');

        expect(result.current.categories).toHaveLength(3);
        expect(result.current.categories[0].name).toBe('Fruits');
        expect(result.current.categories[1].name).toBe('Meats');
        expect(result.current.categories[2].name).toBe('Frozen');
        expect(result.current.error).toBeNull();
    });

    it('should be able to refresh successfully', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { docs: [], forEach: (field: any) => {} };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        mockGet.mockResolvedValue({
            docs: categoriesDocuments,
            forEach: (field: any) => categoriesDocuments.forEach(field),
        });

        const { result } = renderHook(() => useCategory());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.categories).toHaveLength(0);

        await result.current.refresh();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalled();
        });
    });

    it('should be able to handle errors during pantry fetching', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        const mockError = new Error("unable to fetch categories");
        mockOnSnapshot.mockImplementation((onSuccess, onError) => {
            onError(mockError);
            return jest.fn();
        });

        const { result } = renderHook(() => useCategory());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe("unable to fetch categories");
    });

    it('should verify correct firestore path structure', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { forEach: jest.fn() };
            onSuccess(mockSnapshot);
            return jest.fn();
        })

        renderHook(() => useCategory());

        await waitFor(() => {
            expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
            expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
            expect(mockFirestore.collection).toHaveBeenCalledWith('categories');
        });
    });
})
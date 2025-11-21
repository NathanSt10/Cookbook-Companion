import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../../../app/context/AuthContext';
import { useLikedRecipes } from '../../../../hooks/useLikedRecipes';

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
    fire.FieldValue = { serverTimestamp: jest.fn() }; //f or services
    return { __esModule: true, default: fire};
});

describe('useLikedRecipes hook', () => {
    const mockUser = { uid: 'test-user-123'};

    const likedRecipesDocument = [
        {
            fireId: 'likedRecipes-doc-1',
            data: () => ({
                recipeId: 716429,
                title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
                image: "https://img.spoonacular.com/recipes/716429-312x231.jpg",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
        {
            fireId: 'likedRecipes-doc-2',
            data: () => ({
                recipeId: 715538,
                title: "Bruschetta Style Pork & Pasta",
                image: "https://img.spoonacular.com/recipes/715538-312x231.jpg",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
        {
            fireId: 'likedRecipes-doc-3',
            data: () => ({
                recipeId: 711538,
                title: "Sirloin Steak",
                image: "https://img.spoonacular.com/recipes/711538-312x231.jpg",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be able to fetch an empty liked recipe collection successfully', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                forEach: jest.fn(),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => useLikedRecipes());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.likedRecipes.length).toEqual(0);
        expect(result.current.error).toBeNull();
    });
    
    it('should be able to fetch liked recipes successfully', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                docs: likedRecipesDocument,
                forEach: (field: any) => likedRecipesDocument.forEach(field),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => useLikedRecipes());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 3000 });

        expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
        expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
        expect(mockFirestore.collection).toHaveBeenCalledWith('likedRecipes');

        expect(result.current.likedRecipes).toHaveLength(3);
        expect(result.current.likedRecipes[0].title).toBe('Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs');
        expect(result.current.likedRecipes[1].title).toBe('Bruschetta Style Pork & Pasta');
        expect(result.current.likedRecipes[2].title).toBe('Sirloin Steak');
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
            docs: likedRecipesDocument,
            forEach: (field: any) => likedRecipesDocument.forEach(field),
        });

        const { result } = renderHook(() => useLikedRecipes());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.likedRecipes).toHaveLength(0);

        await result.current.refresh();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalled();
        });
    });

    it('should be able to handle errors during liked recipes fetching', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        const mockError = new Error("unable to fetch liked recipes");
        mockOnSnapshot.mockImplementation((onSuccess, onError) => {
            onError(mockError);
            return jest.fn();
        });

        const { result } = renderHook(() => useLikedRecipes());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe("unable to fetch liked recipes");
    });

    it('should verify correct firestore path structure', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { forEach: jest.fn() };
            onSuccess(mockSnapshot);
            return jest.fn();
        })

        renderHook(() => useLikedRecipes());

        await waitFor(() => {
            expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
            expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
            expect(mockFirestore.collection).toHaveBeenCalledWith('likedRecipes');
        });
    });
})
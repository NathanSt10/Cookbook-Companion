import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../../../app/context/AuthContext';
import { usePlannedMeals } from '../../../../hooks/usePlannedMeals';

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

describe('usePlannedMeals hook', () => {
    const mockUser = { uid: 'test-user-123' };

    const plannedMealsDocuments = [
        {
            fireId: 'plannedMeals-doc-1',
            data: () => ({
                recipeId: 12345,
                title: "Apple Pie",
                image: "picture_of_apple_pie",
                date: "2025-11-09",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
        {
            fireId: 'plannedMeals-doc-2',
            data: () => ({
                recipeId: 12346,
                title: "Buttermilk Pancakes",
                image: "picture_of_buttermilk_pancakes",
                date: "2025-11-09",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
        {
            fireId: 'plannedMeals-doc-3',
            data: () => ({
                recipeId: 12347,
                title: "Steak with Mashed Potatoes",
                image: "picture_of_steak_with_mashed_potatoes",
                date: "2025-11-09",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
        {
            fireId: 'plannedMeals-doc-4',
            data: () => ({
                recipeId: 12348,
                title: "Orange Marmalade Sandwich",
                image: "picture_of_orange_marmalade_sandwich",
                date: "2025-11-10",
                addedAt: "November 7, 2025 at 12:19:50 PM UTC-6",
            }),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be able to fetch an empty planned meal', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapShot = {
                forEach: jest.fn(),
            };
            onSuccess(mockSnapShot);
            return jest.fn();
        });

        const { result } = renderHook(() => usePlannedMeals());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(Object.keys(result.current.plannedMeals).length).toEqual(0);
        expect(result.current.error).toBeNull();
    });

    it('should be able to fetch planned meal items', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                docs: plannedMealsDocuments,
                forEach: (callback: any) => plannedMealsDocuments.forEach(callback),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => usePlannedMeals());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        }, { timeout: 3000 });

        expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
        expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
        expect(mockFirestore.collection).toHaveBeenCalledWith('plannedMeals');

        const nov9Meals = result.current.plannedMeals["2025-11-09"];
        const nov10Meals = result.current.plannedMeals["2025-11-10"];

        expect(nov9Meals).toHaveLength(3);
        expect(nov10Meals).toHaveLength(1);

        expect(nov9Meals[0].recipeId).toBe(12345);
        expect(nov9Meals[0].title).toBe("Apple Pie");
        expect(nov9Meals[1].recipeId).toBe(12346);
        expect(nov9Meals[1].title).toBe("Buttermilk Pancakes");
        expect(nov9Meals[2].recipeId).toBe(12347);
        expect(nov9Meals[2].title).toBe("Steak with Mashed Potatoes");

        expect(nov10Meals[0].recipeId).toBe(12348);
        expect(nov10Meals[0].title).toBe("Orange Marmalade Sandwich");

        expect(result.current.error).toBeNull();
    });

    it('should be able to refresh when refresh() has been called', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { docs: [], forEach: (callback: any) => {} };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        mockGet.mockResolvedValue({
            docs: plannedMealsDocuments,
            forEach: (callback: any) => plannedMealsDocuments.forEach(callback),
        });

        const { result } = renderHook(() => usePlannedMeals());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(Object.keys(result.current.plannedMeals).length).toBe(0);

        await result.current.refresh();
        await waitFor(() => {
            expect(mockGet).toHaveBeenCalled();
            expect(Object.keys(result.current.plannedMeals).length).toBeGreaterThan(0);
        });
    });

    it('should be able handle errors during planned meals fetching', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        const mockError = new Error("unable to fetch planned meals");
        mockOnSnapshot.mockImplementation((onSuccess, onError) => {
            onError(mockError);
            return jest.fn();
        });

        const { result } = renderHook(() => usePlannedMeals());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe("unable to fetch planned meals");
    });

    it('should verify correct firestore path structure', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = { forEach: jest.fn() };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        renderHook(() => usePlannedMeals());

        await waitFor(() => {
            expect(mockFirestore.collection).toHaveBeenCalledWith('Users');
            expect(mockFirestore.doc).toHaveBeenCalledWith('test-user-123');
            expect(mockFirestore.collection).toHaveBeenCalledWith('plannedMeals');
        });
    });

    it('should group meals by date correctly', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        mockOnSnapshot.mockImplementation((onSuccess) => {
            const mockSnapshot = {
                docs: plannedMealsDocuments,
                forEach: (callback: any) => plannedMealsDocuments.forEach(callback),
            };
            onSuccess(mockSnapshot);
            return jest.fn();
        });

        const { result } = renderHook(() => usePlannedMeals());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const dates = Object.keys(result.current.plannedMeals);
        expect(dates).toContain("2025-11-09");
        expect(dates).toContain("2025-11-10");
        expect(dates.length).toBe(2);
    })
});
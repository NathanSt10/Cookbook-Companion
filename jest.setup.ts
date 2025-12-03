import '@testing-library/jest-native/extend-expect';

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  };

  return {
    __esModule: true,
    default: () => mockAuth,
    getAuth: jest.fn(() => mockAuth),
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
    signOut: jest.fn(() => Promise.resolve()),
  };
});

// Mock Firebase Firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: false, data: () => ({}) })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        onSnapshot: jest.fn((callback) => {
          // Call callback with mock data
          callback({
            exists: true,
            data: () => ({
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
            }),
            id: 'mock-doc-id',
          });
          // Return unsubscribe function
          return jest.fn();
        }),
        // Add support for nested collections (doc -> collection)
        collection: jest.fn(() => ({
          onSnapshot: jest.fn((callback) => {
            // Call callback with empty preferences
            callback({
              docs: [],
              size: 0,
              empty: true,
              forEach: jest.fn(),
            });
            return jest.fn();
          }),
          doc: jest.fn(() => ({
            get: jest.fn(() => Promise.resolve({ exists: false, data: () => ({}) })),
            set: jest.fn(() => Promise.resolve()),
            update: jest.fn(() => Promise.resolve()),
          })),
          batch: jest.fn(() => ({
            set: jest.fn(),
            update: jest.fn(), 
            commit: jest.fn(() => Promise.resolve()),
          })),
        })),
      })),
    })),
  });

  mockFirestore.FieldValue = {
    serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
    arrayUnion: jest.fn((...items) => ({ _methodName: 'arrayUnion', _elements: items })),
    arrayRemove: jest.fn((...items) => ({ _methodName: 'arrayRemove', _elements: items })),
  };

  return {
    __esModule: true,
    default: mockFirestore,
  };
});

// Mock Expo Router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  Link: 'Link',
  SplashScreen: {
    hideAsync: jest.fn(() => Promise.resolve()),
    preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  useRoute: jest.fn(() => ({ params: {} })),
}));

// Silence console
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
// The unused 'React' import will be removed.

// Mock react-router-dom
const mockHistoryPush = jest.fn();
const mockHistory = {
    push: mockHistoryPush,
    replace: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    listen: jest.fn(),
    location: {
        pathname: '/',
        search: '',
        hash: '',
        state: null
    }
};

const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockHistoryPush,
    useLocation: () => mockHistory.location,
    useParams: () => mockUseParams(),
    useHistory: () => mockHistory
}));

export { mockHistory, mockHistoryPush, mockUseParams }; 
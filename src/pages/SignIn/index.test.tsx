import { mockHistoryPush, renderWithProviders } from '../../test-utils';
import { screen } from '@testing-library/react';
import SignIn from './index';

// Mock SignInForm component
jest.mock('../../components/Forms/SignInForm', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="sign-in-form">Sign In Form</div>
    };
});

describe('SignIn', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHistoryPush.mockClear();
        localStorage.clear();
    });

    it('renders the sign in page with form', () => {
        renderWithProviders(<SignIn />);
        
        expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    });
});

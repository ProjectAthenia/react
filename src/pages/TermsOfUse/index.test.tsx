import { render } from '@testing-library/react';
import TermsOfUse from './index';

test('renders without crashing', () => {
    const { baseElement } = render(<TermsOfUse />);
    expect(baseElement).toBeDefined();
});

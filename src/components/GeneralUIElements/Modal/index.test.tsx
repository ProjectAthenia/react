import { render, screen, fireEvent } from '@testing-library/react';
import GameMuseumModal from './index';

describe('GameMuseumModal', () => {
  const mockOnRequestClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when isOpen is false', () => {
    const { container } = render(
      <GameMuseumModal isOpen={false} onRequestClose={mockOnRequestClose}>
        <div>Modal Content</div>
      </GameMuseumModal>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders modal content when isOpen is true', () => {
    render(
      <GameMuseumModal isOpen={true} onRequestClose={mockOnRequestClose}>
        <div data-testid="modal-child-content">Modal Content</div>
      </GameMuseumModal>
    );
    
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('modal-child-content')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(
      <GameMuseumModal 
        isOpen={true} 
        onRequestClose={mockOnRequestClose}
        title="Test Modal Title"
      >
        <div>Modal Content</div>
      </GameMuseumModal>
    );
    
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
  });

  test('does not render title when not provided', () => {
    render(
      <GameMuseumModal isOpen={true} onRequestClose={mockOnRequestClose}>
        <div>Modal Content</div>
      </GameMuseumModal>
    );
    
    const modalTitle = screen.queryByRole('heading', { level: 2 });
    expect(modalTitle).not.toBeInTheDocument();
  });

  test('calls onRequestClose when close button is clicked', () => {
    render(
      <GameMuseumModal isOpen={true} onRequestClose={mockOnRequestClose}>
        <div>Modal Content</div>
      </GameMuseumModal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    
    expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
  });

  test('calls onRequestClose when overlay is clicked', () => {
    render(
      <GameMuseumModal isOpen={true} onRequestClose={mockOnRequestClose}>
        <div>Modal Content</div>
      </GameMuseumModal>
    );
    
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onRequestClose when modal content is clicked', () => {
    render(
      <GameMuseumModal isOpen={true} onRequestClose={mockOnRequestClose}>
        <div data-testid="modal-child-content">Modal Content</div>
      </GameMuseumModal>
    );
    
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    
    expect(mockOnRequestClose).not.toHaveBeenCalled();
  });

  test('applies custom className when provided', () => {
    render(
      <GameMuseumModal 
        isOpen={true} 
        onRequestClose={mockOnRequestClose}
        className="custom-modal-class"
      >
        <div>Modal Content</div>
      </GameMuseumModal>
    );
    
    const modalContent = screen.getByTestId('modal-content');
    expect(modalContent).toHaveClass('custom-modal-class');
  });
}); 
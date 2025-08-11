import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NeighborList from './NeighborList';

describe('NeighborList', () => {
  const mockNeighbors = [
    {
      cca3: 'CAN',
      name: { common: 'Canada' },
      flags: { svg: 'https://flagcdn.com/ca.svg' }
    },
    {
      cca3: 'MEX',
      name: { common: 'Mexico' },
      flags: { svg: 'https://flagcdn.com/mx.svg' }
    }
  ];

  const mockOnNeighborClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders neighbor list when neighbors are provided', () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    expect(screen.getByText('Neighboring Countries:')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
  });

  test('renders "None" when no neighbors', () => {
    render(<NeighborList neighbors={[]} onNeighborClick={mockOnNeighborClick} />);
    
    expect(screen.getByText('Neighboring Countries:')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  test('renders neighbor buttons with correct content', () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    const canadaButton = screen.getByRole('button', { name: /canada/i });
    const mexicoButton = screen.getByRole('button', { name: /mexico/i });
    
    expect(canadaButton).toBeInTheDocument();
    expect(mexicoButton).toBeInTheDocument();
  });

  test('renders neighbor flags with correct attributes', () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    const canadaFlag = screen.getByAltText('Canada flag');
    const mexicoFlag = screen.getByAltText('Mexico flag');
    
    expect(canadaFlag).toHaveAttribute('src', 'https://flagcdn.com/ca.svg');
    expect(canadaFlag).toHaveAttribute('alt', 'Canada flag');
    expect(mexicoFlag).toHaveAttribute('src', 'https://flagcdn.com/mx.svg');
    expect(mexicoFlag).toHaveAttribute('alt', 'Mexico flag');
  });

  test('calls onNeighborClick when neighbor button is clicked', async () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    const canadaButton = screen.getByRole('button', { name: /canada/i });
    await userEvent.click(canadaButton);
    
    expect(mockOnNeighborClick).toHaveBeenCalledWith('CAN');
  });

  test('calls onNeighborClick with correct cca3 for different neighbors', async () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    const mexicoButton = screen.getByRole('button', { name: /mexico/i });
    await userEvent.click(mexicoButton);
    
    expect(mockOnNeighborClick).toHaveBeenCalledWith('MEX');
  });

  test('handles neighbor without flags', () => {
    const neighborsWithoutFlags = [
      {
        cca3: 'CAN',
        name: { common: 'Canada' },
        flags: null
      }
    ];
    
    render(<NeighborList neighbors={neighborsWithoutFlags} onNeighborClick={mockOnNeighborClick} />);
    
    // Should still render the neighbor button, just without flag image
    expect(screen.getByText('Canada')).toBeInTheDocument();
    
    // The img element should exist but have no src attribute
    const flagImage = screen.getByAltText('Canada flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('handles neighbor with undefined flags', () => {
    const neighborsWithUndefinedFlags = [
      {
        cca3: 'CAN',
        name: { common: 'Canada' },
        flags: undefined
      }
    ];
    
    render(<NeighborList neighbors={neighborsWithUndefinedFlags} onNeighborClick={mockOnNeighborClick} />);
    
    // Should still render the neighbor button, just without flag image
    expect(screen.getByText('Canada')).toBeInTheDocument();
    
    // The img element should exist but have no src attribute
    const flagImage = screen.getByAltText('Canada flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('handles neighbor with empty flags object', () => {
    const neighborsWithEmptyFlags = [
      {
        cca3: 'CAN',
        name: { common: 'Canada' },
        flags: {}
      }
    ];
    
    render(<NeighborList neighbors={neighborsWithEmptyFlags} onNeighborClick={mockOnNeighborClick} />);
    
    // Should still render the neighbor button, just without flag image
    expect(screen.getByText('Canada')).toBeInTheDocument();
    
    // The img element should exist but have no src attribute
    const flagImage = screen.getByAltText('Canada flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('has correct CSS classes', () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    const container = screen.getByText('Neighboring Countries:').closest('div');
    expect(container).toHaveClass('countryDetailNeighbors');
    
    const neighborList = container.querySelector('.neighborList');
    expect(neighborList).toBeInTheDocument();
    
    const neighborButtons = screen.getAllByRole('button');
    neighborButtons.forEach(button => {
      expect(button).toHaveClass('neighborPill');
    });
  });

  test('flag images have correct styling', () => {
    render(<NeighborList neighbors={mockNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    const canadaFlag = screen.getByAltText('Canada flag');
    
    expect(canadaFlag).toHaveStyle({
      width: '28px',
      height: '18px',
      objectFit: 'cover',
      marginRight: '0.7em',
      borderRadius: '4px'
    });
  });

  test('renders multiple neighbors correctly', () => {
    const manyNeighbors = [
      { cca3: 'CAN', name: { common: 'Canada' }, flags: { svg: 'https://flagcdn.com/ca.svg' } },
      { cca3: 'MEX', name: { common: 'Mexico' }, flags: { svg: 'https://flagcdn.com/mx.svg' } },
      { cca3: 'BRA', name: { common: 'Brazil' }, flags: { svg: 'https://flagcdn.com/br.svg' } }
    ];
    
    render(<NeighborList neighbors={manyNeighbors} onNeighborClick={mockOnNeighborClick} />);
    
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  test('is memoized with React.memo', () => {
    // This test verifies that the component is wrapped with React.memo
    // by checking if the displayName includes 'memo' or if it's the memoized version
    expect(NeighborList.$$typeof).toBe(Symbol.for('react.memo'));
  });
});

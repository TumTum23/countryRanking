import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSidebar from './FilterSidebar';
import { SORT_OPTIONS, REGIONS } from '../../utils/constants';

describe('FilterSidebar', () => {
  const defaultProps = {
    sortBy: 'population',
    onSortChange: jest.fn(),
    selectedRegions: ['Americas', 'Europe'],
    onRegionToggle: jest.fn(),
    filterUN: false,
    onFilterUNChange: jest.fn(),
    filterIndependent: true,
    onFilterIndependentChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sort dropdown with correct options', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const sortLabel = screen.getByText('Sort by:');
    expect(sortLabel).toBeInTheDocument();
    
    const sortSelect = screen.getByDisplayValue('Population');
    expect(sortSelect).toBeInTheDocument();
    
    // Check all sort options are present
    SORT_OPTIONS.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('renders region filter buttons', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const regionLabel = screen.getByText('Region:');
    expect(regionLabel).toBeInTheDocument();
    
    // Check all regions are present
    REGIONS.forEach(region => {
      const regionButton = screen.getByRole('button', { name: region });
      expect(regionButton).toBeInTheDocument();
    });
  });

  test('renders status filter checkboxes', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const statusLabel = screen.getByText('Status:');
    expect(statusLabel).toBeInTheDocument();
    
    const unCheckbox = screen.getByRole('checkbox', { name: /member of the united nations/i });
    expect(unCheckbox).toBeInTheDocument();
    expect(unCheckbox).not.toBeChecked();
    
    const independentCheckbox = screen.getByRole('checkbox', { name: /independent/i });
    expect(independentCheckbox).toBeInTheDocument();
    expect(independentCheckbox).toBeChecked();
  });

  test('calls onSortChange when sort selection changes', async () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const sortSelect = screen.getByDisplayValue('Population');
    await userEvent.selectOptions(sortSelect, 'name');
    
    expect(defaultProps.onSortChange).toHaveBeenCalled();
  });

  test('calls onRegionToggle when region button is clicked', async () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const asiaButton = screen.getByRole('button', { name: 'Asia' });
    await userEvent.click(asiaButton);
    
    expect(defaultProps.onRegionToggle).toHaveBeenCalledWith('Asia');
  });

  test('calls onFilterUNChange when UN checkbox is clicked', async () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const unCheckbox = screen.getByRole('checkbox', { name: /member of the united nations/i });
    await userEvent.click(unCheckbox);
    
    expect(defaultProps.onFilterUNChange).toHaveBeenCalled();
  });

  test('calls onFilterIndependentChange when independent checkbox is clicked', async () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const independentCheckbox = screen.getByRole('checkbox', { name: /independent/i });
    await userEvent.click(independentCheckbox);
    
    expect(defaultProps.onFilterIndependentChange).toHaveBeenCalled();
  });

  test('applies selected class to selected regions', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    // Americas should be selected
    const americasButton = screen.getByRole('button', { name: 'Americas' });
    expect(americasButton).toHaveClass('selected');
    
    // Asia should not be selected
    const asiaButton = screen.getByRole('button', { name: 'Asia' });
    expect(asiaButton).not.toHaveClass('selected');
  });

  test('displays correct sort value', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const sortSelect = screen.getByDisplayValue('Population');
    expect(sortSelect.value).toBe('population');
  });

  test('has correct HTML structure', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const sidebarControls = screen.getByText('Sort by:').closest('.sidebarControls');
    expect(sidebarControls).toHaveClass('sidebarControls');
    
    const sidebarControlsList = sidebarControls.querySelectorAll('.sidebarControl');
    expect(sidebarControlsList).toHaveLength(3);
  });

  test('renders custom select arrow', () => {
    render(<FilterSidebar {...defaultProps} />);
    
    const customArrow = document.querySelector('.customSelectArrow');
    expect(customArrow).toBeInTheDocument();
  });

  test('handles empty selected regions', () => {
    const propsWithNoRegions = {
      ...defaultProps,
      selectedRegions: [],
    };
    
    render(<FilterSidebar {...propsWithNoRegions} />);
    
    // All region buttons should not have selected class
    REGIONS.forEach(region => {
      const regionButton = screen.getByRole('button', { name: region });
      expect(regionButton).not.toHaveClass('selected');
    });
  });
});

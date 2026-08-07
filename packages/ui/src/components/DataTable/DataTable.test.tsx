import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DataTable, Column } from './DataTable';
import '@testing-library/jest-dom';

describe('DataTable', () => {
  type TestData = { id: string; name: string; age: number };
  
  const mockColumns: Column<TestData>[] = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' }
  ];
  
  const mockData: TestData[] = [
    { id: '1', name: 'John Doe', age: 30 },
    { id: '2', name: 'Jane Smith', age: 25 }
  ];

  it('renders correctly with given data', () => {
    render(<DataTable columns={mockColumns} data={mockData} keyField="id" />);
    expect(React.isValidElement(<DataTable columns={mockColumns} data={mockData} keyField="id" />)).toBeTruthy();
    
    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Jane Smith')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Age')).toBeTruthy();
  });

  it('hides columns based on hiddenColumns prop', () => {
    render(<DataTable columns={mockColumns} data={mockData} keyField="id" hiddenColumns={['age']} />);
    
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.queryByText('Age')).toBeNull();
    expect(screen.queryByText('30')).toBeNull();
  });
});

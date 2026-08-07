import { render, screen } from '@testing-library/react';
import { Buttons } from './Buttons';
import { expect, test, describe } from 'vitest';

describe('Buttons Component', () => {
  test('renders button with correct text', () => {
    render(<Buttons>Submit</Buttons>);
    expect(screen.getByText('Submit')).toBeDefined();
  });
});


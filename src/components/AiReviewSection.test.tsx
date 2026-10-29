import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AiReviewSection from './AiReviewSection';

describe('AiReviewSection Component', () => {
  it('renders the header and description text correctly', () => {
    render(<AiReviewSection />);

    expect(screen.getByRole('heading', { level: 2, name: /AI Project Review/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Describe your project and get feedback before submitting/i)
    ).toBeInTheDocument();
  });

  it('renders the submit button with default label', () => {
    render(<AiReviewSection />);

    expect(screen.getByRole('button', { name: /Review My Project/i })).toBeInTheDocument();
  });
});
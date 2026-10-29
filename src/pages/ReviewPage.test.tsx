import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReviewPage from './ReviewPage';

function renderReviewPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <ReviewPage />
    </QueryClientProvider>
  );
}

describe('ReviewPage Form', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows error message and does NOT call fetch when prompt is shorter than 20 characters', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();

    renderReviewPage();

    const textarea = screen.getByLabelText(/Project description/i);
    await user.type(textarea, 'Too short');

    const submitBtn = screen.getByRole('button', { name: /Review my project/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText(/Describe your project in at least 20 characters/i)
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
import { useState, useCallback } from 'react';

type Page = 'landing' | 'login' | 'register' | 'home' | 'bible' | 'music' | 'my-library' | 'playlists' | 'premium' | 'profile' | 'account' | 'success' | 'help';

let currentPage: Page = 'landing';
const listeners: Set<(page: Page) => void> = new Set();

export function useNavigate() {
  const [, setPage] = useState(currentPage);

  const navigate = useCallback((page: Page) => {
    currentPage = page;
    listeners.forEach((listener) => listener(page));
  }, []);

  useState(() => {
    const listener = (page: Page) => setPage(page);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  });

  return navigate;
}

export function useCurrentPage() {
  const [page, setPage] = useState(currentPage);

  useState(() => {
    const listener = (newPage: Page) => setPage(newPage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  });

  return page;
}

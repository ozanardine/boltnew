import { useEffect, useCallback } from 'react';
import { useKey } from 'react-use';

export function useKeyboardNavigation({
  messages,
  selectedIndex,
  setSelectedIndex,
  onCopy,
  onFavorite,
  onEdit,
  onDelete,
  onArchive,
  onShare
}) {
  // Navegação básica
  const handleKeyNavigation = useCallback((e) => {
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, messages.length - 1));
    }
    if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }
  }, [messages.length, setSelectedIndex]);

  // Ações com teclas
  useKey('c', (e) => {
    if (e.ctrlKey && selectedIndex !== -1) {
      e.preventDefault();
      onCopy(messages[selectedIndex]);
    }
  });

  useKey('f', (e) => {
    if (e.ctrlKey && selectedIndex !== -1) {
      e.preventDefault();
      onFavorite(messages[selectedIndex].id);
    }
  });

  useKey('e', (e) => {
    if (e.ctrlKey && selectedIndex !== -1) {
      e.preventDefault();
      onEdit(messages[selectedIndex]);
    }
  });

  useKey('Delete', (e) => {
    if (selectedIndex !== -1) {
      e.preventDefault();
      onDelete(messages[selectedIndex].id);
    }
  });

  useKey('a', (e) => {
    if (e.ctrlKey && selectedIndex !== -1) {
      e.preventDefault();
      onArchive(messages[selectedIndex].id);
    }
  });

  useKey('s', (e) => {
    if (e.ctrlKey && selectedIndex !== -1) {
      e.preventDefault();
      onShare(messages[selectedIndex].id);
    }
  });

  // Adicionar event listener para navegação
  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  return {
    selectedIndex
  };
}
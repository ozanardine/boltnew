import React, { createContext, useContext, useState, useEffect } from 'react';
import styles from '../../styles/SharedMessages.module.css';

const AccessibilityContext = createContext({
  announceMessage: () => {},
  focusMode: false,
  toggleFocusMode: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
});

export function AccessibilityProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const announceMessage = (message) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const toggleFocusMode = () => setFocusMode(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);

  // Aplicar classes CSS com base nos estados
  useEffect(() => {
    const root = document.getElementById('__next');
    if (root) {
      if (focusMode) {
        root.classList.add(styles.focusMode);
      } else {
        root.classList.remove(styles.focusMode);
      }

      if (highContrast) {
        root.classList.add(styles.highContrast);
      } else {
        root.classList.remove(styles.highContrast);
      }
    }
  }, [focusMode, highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        announceMessage,
        focusMode,
        toggleFocusMode,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
      <div
        role="status"
        aria-live="polite"
        className={styles.srOnly}
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
import { motion } from 'framer-motion';
import { FaEye, FaAdjust, FaKeyboard } from 'react-icons/fa';
import { useAccessibility } from './AccessibilityProvider';
import styles from '../../styles/SharedMessages.module.css';

export default function AccessibilityControls() {
  const {
    focusMode,
    toggleFocusMode,
    highContrast,
    toggleHighContrast,
  } = useAccessibility();

  return (
    <motion.div
      className={styles.accessibilityControls}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleFocusMode}
        className={`${styles.accessibilityButton} ${focusMode ? styles.active : ''}`}
        aria-label="Alternar modo foco"
        title="Modo foco"
      >
        <FaEye />
      </button>

      <button
        onClick={toggleHighContrast}
        className={`${styles.accessibilityButton} ${highContrast ? styles.active : ''}`}
        aria-label="Alternar alto contraste"
        title="Alto contraste"
      >
        <FaAdjust />
      </button>

      <button
        onClick={() => {
          // Abrir modal com atalhos de teclado
        }}
        className={styles.accessibilityButton}
        aria-label="Mostrar atalhos de teclado"
        title="Atalhos de teclado"
      >
        <FaKeyboard />
      </button>
    </motion.div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArchive, FaFolder, FaShare } from 'react-icons/fa';
import styles from '../../styles/SharedMessages.module.css';

export default function MessageOrganizer({ 
  message, 
  folders, 
  onMove, 
  onArchive, 
  onShare 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMove = (folderId) => {
    onMove(message.id, folderId);
    setIsOpen(false);
  };

  const handleArchive = () => {
    onArchive(message.id);
    setIsOpen(false);
  };

  const handleShare = () => {
    onShare(message.id);
    setIsOpen(false);
  };

  return (
    <div className={styles.organizer}>
      <motion.button
        className={styles.organizerButton}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaFolder />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.organizerMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={styles.organizerHeader}>
              <h4>Organizar Mensagem</h4>
            </div>

            <div className={styles.organizerContent}>
              <div className={styles.folderList}>
                <h5>Mover para pasta:</h5>
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => handleMove(folder.id)}
                    className={styles.folderOption}
                  >
                    <FaFolder /> {folder.name}
                  </button>
                ))}
              </div>

              <div className={styles.organizerActions}>
                <button
                  onClick={handleArchive}
                  className={styles.archiveButton}
                >
                  <FaArchive /> Arquivar
                </button>

                <button
                  onClick={handleShare}
                  className={styles.shareButton}
                >
                  <FaShare /> Compartilhar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFolder, FaFolderPlus, FaEdit, FaTrash } from 'react-icons/fa';
import styles from '../../styles/SharedMessages.module.css';

export default function FolderManager({ folders, onCreateFolder, onEditFolder, onDeleteFolder, onSelectFolder }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const handleEditFolder = (folder) => {
    if (editingFolder?.id === folder.id && newFolderName.trim()) {
      onEditFolder(folder.id, newFolderName.trim());
      setNewFolderName('');
      setEditingFolder(null);
    } else {
      setEditingFolder(folder);
      setNewFolderName(folder.name);
    }
  };

  return (
    <div className={styles.folderManager}>
      <div className={styles.folderHeader}>
        <h3>Pastas</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={styles.addFolderButton}
        >
          <FaFolderPlus />
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.newFolderForm}
          >
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nome da pasta"
              className={styles.folderInput}
              autoFocus
            />
            <button onClick={handleCreateFolder} className={styles.confirmButton}>
              Criar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.folderList}>
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            className={styles.folderItem}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingFolder?.id === folder.id ? (
              <div className={styles.editFolderForm}>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className={styles.folderInput}
                  autoFocus
                />
                <button
                  onClick={() => handleEditFolder(folder)}
                  className={styles.confirmButton}
                >
                  Salvar
                </button>
              </div>
            ) : (
              <>
                <div
                  className={styles.folderName}
                  onClick={() => onSelectFolder(folder)}
                >
                  <FaFolder className={styles.folderIcon} />
                  <span>{folder.name}</span>
                  <span className={styles.messageCount}>
                    ({folder.messageCount})
                  </span>
                </div>
                <div className={styles.folderActions}>
                  <button
                    onClick={() => handleEditFolder(folder)}
                    className={styles.actionButton}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDeleteFolder(folder.id)}
                    className={styles.actionButton}
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
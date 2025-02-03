import { useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { FaFileExport, FaFileImport, FaSpinner } from 'react-icons/fa';
import styles from '../../styles/SharedMessages.module.css';

export default function ImportExport({ onImport, onExport }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await onExport();
      
      // Converter para CSV
      const csv = Papa.unparse(data.map(message => ({
        title: message.title,
        content: message.content,
        category: message.category,
        tags: message.tags.join(';'),
        is_public: message.is_public ? 'sim' : 'não',
        created_at: new Date(message.created_at).toLocaleString()
      })));

      // Criar e baixar arquivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `mensagens_${new Date().toISOString()}.csv`);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsImporting(true);
      
      // Ler arquivo CSV
      Papa.parse(file, {
        complete: async (results) => {
          const messages = results.data.map(row => ({
            title: row.title,
            content: row.content,
            category: row.category,
            tags: row.tags.split(';').filter(tag => tag),
            is_public: row.is_public.toLowerCase() === 'sim',
          }));

          await onImport(messages);
          setIsImporting(false);
        },
        header: true,
        error: (error) => {
          console.error('Erro ao importar:', error);
          setIsImporting(false);
        }
      });
    } catch (error) {
      console.error('Erro ao importar:', error);
      setIsImporting(false);
    }
  };

  return (
    <div className={styles.importExport}>
      <motion.div
        className={styles.exportButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={styles.actionButton}
        >
          {isExporting ? (
            <FaSpinner className={styles.spinner} />
          ) : (
            <FaFileExport />
          )}
          Exportar Mensagens
        </button>
      </motion.div>

      <motion.div
        className={styles.importButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <label className={styles.actionButton}>
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: 'none' }}
            disabled={isImporting}
          />
          {isImporting ? (
            <FaSpinner className={styles.spinner} />
          ) : (
            <FaFileImport />
          )}
          Importar Mensagens
        </label>
      </motion.div>
    </div>
  );
}
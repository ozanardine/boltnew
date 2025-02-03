import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMagic, FaTags, FaCopy } from 'react-icons/fa';
import styles from '../../styles/SharedMessages.module.css';

export default function AIFeatures({ 
  content, 
  onSuggestTags, 
  onCheckDuplicates,
  onSuggestRelated 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const handleSuggestTags = async () => {
    try {
      setIsLoading(true);
      const tags = await onSuggestTags(content);
      setSuggestions({ type: 'tags', data: tags });
    } catch (error) {
      console.error('Erro ao sugerir tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckDuplicates = async () => {
    try {
      setIsLoading(true);
      const duplicates = await onCheckDuplicates(content);
      setSuggestions({ type: 'duplicates', data: duplicates });
    } catch (error) {
      console.error('Erro ao verificar duplicatas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestRelated = async () => {
    try {
      setIsLoading(true);
      const related = await onSuggestRelated(content);
      setSuggestions({ type: 'related', data: related });
    } catch (error) {
      console.error('Erro ao buscar mensagens relacionadas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.aiFeatures}>
      <div className={styles.aiButtons}>
        <motion.button
          onClick={handleSuggestTags}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.aiButton}
        >
          <FaTags /> Sugerir Tags
        </motion.button>

        <motion.button
          onClick={handleCheckDuplicates}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.aiButton}
        >
          <FaCopy /> Verificar Duplicatas
        </motion.button>

        <motion.button
          onClick={handleSuggestRelated}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.aiButton}
        >
          <FaMagic /> Mensagens Relacionadas
        </motion.button>
      </div>

      {isLoading && (
        <div className={styles.aiLoading}>
          Processando...
        </div>
      )}

      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.aiSuggestions}
        >
          {suggestions.type === 'tags' && (
            <div className={styles.tagSuggestions}>
              <h4>Tags Sugeridas</h4>
              <div className={styles.tagList}>
                {suggestions.data.map((tag, index) => (
                  <span key={index} className={styles.suggestedTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestions.type === 'duplicates' && (
            <div className={styles.duplicateSuggestions}>
              <h4>Possíveis Duplicatas</h4>
              {suggestions.data.map((dup, index) => (
                <div key={index} className={styles.duplicateItem}>
                  <span>{dup.title}</span>
                  <span>{dup.similarity}% similar</span>
                </div>
              ))}
            </div>
          )}

          {suggestions.type === 'related' && (
            <div className={styles.relatedSuggestions}>
              <h4>Mensagens Relacionadas</h4>
              {suggestions.data.map((msg, index) => (
                <div key={index} className={styles.relatedItem}>
                  <span>{msg.title}</span>
                  <span>{msg.relevance}% relevante</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import DOMPurify from 'dompurify';
import MessageActions from './MessageActions';
import styles from '../../styles/SharedMessages.module.css';
import { FaUser, FaClock, FaGlobe, FaLock, FaTag, FaCopy, FaHeart } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    y: -4,
    transition: { duration: 0.2 }
  }
};

export default function MessageCard({ 
  message, 
  user, 
  onToggleFavorite, 
  onCopy, 
  onEdit, 
  onDelete,
  onGeminiSuggestion,
  onShare,
  onArchive,
  onMove
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sanitizedContent = DOMPurify.sanitize(message.content);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/shared/${message.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      onShare(message.id);
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <motion.div
      className={`${styles.messageCard} ${message.isPopular ? styles.popular : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <div className={styles.messageHeader}>
        <h3>{message.title}</h3>
        <MessageActions 
          message={message}
          user={user}
          onToggleFavorite={onToggleFavorite}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
          onGeminiSuggestion={onGeminiSuggestion}
          onShare={handleShare}
          onArchive={onArchive}
          onMove={onMove}
        />
      </div>

      <div className={styles.authorSection}>
        <div className={styles.authorPrimary}>
          <span className={styles.author}>
            <FaUser className={styles.authorIcon} /> {message.author_name}
          </span>
          {message.is_public ? (
            <span className={styles.public} title="Mensagem pública">
              <FaGlobe /> Pública
            </span>
          ) : (
            <span className={styles.private} title="Mensagem privada">
              <FaLock /> Privada
            </span>
          )}
        </div>
        <div className={styles.authorSecondary}>
          <span className={styles.timestamp} title={new Date(message.created_at).toLocaleString()}>
            <FaClock /> {formatRelativeTime(message.created_at)}
          </span>
          {message.updated_at !== message.created_at && (
            <span className={styles.edited} title={`Atualizado em ${new Date(message.updated_at).toLocaleString()}`}>
              (editado)
            </span>
          )}
        </div>
      </div>

      <div className={styles.messageBody}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isExpanded ? 'expanded' : 'collapsed'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {sanitizedContent}
            </ReactMarkdown>
          </motion.div>
        </AnimatePresence>
        {message.content.length > 100 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? 'Ver menos' : 'Ver mais'}
          </button>
        )}
      </div>

      <div className={styles.messageFooter}>
        <div className={styles.messageTags}>
          {message.category && (
            <span className={styles.category}>
              {message.category}
            </span>
          )}
          {message.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              <FaTag className={styles.tagIcon} />
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.messageMetrics}>
          <span className={styles.metric} title="Total de cópias">
            <FaCopy /> {message.copy_count || 0}
          </span>
          <span className={styles.metric} title="Total de favoritos">
            <FaHeart /> {message.favorites_count}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff} segundos atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutos atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} horas atrás`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} dias atrás`;

  return date.toLocaleDateString();
}
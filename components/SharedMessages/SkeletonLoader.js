import { motion } from 'framer-motion';
import styles from '../../styles/SharedMessages.module.css';

export default function SkeletonLoader() {
  return (
    <div className={styles.skeletonGrid}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.skeletonCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonActions} />
          </div>
          <div className={styles.skeletonAuthor} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine} style={{ width: '100%' }} />
            <div className={styles.skeletonLine} style={{ width: '80%' }} />
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
          </div>
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonTags} />
            <div className={styles.skeletonMetrics} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
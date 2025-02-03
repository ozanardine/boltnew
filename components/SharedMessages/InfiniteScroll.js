import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import styles from '../../styles/SharedMessages.module.css';

export default function InfiniteScroll({ onLoadMore, hasMore, isLoading }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return (
    <div ref={ref} className={styles.loadMoreTrigger}>
      {isLoading && hasMore && (
        <div className={styles.loadingSpinner}>
          Carregando mais mensagens...
        </div>
      )}
    </div>
  );
}
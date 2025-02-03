import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import Select from 'react-select';
import { motion } from 'framer-motion';
import styles from '../../styles/SharedMessages.module.css';

export default function SearchBar({ 
  onSearch, 
  onTagsChange, 
  availableTags,
  onCategoryChange,
  availableCategories,
  onSortChange,
  onFilterChange
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState({ value: 'recent', label: 'Mais recentes' });
  const [selectedFilter, setSelectedFilter] = useState({ value: 'all', label: 'Todas' });

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const sortOptions = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'popular', label: 'Mais populares' },
    { value: 'copied', label: 'Mais copiadas' },
    { value: 'alphabetical', label: 'Ordem alfabética' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'public', label: 'Públicas' },
    { value: 'private', label: 'Privadas' },
    { value: 'favorites', label: 'Favoritas' },
    { value: 'archived', label: 'Arquivadas' }
  ];

  return (
    <motion.div 
      className={styles.searchContainer}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar mensagens..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filtersContainer}>
        <Select
          isMulti
          value={selectedTags}
          onChange={(tags) => {
            setSelectedTags(tags);
            onTagsChange(tags);
          }}
          options={availableTags}
          placeholder="Filtrar por tags..."
          className={styles.tagSelect}
          classNamePrefix="react-select"
        />

        <Select
          value={selectedCategory}
          onChange={(category) => {
            setSelectedCategory(category);
            onCategoryChange(category);
          }}
          options={availableCategories}
          placeholder="Categoria..."
          className={styles.categorySelect}
          classNamePrefix="react-select"
          isClearable
        />

        <Select
          value={selectedSort}
          onChange={(sort) => {
            setSelectedSort(sort);
            onSortChange(sort.value);
          }}
          options={sortOptions}
          className={styles.sortSelect}
          classNamePrefix="react-select"
        />

        <Select
          value={selectedFilter}
          onChange={(filter) => {
            setSelectedFilter(filter);
            onFilterChange(filter.value);
          }}
          options={filterOptions}
          className={styles.filterSelect}
          classNamePrefix="react-select"
        />
      </div>
    </motion.div>
  );
}
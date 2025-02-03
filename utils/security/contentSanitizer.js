import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Configuração segura para o marked
marked.setOptions({
  headerIds: false,
  mangle: false
});

// Configuração do DOMPurify
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'blockquote',
    'del', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: [['target', '_blank'], ['rel', 'noopener noreferrer']],
  FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'button'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick']
};

/**
 * Sanitiza e converte markdown para HTML seguro
 */
export function sanitizeMarkdown(markdown) {
  try {
    // Primeiro converte markdown para HTML
    const html = marked(markdown);
    
    // Depois sanitiza o HTML
    const clean = DOMPurify.sanitize(html, purifyConfig);
    
    return clean;
  } catch (error) {
    console.error('Erro ao sanitizar conteúdo:', error);
    return DOMPurify.sanitize(markdown, purifyConfig);
  }
}

/**
 * Sanitiza texto simples
 */
export function sanitizeText(text) {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitiza URLs
 */
export function sanitizeUrl(url) {
  const clean = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: ['a'],
    ALLOWED_ATTR: ['href']
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(clean, 'text/html');
  const href = doc.querySelector('a')?.getAttribute('href');

  if (!href) return '';

  try {
    const parsed = new URL(href);
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitiza tags
 */
export function sanitizeTags(tags) {
  return tags
    .map(tag => sanitizeText(tag))
    .filter(tag => tag.length > 0 && tag.length <= 50)
    .map(tag => tag.toLowerCase())
    .filter((tag, index, self) => self.indexOf(tag) === index);
}

/**
 * Valida e sanitiza uma mensagem completa
 */
export function validateAndSanitizeMessage(message) {
  if (!message.title || !message.content) {
    throw new Error('Título e conteúdo são obrigatórios');
  }

  return {
    title: sanitizeText(message.title),
    content: sanitizeMarkdown(message.content),
    tags: message.tags ? sanitizeTags(message.tags) : [],
    category: message.category ? sanitizeText(message.category) : null,
    is_public: Boolean(message.is_public)
  };
}
// Citation formatters implementing Strategy pattern for different citation styles
import type { CitationData, CitationFormatter, Author } from './types';

// Helper functions
const formatAuthors = (authors: Author[], format: 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee'): string => {
  if (!authors || authors.length === 0) return 'Unknown Author';

  const formatName = (author: Author, isFirst: boolean) => {
    switch (format) {
      case 'apa':
      case 'harvard':
        return `${author.lastName}, ${author.firstName.charAt(0)}.${author.middleName ? ` ${author.middleName.charAt(0)}.` : ''}`;
      case 'mla':
        if (isFirst) {
          return `${author.lastName}, ${author.firstName}${author.middleName ? ` ${author.middleName.charAt(0)}.` : ''}`;
        }
        return `${author.firstName} ${author.lastName}`;
      case 'chicago':
        if (isFirst) {
          return `${author.lastName}, ${author.firstName}${author.middleName ? ` ${author.middleName.charAt(0)}.` : ''}`;
        }
        return `${author.firstName} ${author.lastName}`;
      case 'ieee':
        return `${author.firstName.charAt(0)}. ${author.middleName ? author.middleName.charAt(0) + '. ' : ''}${author.lastName}`;
      default:
        return `${author.firstName} ${author.lastName}`;
    }
  };

  if (authors.length === 1) {
    return formatName(authors[0], true);
  } else if (authors.length === 2) {
    if (format === 'ieee') {
      return `${formatName(authors[0], true)} and ${formatName(authors[1], false)}`;
    }
    return `${formatName(authors[0], true)}, & ${formatName(authors[1], false)}`;
  } else if (authors.length <= 7 && format === 'apa') {
    const allButLast = authors.slice(0, -1).map((a, i) => formatName(a, i === 0)).join(', ');
    return `${allButLast}, & ${formatName(authors[authors.length - 1], false)}`;
  } else if (format === 'ieee' && authors.length > 6) {
    return `${formatName(authors[0], true)} et al.`;
  } else {
    return `${formatName(authors[0], true)} et al.`;
  }
};

const getCurrentDate = (): string => {
  const now = new Date();
  const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

// APA Formatter (7th Edition)
export class APAFormatter implements CitationFormatter {
  format(data: CitationData): string {
    const authors = formatAuthors(data.authors, 'apa');
    const year = data.year || 'n.d.';
    const title = data.title;
    const publisher = data.publisher ? ` ${data.publisher}.` : '';
    const url = data.url ? ` ${data.url}` : '';
    const accessed = data.accessed || getCurrentDate();

    return `${authors} (${year}). <em>${title}</em>.${publisher}${url ? ` Retrieved ${accessed}, from${url}` : ''}`;
  }

  getLabel(): string {
    return 'APA';
  }

  getDescription(): string {
    return 'American Psychological Association (7th Edition)';
  }
}

// MLA Formatter (9th Edition)
export class MLAFormatter implements CitationFormatter {
  format(data: CitationData): string {
    const authors = formatAuthors(data.authors, 'mla');
    const title = data.title;
    const publisher = data.publisher || 'N.p.';
    const year = data.year || 'n.d.';
    const url = data.url ? ` <${data.url}>` : '';
    const accessed = data.accessed || getCurrentDate();

    return `${authors}. "<em>${title}</em>." ${publisher}, ${year}.${url ? ` Accessed ${accessed}.` : ''}${url}`;
  }

  getLabel(): string {
    return 'MLA';
  }

  getDescription(): string {
    return 'Modern Language Association (9th Edition)';
  }
}

// Chicago Formatter (17th Edition - Notes and Bibliography)
export class ChicagoFormatter implements CitationFormatter {
  format(data: CitationData): string {
    const authors = formatAuthors(data.authors, 'chicago');
    const title = data.title;
    const publisher = data.publisher || 'n.p.';
    const year = data.year || 'n.d.';
    const url = data.url ? ` ${data.url}` : '';
    const accessed = data.accessed || getCurrentDate();

    return `${authors}. "<em>${title}</em>." ${publisher}, ${year}.${url ? ` Accessed ${accessed}.${url}` : ''}`;
  }

  getLabel(): string {
    return 'Chicago';
  }

  getDescription(): string {
    return 'Chicago Manual of Style (17th Edition)';
  }
}

// Harvard Formatter
export class HarvardFormatter implements CitationFormatter {
  format(data: CitationData): string {
    const authors = formatAuthors(data.authors, 'harvard');
    const year = data.year || 'n.d.';
    const title = data.title;
    const publisher = data.publisher ? ` ${data.publisher}.` : '';
    const url = data.url ? ` Available at: ${data.url}` : '';
    const accessed = data.accessed || getCurrentDate();

    return `${authors} ${year}. <em>${title}</em>.${publisher}${url ? `${url} (Accessed: ${accessed}).` : ''}`;
  }

  getLabel(): string {
    return 'Harvard';
  }

  getDescription(): string {
    return 'Harvard Referencing Style';
  }
}

// BibTeX Formatter
export class BibTeXFormatter implements CitationFormatter {
  format(data: CitationData): string {
    const generateKey = () => {
      const firstAuthor = data.authors[0];
      const lastName = firstAuthor?.lastName.toLowerCase() || 'unknown';
      const year = data.year || 'n.d.';
      return `${lastName}${year}`;
    };

    const authors = data.authors.map(a => `${a.firstName} ${a.lastName}`).join(' and ');
    const key = generateKey();
    const title = data.title;
    const year = data.year || '';
    const publisher = data.publisher || '';
    const url = data.url || '';
    const pages = data.pages || '';

    return `@article{${key},\n  author = {${authors}},\n  title = {${title}},\n  year = {${year}},${publisher ? `\n  publisher = {${publisher}},` : ''}${pages ? `\n  pages = {${pages}},` : ''}${url ? `\n  url = {${url}},` : ''}\n}`;
  }

  getLabel(): string {
    return 'BibTeX';
  }

  getDescription(): string {
    return 'BibTeX Format for LaTeX';
  }
}

// IEEE Formatter
export class IEEEFormatter implements CitationFormatter {
  format(data: CitationData): string {
    const authors = formatAuthors(data.authors, 'ieee');
    const title = data.title;
    const publisher = data.publisher || 'N.p.';
    const year = data.year || 'n.d.';
    const pages = data.pages ? `, pp. ${data.pages}` : '';
    const url = data.url ? `, [Online]. Available: ${data.url}` : '';
    const accessed = data.accessed || getCurrentDate();

    return `${authors}, "<em>${title}</em>," ${publisher}, ${year}${pages}${url ? `.${url} (accessed ${accessed}).` : '.'}`;
  }

  getLabel(): string {
    return 'IEEE';
  }

  getDescription(): string {
    return 'Institute of Electrical and Electronics Engineers';
  }
}

// Factory function to get formatter
export const getCitationFormatter = (format: string): CitationFormatter => {
  switch (format) {
    case 'APA':
      return new APAFormatter();
    case 'MLA':
      return new MLAFormatter();
    case 'Chicago':
      return new ChicagoFormatter();
    case 'Harvard':
      return new HarvardFormatter();
    case 'BibTeX':
      return new BibTeXFormatter();
    case 'IEEE':
      return new IEEEFormatter();
    default:
      return new APAFormatter();
  }
};

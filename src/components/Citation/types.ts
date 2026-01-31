// Citation format types and interfaces
export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'BibTeX' | 'IEEE';

export interface Author {
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface CitationData {
  title: string;
  authors: Author[];
  year: string;
  publisher?: string;
  pages?: string;
  url?: string;
  doi?: string;
  accessed?: string;
  abstract?: string;
  itemType?: string;
}

export interface CitationFormatter {
  format(data: CitationData): string;
  getLabel(): string;
  getDescription(): string;
}

export interface CitationAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

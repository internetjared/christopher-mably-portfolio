// Simple project type
export interface SanityProject {
  _id: string;
  title: string;
  client?: string; // Optional client field
  category: 'commercial' | 'narrative';
  slug: {
    current: string;
  };
  vimeoUrl: string;
  thumbnail?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  overview?: string;
  credits?: string;
  orderRank?: string;
}
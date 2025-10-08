// Simple project type
export interface SanityProject {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  vimeoUrl: string;
  overview?: string;
  credits?: string;
  orderRank?: string;
}
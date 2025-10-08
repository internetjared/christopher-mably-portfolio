import { createClient } from '@sanity/client';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: 'cr745m4x',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

// Simple project query
const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  vimeoUrl,
  overview,
  credits
}`;

// Get all projects
export async function getProjects() {
  try {
    return await sanityClient.fetch(PROJECTS_QUERY);
  } catch {
    return [];
  }
}

// Get project by slug
export async function getProjectBySlug(slug: string) {
  try {
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      vimeoUrl,
      overview,
      credits
    }`;
    return await sanityClient.fetch(query, { slug });
  } catch {
    return null;
  }
}
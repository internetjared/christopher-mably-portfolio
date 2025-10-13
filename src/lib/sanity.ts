import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/public';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID || 'cr745m4x',
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: env.PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Simple project query - using orderRank for drag-and-drop ordering
const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank asc) {
  _id,
  title,
  slug,
  vimeoUrl,
  thumbnail {
    asset->,
    alt
  },
  overview,
  credits,
  orderRank
}`;

// Get all projects
export async function getProjects() {
  try {
    return await sanityClient.fetch(PROJECTS_QUERY);
  } catch (error) {
    console.error('Error fetching projects:', error);
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
      thumbnail {
        asset->,
        alt
      },
      overview,
      credits,
      orderRank
    }`;
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}
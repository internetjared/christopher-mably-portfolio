import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID || 'cr745m4x',
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: env.PUBLIC_SANITY_API_VERSION || '2023-05-03',
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
    console.log('Fetching projects with config:', {
      projectId: env.PUBLIC_SANITY_PROJECT_ID || 'cr745m4x',
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: env.PUBLIC_SANITY_API_VERSION || '2023-05-03'
    });
    const projects = await sanityClient.fetch(PROJECTS_QUERY);
    console.log('Fetched projects:', projects);
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Get project by slug
export async function getProjectBySlug(slug: string) {
  try {
    console.log('Fetching project by slug:', slug);
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      vimeoUrl,
      overview,
      credits
    }`;
    const project = await sanityClient.fetch(query, { slug });
    console.log('Fetched project:', project);
    return project;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}
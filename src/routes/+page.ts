import type { PageLoad } from './$types';
import { getProjects } from '$lib/sanity';

export const load: PageLoad = async () => {
  const projects = await getProjects();
  const project = projects[0] || null; // Use first project as default
  
  return {
    project,
    allProjects: projects
  };
};
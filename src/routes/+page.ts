import type { PageLoad } from './$types';
import { getProjects } from '$lib/sanity';

export const load: PageLoad = async () => {
  const projects = await getProjects();
  
  return {
    allProjects: projects
  };
};
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getProjectBySlug, getProjects } from '$lib/sanity';

export const load: PageLoad = async ({ params }) => {
	const project = await getProjectBySlug(params.id);
	
	if (!project) {
		throw error(404, 'Project not found');
	}
	
	const allProjects = await getProjects();
	
	return {
		project,
		allProjects
	};
};
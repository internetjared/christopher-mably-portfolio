import { json } from '@sveltejs/kit';
import { sanityClient } from '$lib/sanity.js';
import { env } from '$env/dynamic/public';

export async function GET() {
  try {
    // Test basic Sanity connection
    const config = {
      projectId: env.PUBLIC_SANITY_PROJECT_ID || 'cr745m4x',
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: env.PUBLIC_SANITY_API_VERSION || '2023-05-03'
    };

    // Simple test query
    const testQuery = `*[_type == "project"][0] { _id, title }`;
    const result = await sanityClient.fetch(testQuery);

    return json({
      success: true,
      config,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return json({
      success: false,
      error: error.message,
      config: {
        projectId: env.PUBLIC_SANITY_PROJECT_ID || 'cr745m4x',
        dataset: env.PUBLIC_SANITY_DATASET || 'production',
        apiVersion: env.PUBLIC_SANITY_API_VERSION || '2023-05-03'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

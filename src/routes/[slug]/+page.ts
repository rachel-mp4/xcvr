import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug
	return { slug: slug }
}
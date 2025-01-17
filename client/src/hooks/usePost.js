import useSWR from "swr";

const poster = async (url, token, payload) => {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`, // Include the token in the Authorization header
		},
		body: JSON.stringify(payload), // Include the payload in the request body
	});

	if (!res.ok) {
		throw new Error(`Error ${res.status}: ${res.statusText}`);
	}

	return res.json();
};

/**
 * Custom `usePost` hook for sending POST requests.
 * @param url - API endpoint to send the POST request to.
 * @param token - Authentication token (e.g., JWT).
 * @returns Object with post function, isLoading, error, and success states.
 */
export const usePost = (url, token) => {
	const { mutate } = useSWR(); // Use SWR's mutate for cache invalidation if needed

	const post = async (payload) => {
		try {
			const data = await poster(url, token, payload);
			// Optionally update the cache after a successful post
			mutate(url);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	return { post };
};

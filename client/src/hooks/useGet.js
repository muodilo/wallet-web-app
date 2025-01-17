import useSWR from "swr";

const fetcher = async (url, token) => {
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`, // Include the token in the Authorization header
		},
	});

	if (!res.ok) {
		throw new Error(`Error ${res.status}: ${res.statusText}`);
	}

	return res.json();
};

/**
 * Custom `useGet` hook for fetching protected data with polling.
 * @param url - API endpoint to fetch data from.
 * @param token - Authentication token (e.g., JWT).
 * @param refreshInterval - Interval (in milliseconds) for polling the data.
 * @returns SWR response with data, error, and isLoading states.
 */
export const useGet = (
	url,
	token,
	refreshInterval = 0 // Default is no polling
) => {
	const { data, error, isLoading, mutate } = useSWR(
		token ? [url, token] : null, // Only fetch if token is available
		([url, token]) => fetcher(url, token),
		{
			revalidateOnFocus: true, // Refetch when the user focuses the window
			refreshInterval, // Automatically fetch data at intervals
		}
	);

	return {
		data,
		error,
		isLoading,
		mutate, // Expose mutate for manual cache updates
	};
};

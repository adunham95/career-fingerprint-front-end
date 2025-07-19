import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { MeetingHighlight } from '../../app';

export interface NewHighlight {
	meetingID: string;
	text: string;
	note?: string | null;
	achievementIDs: string[];
}

export interface UpdateHighlight {
	text: string;
	note?: string | null;
	noteID?: string | null;
	achievementIDs: string[];
	uncheckAchievementIDs: string[];
}

export async function deleteHighlight(highlightID: string): Promise<MeetingHighlight | null> {
	const url = `${PUBLIC_API_URL}/highlights/${highlightID}`;

	try {
		const res = await fetch(url, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to delete highlight: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function fetchMeetingHighlights(meetingID: string): Promise<MeetingHighlight[]> {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/highlights/meeting/${meetingID}`, {
		credentials: 'include'
	});

	return await resHighlights.json();
}

export async function postHighlight(highlight: NewHighlight): Promise<MeetingHighlight | null> {
	console.info('postHighlight', highlight);
	const url = `${PUBLIC_API_URL}/highlights`;

	console.log({ highlight });

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(highlight)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateHighlight({
	id,
	highlight
}: {
	id: string;
	highlight: UpdateHighlight;
}) {
	const url = `${PUBLIC_API_URL}/highlights/${id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(highlight)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

export const highlightKeys = {
	meetingHighlight: (id: string) => ['meetingHighlights', id] as const
	// all: ['users'] as const,
	// lists: () => [...userKeys.all, 'list'] as const,
	// list: (filters: string) => [...userKeys.lists(), { filters }] as const,
	// details: () => [...userKeys.all, 'detail'] as const,
	// detail: (id: number) => [...userKeys.details(), id] as const
};

// Queries

export const useMeetingHighlightsQuery = (meetingID: string, initialData?: MeetingHighlight[]) => {
	return createQuery({
		queryKey: highlightKeys.meetingHighlight(meetingID),
		queryFn: () => fetchMeetingHighlights(meetingID),
		enabled: !!meetingID,
		initialData
	});
};

// Mutations

export const useCreateHighlightMutation = (meetingID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: postHighlight,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: highlightKeys.meetingHighlight(meetingID)
			});
		},
		onError: (error) => {
			console.error('Failed to create highlight:', error);
		}
	});
};

export const useDeleteHighlightMutation = (meetingID: string) => {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: deleteHighlight,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: highlightKeys.meetingHighlight(meetingID),
				exact: true,
				refetchType: 'active'
			});
		},
		onError: (error) => {
			console.error('Failed to delete user:', error);
		}
	});
};

export const useUpdateHighlightMutation = (meetingID: string) => {
	const queryClient = useQueryClient();

	return createMutation({
		mutationFn: updateHighlight,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: highlightKeys.meetingHighlight(meetingID),
				exact: true,
				refetchType: 'active'
			});
		},
		onError: (error) => {
			console.error('Failed to update highlight:', error);
		}
	});
};

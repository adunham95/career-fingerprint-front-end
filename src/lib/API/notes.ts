import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import { queryClient } from './queryClient';

export async function createNote(newProfile: { note: string; meetingID: string }) {
	const url = `${PUBLIC_API_URL}/notes`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(newProfile)
		});
		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to create note ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create note`);
	}
}

export async function getMeetingNotes(meetingID: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/notes/meeting/${meetingID}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const noteKeys = {
	all: ['notes'] as const,
	meetingNotes: (id: string) => [...noteKeys.all, 'meeting-notes', id] as const
};

export const useMeetingNotes = (meetingID: string, initialData: unknown) => {
	return createQuery({
		queryKey: noteKeys.meetingNotes(meetingID),
		queryFn: () => getMeetingNotes(meetingID),
		initialData
	});
};

// MUTATIONS
export const useCreateNote = (meetingID: string) => {
	return createMutation({
		mutationFn: createNote,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: noteKeys.meetingNotes(meetingID)
			});
		},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};

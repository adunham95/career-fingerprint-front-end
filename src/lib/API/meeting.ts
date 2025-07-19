import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Meeting } from '../../app';

interface NewMeeting {
	time?: Date | string | null;
	title?: string | null;
	type?: string | null;
	location?: string | null;
	link?: string | null;
	jobAppID?: string | null;
	jobPositionID?: string | null;
	educationID?: string | null;
}

export async function createMeeting(newMeeting: NewMeeting): Promise<Meeting | null> {
	const url = `${PUBLIC_API_URL}/meetings`;

	console.log({ newMeeting });

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newMeeting)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to create meeting: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create meeting`);
	}
}

export const meetingKeys = {
	all: ['meeting'] as const,
	meeting: (id: string) => [...meetingKeys.all, id] as const
	// lists: () => [...userKeys.all, 'list'] as const,
	// list: (filters: string) => [...userKeys.lists(), { filters }] as const,
	// details: () => [...userKeys.all, 'detail'] as const,
	// detail: (id: number) => [...userKeys.details(), id] as const
};

export const useCreateMeetingMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createMeeting,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: meetingKeys.all
			});
		},
		onError: (error) => {
			console.error('Failed to create highlight:', error);
		}
	});
};

import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
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
	agenda?: string | null;
	attendees?: string[];
}

export interface UpdateMeetingInput {
	id: string;
	time: Date | string | null;
	title: string | null;
	type: string | null;
	location: string | null;
	link: string | null;
	jobAppID?: string | null;
	jobPositionID?: string | null;
	educationID?: string | null;
	agenda?: string | null;
	attendees?: string[];
}

export async function updateMeeting(meeting: Partial<UpdateMeetingInput>): Promise<Meeting | null> {
	console.info('updateMeeting', meeting);
	const url = `${PUBLIC_API_URL}/meetings/${meeting.id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(meeting)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch meeting: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
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

export async function getMeetingByPage(page: number = 1): Promise<Meeting[] | null> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/my?page=${page}&limit=20`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getMeetingByID(id: string): Promise<Meeting | null> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/${id}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getUpcomingMeeting(token?: string): Promise<Meeting[] | null> {
	let options: RequestInit = {
		credentials: 'include'
	};
	if (token) {
		options = {
			headers: {
				Authorization: 'Bearer ' + token
			}
		};
	}
	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/my/upcoming`, options);
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getPreviousMeeting(): Promise<Meeting[] | null> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/my/previous`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const meetingKeys = {
	all: ['meeting'] as const,
	meeting: (id: string) => [...meetingKeys.all, id] as const,
	meetingsByPage: (page: number) => [...meetingKeys.all, page] as const,
	previousMeetings: ['meeting', 'previous-meeting'] as const,
	upcomingMeetings: ['meeting', 'upcoming-meeting'] as const
};

export const useCreateMeetingMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createMeeting,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: meetingKeys.all
			});
			queryClient.invalidateQueries({
				queryKey: meetingKeys.upcomingMeetings
			});
		},
		onError: (error) => {
			console.error('Failed to create meeting:', error);
		}
	});
};

export const useUpdateMeetingMutation = (meetingID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateMeeting,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: meetingKeys.all
			});
			queryClient.invalidateQueries({
				queryKey: meetingKeys.meeting(meetingID)
			});
		},
		onError: (error) => {
			console.error('Failed to update meeting:', error);
		}
	});
};

export const useMeetingByPageQuery = (pageNumber: number, initialData?: Meeting[]) => {
	return createQuery({
		queryKey: meetingKeys.meetingsByPage(pageNumber),
		queryFn: () => getMeetingByPage(pageNumber),
		initialData
	});
};

export const useMeetingByID = (id: string, initialData?: Meeting) => {
	return createQuery({
		queryKey: meetingKeys.meeting(id),
		queryFn: () => getMeetingByID(id),
		initialData
	});
};

export const useUpcomingMeetings = (initialData?: Meeting[]) => {
	return createQuery({
		queryKey: meetingKeys.upcomingMeetings,
		queryFn: () => getUpcomingMeeting(),
		initialData
	});
};

export const usePreviousMeetings = (initialData?: Meeting[]) => {
	return createQuery({
		queryKey: meetingKeys.previousMeetings,
		queryFn: () => getPreviousMeeting(),
		initialData
	});
};

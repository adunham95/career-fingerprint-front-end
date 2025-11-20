import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import { createApiClient } from './apiClient';

interface ThankYouNote {
	id: string;
	createdAt: string;
	message: string;
	meetingID: string;
	contacts: {
		id: string;
		userID: number;
		createdAt: string;
		updatedAt: string;
		firstName?: string;
		lastName?: string;
		email: string;
	}[];
}

async function sendThankYouNote(data: {
	message: string;
	meetingID: string;
	contacts: { firstName: string; email: string }[];
}) {
	try {
		const api = createApiClient();
		const thankYou = await api.post('/thank-yous', data);
		return thankYou;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to send thank you note`);
	}
}

async function getThankYouNotesForMeeting(meetingID: string) {
	console.log(meetingID);
	try {
		const api = createApiClient();
		const thankYous = await api.get<ThankYouNote[]>(`/thank-yous/meeting/${meetingID}`);
		return thankYous;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to send thank you note`);
	}
}

export const thankYouNoteKeys = {
	all: ['thankYouNotes'] as const,
	byMeetings: (meetingID: string) => [...thankYouNoteKeys.all, 'meetings,', meetingID] as const
};

// QUERIES

export const useGetThankYouNotesForMeeting = (meetingID: string) => {
	return createQuery({
		queryKey: thankYouNoteKeys.byMeetings(meetingID),
		queryFn: () => getThankYouNotesForMeeting(meetingID),
		enabled: false
	});
};

// MUTATIONS

export const useAddThankYouMutation = (meetingID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: sendThankYouNote,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: thankYouNoteKeys.byMeetings(meetingID)
			});
		},
		onError: (error) => {
			console.error('Failed to send thank you note:', error);
		}
	});
};

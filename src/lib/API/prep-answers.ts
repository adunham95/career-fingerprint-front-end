import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

export interface NewPrepAnswer {
	answer: string;
	jobApplicationID: string;
	questionID: string;
	meetingID: string;
}

// export interface PrepAnswers {}

export async function upsertPrepAnswer(
	prepAnswer: NewPrepAnswer
): Promise<{ success: boolean } | null> {
	console.info(prepAnswer);
	const url = `${PUBLIC_API_URL}/prep/answer`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(prepAnswer)
		});

		if (res.ok) {
			return { success: true };
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return { success: false };
	}
}

export async function getAnswersByMeetingID(id: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/prep/answers/meeting/${id}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const prepAnswersKeys = {
	all: ['prep-answers'] as const,
	prepAnswer: (id: string) => [...prepAnswersKeys.all, id] as const,
	prepAnswerMeeting: (meetingID: string) =>
		[...prepAnswersKeys.all, 'prep-meeting', meetingID] as const
};

export const useCreatePrepAnswersMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: upsertPrepAnswer,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: prepAnswersKeys.all
			});
		},
		onError: (error) => {
			console.error('Failed to upsert answer', error);
		}
	});
};

export const useGetAnswersByMeetingID = (id: string) => {
	return createQuery({
		queryKey: prepAnswersKeys.prepAnswerMeeting(id),
		queryFn: () => getAnswersByMeetingID(id)
		// initialData
	});
};

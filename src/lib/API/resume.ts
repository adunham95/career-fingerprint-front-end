import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { Resume, ResumeObject } from '../../app';
import { jobPositionKeys } from './job-positions';
import { educationKeys } from './education';
import { createApiClient } from './apiClient';

interface UpdateResumeInput {
	id: string;
	name: string;
	default: boolean;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	summary: string | null;
	phoneNumber: string | null;
	location: string | null;
	website: string | null;
	linkedin: string | null;
	github: string | null;
	title: string | null;
}

export const resumeObjectTypeMap = {
	education: 'Education',
	'job-positions': 'Job'
};

export async function getResumeByID(id: string) {
	const url = `${PUBLIC_API_URL}/resume/${id}`;

	try {
		const res = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to get resume: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get resume`);
	}
}

export async function updateResume(resume: Partial<UpdateResumeInput>): Promise<Resume | null> {
	console.info('updateResume', resume);
	const url = `${PUBLIC_API_URL}/resume/${resume.id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(resume)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch resume: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to patch resume`);
	}
}

export async function duplicateResume(id: string): Promise<Resume | null> {
	const url = `${PUBLIC_API_URL}/resume/${id}/duplicate`;

	try {
		const res = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to duplicate resume: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to duplicate resume`);
	}
}

interface ResumeObjectUpdate {
	description?: string;
	bulletPointsOptions?: string[];
}

interface NewResumeObject {
	type: keyof typeof resumeObjectTypeMap;
	itemID: string;
	resumeID: string;
	item: ResumeObjectUpdate;
}

export async function updateResumeObject({
	type,
	item,
	itemID
}: NewResumeObject): Promise<Resume | null> {
	const url = `${PUBLIC_API_URL}/${type}/${itemID}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(item)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch resume: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to patch resume`);
	}
}

export async function addResumeObject({
	resumeID,
	body
}: {
	resumeID: string;
	body: { jobPositionID?: string; educationID?: string };
}): Promise<ResumeObject | null> {
	const api = createApiClient();

	try {
		return api.post(`/resume/${resumeID}/resume-object`, body);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to add object to resume`);
	}
}

export async function deleteResumeObject({
	type,
	resumeID,
	itemID
}: {
	type: keyof typeof resumeObjectTypeMap;
	resumeID: string;
	itemID: string;
}): Promise<Resume | null> {
	const api = createApiClient();

	try {
		return api.del(`/resume/${resumeID}/${type}/${itemID}`);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete resume object`);
	}
}

export async function updateResumeJobObject({
	resumeID,
	jobID
}: {
	resumeID: string;
	jobID: string;
}): Promise<Resume | null> {
	const api = createApiClient();

	try {
		return api.patch(`/resume/${resumeID}/job-object/${jobID}`);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to add job to resume`);
	}
}

export const resumeKeys = {
	all: ['resumes'] as const,
	resume: (id: string) => [...resumeKeys.all, id] as const,
	duplicate: ['duplicate']
};

// Queries

export const useDuplicateResumeQuery = (id: string) => {
	return createQuery({
		queryKey: resumeKeys.duplicate,
		queryFn: () => duplicateResume(id),
		enabled: false
	});
};

export const useGetResumeByIDQuery = (id: string, initialData?: Resume) => {
	return createQuery({
		queryKey: resumeKeys.resume(id),
		queryFn: () => getResumeByID(id),
		initialData
	});
};

// Mutations

export const useUpdateResumeMutation = (resumeID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateResume,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: resumeKeys.all
			});
			queryClient.invalidateQueries({
				queryKey: resumeKeys.resume(resumeID)
			});
		},
		onError: (error) => {
			console.error('Failed to update resume:', error);
		}
	});
};

export const useUpdateResumeObjectMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateResumeObject,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobPositionKeys.my
			});
			queryClient.invalidateQueries({
				queryKey: educationKeys.my
			});
		},
		onError: (error) => {
			console.error('Failed to update resume object:', error);
		}
	});
};

export const useDeleteResumeObjectMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: deleteResumeObject,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobPositionKeys.my
			});
			queryClient.invalidateQueries({
				queryKey: educationKeys.my
			});
		},
		onError: (error) => {
			console.error('Failed to delete resume object:', error);
		}
	});
};

export const useAddResumeObjectMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: addResumeObject,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobPositionKeys.my
			});
			queryClient.invalidateQueries({
				queryKey: educationKeys.my
			});
		},
		onError: (error) => {
			console.error('Failed to delete resume object:', error);
		}
	});
};

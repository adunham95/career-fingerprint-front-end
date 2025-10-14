import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { BulletPoint, Education, JobPosition, Resume, ResumeObject } from '../../app';
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

// Resume Features

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

/**
 * Resume Object Functions
 * These are where you can edit the resume objects, this are objects that link jobs + education and the resume
 * Along with tracking the bullet points, and description that happen per interview
 */
interface ResumeObjectUpdate {
	description?: string;
	bulletPointOptions?: BulletPoint[];
}

interface UpdateResumeObject {
	resumeID: string;
	resumeObjectID?: string;
	item: ResumeObjectUpdate;
}

export async function updateResumeObject({
	resumeObjectID,
	item
}: UpdateResumeObject): Promise<Resume | null> {
	const api = createApiClient();

	try {
		return api.patch(`/resume/resume-object/${resumeObjectID}`, item);
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
	resumeObjectID
}: {
	resumeObjectID: string;
}): Promise<Resume | null> {
	const api = createApiClient();

	try {
		return api.del(`/resume/resume-object/${resumeObjectID}`);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete resume object`);
	}
}

/**
 * Resume Items Functions
 * Jobs and Education
 * These are where you can edit the job positions and education
 */
interface JobPositionUpdate extends JobPosition {
	bulletPointsOptions?: string[];
}

interface EducationUpdate extends Education {
	bulletPointsOptions?: string[];
}

interface ResumeItem {
	type: keyof typeof resumeObjectTypeMap;
	itemID: string;
	item: JobPositionUpdate | EducationUpdate;
}

interface NewResumeItem {
	type: keyof typeof resumeObjectTypeMap;
	item?: Partial<JobPosition | Education>;
}

export async function updateResumeItem({ type, item, itemID }: ResumeItem): Promise<Resume | null> {
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

export async function addResumeItem({
	type,
	item
}: NewResumeItem): Promise<JobPosition | Education | null> {
	const url = `${PUBLIC_API_URL}/${type}`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(item)
		});

		if (res.ok) {
			return res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch resume: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to patch resume`);
	}
}

export async function deleteResumeItem({
	type,
	itemID
}: {
	type: keyof typeof resumeObjectTypeMap;
	itemID: string;
}): Promise<Resume | null> {
	const url = `${PUBLIC_API_URL}/${type}/${itemID}`;

	try {
		const res = await fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			}
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to delete resume object: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete resume object`);
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

export const useUpdateResumeItemMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateResumeItem,
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

export const useDeleteResumeItemMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: deleteResumeItem,
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

export const useAddResumeItemMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: addResumeItem,
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

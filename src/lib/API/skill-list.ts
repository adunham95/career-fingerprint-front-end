import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import { queryClient } from './queryClient';

export async function upsertSkills(updateSkillList: { skillList: string[] }) {
	const url = `${PUBLIC_API_URL}/skill-list`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(updateSkillList)
		});
		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to upset skill list ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to upsert skill list`);
	}
}

export async function getSkillList(token?: string): Promise<{ skillList: string[] } | null> {
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
		const res = await fetch(`${PUBLIC_API_URL}/skill-list/my`, options);
		if (res.ok) {
			return await res.json();
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const skillListKeys = {
	mySkills: ['skillList'] as const
};

export const useMySkills = () => {
	return createQuery({
		queryKey: skillListKeys.mySkills,
		queryFn: () => getSkillList(),
		enabled: true
	});
};

// MUTATIONS
export const useUpdateSkillList = () => {
	return createMutation({
		mutationFn: upsertSkills,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: skillListKeys.mySkills
			});
		},
		onError: (error) => {
			console.error('Failed to update skill list:', error);
		}
	});
};

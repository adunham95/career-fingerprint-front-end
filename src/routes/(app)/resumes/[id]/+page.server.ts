import { createApiClient } from '$lib/API/apiClient';
import { useFeatureGate } from '$lib/Utils/featureGate';
import { redirect } from '@sveltejs/kit';
import type { Education, JobPosition, Resume, ResumeObject, SkillData } from '../../../../app';

export const load = async (event) => {
	console.log(event.params.id);

	const { user } = await event.parent();
	const featureEnabled = useFeatureGate(1, user);

	if (!featureEnabled) {
		redirect(307, '/settings/membership');
	}

	try {
		const api = createApiClient(event);
		const [resume, education, jobs, skillList, resumeObjects] = await Promise.all([
			await api.get<Resume>(`/resume/${event.params.id}`),
			await api.get<Education[]>('/education/my'),
			await api.get<JobPosition[]>('/job-positions/my'),
			await api.get<SkillData>('/skill-list/my'),
			await api.get<ResumeObject[]>(`/resume/${event.params.id}/objects`)
		]);
		return { resume, education, jobs, mySkills: skillList, resumeObjects: resumeObjects ?? [] };
	} catch (error) {
		console.error(error);
	}
};

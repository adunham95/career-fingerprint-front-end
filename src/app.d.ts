// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface JobPosition {
	id: string;
	name: string | null;
	company: string | null;
	description: string | null;
	location: string | null;
	startDate: string | null;
	endDate: string | null;
	currentPosition: boolean | null;
	achievements: Achievement[];
}

interface Project {
	id: string;
	name: string | null;
	description: string | null;
	jobID: string | null;
}

interface Education {
	id: string;
	institution: string | null;
	degree: string | null;
	startDate: string | null;
	endDate: string | null;
	currentPosition: boolean | null;
	description: string | null;
	achievements: Achievement[];
}

interface JobApplication {
	id: string;
	company?: string;
	companyURL?: string;
	jobDescriptionURL?: string;
	jobDescription?: string;
	location?: string;
	status?: AppStatusEnum;
	title?: string;
	_count?: { notes: int; meetings: int };
}

interface Achievement {
	id: string;
	startDate: string | null;
	endDate: string | null;
	myContribution: string;
	description: string;
}

interface Meeting {
	id: string;
	time: Date | string;
	title: string;
	type: string;
}

interface PrepQuestion {
	id: string;
	question: string;
	key: string;
	displayOn: string[];
	order: number;
	prepAnswers: { answer: string }[];
}

export { JobPosition, Education, Project, JobApplication, Achievement, Meeting, PrepQuestion };

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
}

interface JobApplication {
	id: string;
	company?: string;
	companyURL?: string;
	jobDescriptionURL?: string;
	location?: string;
	status?: string;
	title?: string;
	_count?: { notes: int; interviews: int };
}

export { JobPosition, Education, Project, JobApplication };

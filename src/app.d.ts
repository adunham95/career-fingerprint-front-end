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

interface Education {
	id: string;
	institution: string | null;
	degree: string | null;
	duration: string | null;
	description: string | null;
}

export { JobPosition, Education };

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: CurrentUser | null;
		}
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
	time: Date | string | null;
	title: string;
	type: string;
	location: string;
	link: string;
	agenda: string;
	attendees: string[];
	jobAppID: string;
	jobPositionID: string;
	educationID: string;
	jobApp: JobApplication;
}

interface Note {
	createdAt: string;
	educationID: string | null;
	highlightID: string | null;
	id: string;
	jobAppID: string | null;
	jobPositionID: string | null;
	meetingID: string | null;
	note: string;
	updatedAt: string;
	userID: number;
}

interface MeetingHighlight {
	id: string;
	createdAt: string;
	updatedAt: string;
	userID: number;
	text: string;
	meetingID: string;
	notes: Note[];
	achievements: Achievement[];
}

interface PrepQuestion {
	id: string;
	question: string;
	key: string;
	displayOn: string[];
	order: number;
	prepAnswers: { answer: string }[];
}

interface CurrentUser {
	id: string;
	firstName: string;
	lastName: string;
	accountStatus: string;
	email: string;
	profileImage: string | null;
	stripeCustomerID: string | null;
	planLevel: number;
	subscription: {
		id: string;
		status: string;
		stripeSubId: string | null;
		trialEndsAt: string | null;
		currentPeriodEnd: string | null;
		plan: {
			id: string;
			key: string;
			level: number;
		};
	};
}

export {
	JobPosition,
	Education,
	Project,
	JobApplication,
	Achievement,
	Meeting,
	PrepQuestion,
	MeetingHighlight,
	CurrentUser
};

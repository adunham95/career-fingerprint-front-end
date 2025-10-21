// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: CurrentUser | null;
			session: string | null;
			tokens: { accessToken?: string };
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
	bulletPoints: BulletPoint[];
}

interface ResumeObject {
	id: string;
	description: string | null;
	type: 'job' | 'education';
	jobID: string | null;
	job?: JobPosition;
	eduID: string | null;
	edu?: Education;
	bulletPoints: BulletPoint[];
}
interface JobObject {
	id: string;
	description: string | null;
	job: JobPosition;
	bulletPoints: BulletPoint[];
}

interface BulletPoint {
	id: string;
	text: string | null;
	resumeObjectID?: string;
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
	bulletPoints: BulletPoint[];
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
	migrated: boolean;
	_count?: { notes: int; meetings: int };
	coverLetter?: null | { id: string };
}

interface Achievement {
	id: string;
	startDate: string | null;
	endDate: string | null;
	myContribution: string;
	description: string;
	result: string;
	jobPosition?: JobPosition;
	jobPositionID?: string;
	education?: Education;
	educationID?: string;
	tags?: { name: string; color: string }[];
}

interface AchievementTag {
	id?: string;
	name: string;
	color: string;
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
	highlights?: MeetingHighlight[];
	jobPosition?: JobPosition;
	prepAnswers?: PrepAnswer[];
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

export interface MeetingHighlight {
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
interface PrepAnswer {
	id: string;
	answer: string;
	question: { question: string };
}

interface CurrentUser {
	id: number;
	firstName: string;
	lastName: string;
	accountStatus: string;
	email: string;
	profileImage: string | null;
	stripeCustomerID: string | null;
	planLevel: number;
	pitch: string;
	lookingFor: string;
	inviteCode: string | null;
	emailVerified: boolean;
	orgs: Organization[];
	subscription: SubscriptionPlan;
	redeemedFreeTrial: boolean;
	userType: string;
}

interface User {
	id: number;
	firstName: string;
	lastName: string;
	accountStatus: string;
	email: string;
	profileImage: string | null;
	stripeCustomerID: string | null;
	planLevel: number;
	pitch: string;
	lookingFor: string;
	inviteCode: string | null;
}

interface Organization {
	createdAt: string;
	domain: string;
	domainVerified: boolean;
	email: string;
	id: string;
	name: string;
	seatCount: number;
	stripeCustomerID: string;
	updatedAt: string;
	logoURL: string;
	domains: OrgDomain[];
	orgSubscription: Subscription[];
}

interface OrgDomain {
	id: string;
	orgID: string;
	domain: string;
}

interface Resume {
	id: string;
	name: string;
	userID: number;
	createdAt: string;
	updatedAt: string;
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

interface SkillData {
	id: string;
	createdAt: string;
	updatedAt: string;
	skillList: string[];
	userID: number;
}

interface MyFingerprint {
	user: { firstName: string; lastName: string; id: string };
	jobs: JobPosition[];
	education: Education[];
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
	CurrentUser,
	BulletPoint,
	Organization,
	Resume,
	SkillData,
	User,
	PrepAnswer,
	AchievementTag,
	JobObject,
	ResumeObject,
	MyFingerprint
};

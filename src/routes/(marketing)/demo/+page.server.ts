export const load = async () => {
	try {
		const achievements = [
			{
				id: 'a8b92e4c-1c92-4b5e-9f89-d5b1e3d18a42',
				userID: 2,
				createdAt: '2025-09-05T14:12:21.000Z',
				updatedAt: '2025-09-20T09:45:33.000Z',
				description: 'Led the redesign of the internal dashboard to improve usability.',
				result: 'Reduced average task completion time by 30%.',
				myContribution: 'Managed UX research and coordinated the design sprint.',
				projectID: null,
				startDate: '2025-08-20T09:00:00.000Z',
				endDate: '2025-09-10T00:00:00.000Z',
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			},
			{
				id: 'e12df90b-5c3b-45cb-9ac7-944e5297ff8b',
				userID: 2,
				createdAt: '2025-09-12T10:05:40.000Z',
				updatedAt: '2025-09-27T15:32:18.000Z',
				description: 'Automated the reporting process for monthly analytics.',
				result: 'Cut report generation time from 3 hours to 10 minutes.',
				myContribution: 'Built and deployed a data pipeline using Python and SQL.',
				projectID: null,
				startDate: '2025-09-01T08:00:00.000Z',
				endDate: '2025-09-15T00:00:00.000Z',
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			},
			{
				id: '6e3d192f-74b3-4213-93ff-7c9d96d51a93',
				userID: 2,
				createdAt: '2025-09-18T13:45:12.000Z',
				updatedAt: '2025-09-28T11:21:59.000Z',
				description: 'Presented a new client proposal for expanding market reach.',
				result: 'Secured a $120K annual contract renewal.',
				myContribution: 'Created the pitch deck and led the presentation.',
				projectID: null,
				startDate: '2025-09-10T10:00:00.000Z',
				endDate: '2025-09-20T00:00:00.000Z',
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			},
			{
				id: 'c37d4812-60ce-48bb-bc94-5533ad98e410',
				userID: 2,
				createdAt: '2025-09-25T18:25:40.000Z',
				updatedAt: '2025-10-02T09:10:22.000Z',
				description: 'Organized a team-wide learning workshop on code quality.',
				result: 'Improved pull request approval rates and reduced bugs by 15%.',
				myContribution: 'Designed the workshop agenda and facilitated the session.',
				projectID: null,
				startDate: '2025-09-22T13:00:00.000Z',
				endDate: '2025-09-24T00:00:00.000Z',
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			}
		];

		const meetings = [
			{
				id: 'ac4b7b12-8df0-4c6f-9e5b-1a0e1cf70a21',
				createdAt: '2025-09-28T14:22:18.000Z',
				updatedAt: '2025-10-01T09:10:03.000Z',
				userID: 2,
				time: '2025-10-10T15:30:00.000Z',
				title: 'Q4 Planning Session',
				type: 'Internal',
				location: 'Conference Room B',
				link: null,
				agenda: 'Discuss quarterly goals, project timelines, and resource allocation.',
				attendees: ['Alex M.', 'Taylor S.', 'Jordan K.'],
				jobAppID: null,
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			},
			{
				id: 'b8d82a63-2b1c-4ec1-96f1-c8bb92714c34',
				createdAt: '2025-09-29T08:45:11.000Z',
				updatedAt: '2025-10-02T12:22:47.000Z',
				userID: 2,
				time: '2025-10-15T18:00:00.000Z',
				title: 'Client Check-In: Nova Systems',
				type: 'External',
				location: null,
				link: 'https://meet.google.com/nova-checkin',
				agenda: 'Review deliverables, confirm next milestones, and gather client feedback.',
				attendees: ['Client: Dana L.', 'Sam R.', 'Chris T.'],
				jobAppID: null,
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			},
			{
				id: 'c1e93ef1-3ef0-4b4e-ae1f-93c2e18b927d',
				createdAt: '2025-10-01T10:32:00.000Z',
				updatedAt: '2025-10-04T09:14:09.000Z',
				userID: 2,
				time: '2025-10-17T13:00:00.000Z',
				title: 'Sprint Review: Week 41',
				type: 'Internal',
				location: 'Zoom',
				link: 'https://zoom.us/j/83219021234',
				agenda: 'Demo completed features, discuss blockers, and plan next sprint.',
				attendees: ['Dev Team', 'Product Owner', 'QA Lead'],
				jobAppID: null,
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			},
			{
				id: 'f35bb20b-cb0e-4a78-9334-1f3c46f08e14',
				createdAt: '2025-10-03T16:20:45.000Z',
				updatedAt: '2025-10-06T11:50:22.000Z',
				userID: 2,
				time: '2025-10-19T21:00:00.000Z',
				title: 'Performance Review Prep',
				type: 'Internal',
				location: 'Office - HR Meeting Room',
				link: null,
				agenda: 'Prepare notes and metrics for upcoming performance review discussion.',
				attendees: ['HR: Morgan D.', 'Team Lead: Jamie R.'],
				jobAppID: null,
				jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
				educationID: null
			}
		];
		return { achievements: achievements ?? [], meetings: meetings ?? [] };
	} catch (error) {
		console.error(error);
	}
};

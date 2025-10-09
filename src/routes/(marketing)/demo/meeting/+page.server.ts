export const load = async () => {
	try {
		const jobs = [
			{
				id: 'a01e36df-83b8-4c1a-bd4c-9c18c97a217b',
				userID: 2,
				createdAt: '2025-07-15T10:23:44.000Z',
				updatedAt: '2025-09-26T02:10:12.000Z',
				name: 'Software Engineer',
				description: 'Worked on backend systems and API integrations.',
				startDate: '2024-11-10T04:00:00.000Z',
				endDate: '2025-09-01T04:00:00.000Z',
				currentPosition: false,
				company: 'NextLogic',
				location: 'Berlin, Germany',
				achievements: [
					{
						id: 'e33e2ed1-0d84-4d71-8db5-dfdc9b1e5437',
						userID: 2,
						createdAt: '2025-02-20T10:10:00.000Z',
						updatedAt: '2025-09-20T10:10:00.000Z',
						description: 'Optimized data API endpoints.',
						result: 'Improved performance by 40%.',
						myContribution: 'Refactored service logic and caching strategy.',
						projectID: null,
						startDate: '2025-02-01T10:00:00.000Z',
						endDate: '2025-02-15T10:00:00.000Z',
						jobPositionID: 'a01e36df-83b8-4c1a-bd4c-9c18c97a217b',
						educationID: null
					},
					{
						id: '7f51dbf4-2dc1-4e3b-b5f0-6c2a841df4b3',
						userID: 2,
						createdAt: '2025-04-18T09:12:00.000Z',
						updatedAt: '2025-09-10T09:12:00.000Z',
						description: 'Implemented CI/CD pipelines.',
						result: 'Reduced deployment time from 30 minutes to 5.',
						myContribution: 'Set up GitHub Actions workflows and rollback safety.',
						projectID: null,
						startDate: '2025-03-01T10:00:00.000Z',
						endDate: '2025-03-20T10:00:00.000Z',
						jobPositionID: 'a01e36df-83b8-4c1a-bd4c-9c18c97a217b',
						educationID: null
					}
				],
				bulletPoints: [
					{
						text: 'Developed and maintained backend microservices.',
						id: 'b12f10b2-4f45-48ea-b3fa-bc6a9ab12e20'
					},
					{
						text: 'Collaborated cross-functionally with frontend and design teams.',
						id: 'a783f1b7-df93-481c-b9f9-41f4a6c2851a'
					}
				]
			},
			{
				id: 'd43b9b71-3a3d-4b0e-84c4-26d8c50f5e1f',
				userID: 2,
				createdAt: '2025-06-01T12:00:00.000Z',
				updatedAt: '2025-09-20T15:00:00.000Z',
				name: 'Marketing Coordinator',
				description: 'Planned and executed digital marketing campaigns.',
				startDate: '2025-01-05T04:00:00.000Z',
				endDate: '2025-08-15T04:00:00.000Z',
				currentPosition: false,
				company: 'BrightScale Media',
				location: 'Austin, Texas',
				achievements: [
					{
						id: 'fcfca51d-b1a2-43f0-8e48-bd12d323ee2f',
						userID: 2,
						createdAt: '2025-03-10T10:00:00.000Z',
						updatedAt: '2025-09-10T10:00:00.000Z',
						description: 'Launched a successful social campaign.',
						result: 'Increased engagement by 55%.',
						myContribution: 'Managed creative and scheduling strategy.',
						projectID: null,
						startDate: '2025-02-10T10:00:00.000Z',
						endDate: '2025-02-25T10:00:00.000Z',
						jobPositionID: 'd43b9b71-3a3d-4b0e-84c4-26d8c50f5e1f',
						educationID: null
					}
				],
				bulletPoints: [
					{
						text: 'Coordinated influencer collaborations.',
						id: '9a85e438-343f-4f47-9705-05a4d3e94388'
					},
					{
						text: 'Optimized content calendar based on engagement data.',
						id: 'c3de95d0-b847-4903-a1cc-f46d28362c02'
					}
				]
			},
			{
				id: 'f1b9b8dc-8f1e-41dc-9c45-8d4a6bb3141c',
				userID: 2,
				createdAt: '2025-05-12T09:00:00.000Z',
				updatedAt: '2025-09-15T18:00:00.000Z',
				name: 'Operations Manager',
				description: 'Oversaw daily logistics and vendor relations.',
				startDate: '2023-11-01T04:00:00.000Z',
				endDate: '2025-05-01T04:00:00.000Z',
				currentPosition: false,
				company: 'LogiTrans',
				location: 'Rotterdam, Netherlands',
				achievements: [
					{
						id: 'a3c84910-9b44-4d20-bf7e-41a9468b0913',
						userID: 2,
						createdAt: '2025-04-05T12:00:00.000Z',
						updatedAt: '2025-09-05T12:00:00.000Z',
						description: 'Negotiated cost reductions with suppliers.',
						result: 'Saved the company 12% annually on logistics expenses.',
						myContribution: 'Led supplier contract renegotiations.',
						projectID: null,
						startDate: '2025-03-10T10:00:00.000Z',
						endDate: '2025-03-25T10:00:00.000Z',
						jobPositionID: 'f1b9b8dc-8f1e-41dc-9c45-8d4a6bb3141c',
						educationID: null
					}
				],
				bulletPoints: [
					{
						text: 'Implemented new logistics tracking system.',
						id: 'c19f1db6-648f-4c28-8787-0c8ac88d7f1e'
					},
					{ text: 'Reduced delivery delays by 20%.', id: 'ea1f125b-bce7-4ef1-9b1e-c8e2b9cbf9cb' }
				]
			},
			{
				id: 'e4a7d80d-d42f-42cb-8b2d-1e74a9b23f5e',
				userID: 2,
				createdAt: '2025-08-01T11:30:00.000Z',
				updatedAt: '2025-09-25T09:45:00.000Z',
				name: 'Truck Driver',
				description: 'Handled long-haul deliveries across Europe.',
				startDate: '2025-02-01T04:00:00.000Z',
				endDate: '2025-08-01T04:00:00.000Z',
				currentPosition: false,
				company: 'EuroFreight',
				location: 'Hamburg, Germany',
				achievements: [
					{
						id: '65f4e210-b2b2-463c-b8f9-8e3af353e3a4',
						userID: 2,
						createdAt: '2025-04-10T11:00:00.000Z',
						updatedAt: '2025-09-10T11:00:00.000Z',
						description: 'Completed 100% of deliveries on time for three consecutive months.',
						result: 'Received internal recognition for reliability.',
						myContribution: 'Planned efficient routes and pre-trip inspections.',
						projectID: null,
						startDate: '2025-04-01T10:00:00.000Z',
						endDate: '2025-04-30T10:00:00.000Z',
						jobPositionID: 'e4a7d80d-d42f-42cb-8b2d-1e74a9b23f5e',
						educationID: null
					}
				],
				bulletPoints: [
					{
						text: 'Managed delivery schedules across multiple EU countries.',
						id: 'bb13a5f0-bd0b-4a7b-bd8b-30101d26977b'
					},
					{
						text: 'Maintained excellent safety and inspection records.',
						id: 'ce552f72-4f58-4a3a-9447-ef32e3279a6c'
					}
				]
			}
		];

		const highlights = [
			{
				id: '2d9c5029-a8b1-43b4-9035-c80ef5f76820',
				createdAt: '2025-09-12T00:31:40.603Z',
				updatedAt: '2025-09-12T00:31:40.603Z',
				userID: 2,
				text: 'my meeting agenda',
				meetingID: '3fa10315-26b5-4b81-be06-e41aaa8f1ebb',
				notes: [
					{
						id: '96e5d83b-67fa-4f89-8d14-abd86c1d03db',
						createdAt: '2025-09-12T00:31:40.615Z',
						updatedAt: '2025-09-12T00:31:40.615Z',
						userID: 2,
						note: 'Highlight text',
						meetingID: '3fa10315-26b5-4b81-be06-e41aaa8f1ebb',
						highlightID: '2d9c5029-a8b1-43b4-9035-c80ef5f76820'
					}
				],
				achievements: [
					{
						id: '9742eacf-02d5-4d67-9e9e-107bf794714c',
						userID: 2,
						createdAt: '2025-09-10T02:05:51.206Z',
						updatedAt: '2025-09-26T16:09:53.406Z',
						description: 'I was doing a thing',
						result: '',
						myContribution: 'Someting',
						projectID: null,
						startDate: '2025-09-24T16:09:53.375Z',
						endDate: '2025-09-25T00:00:00.000Z',
						jobPositionID: '30537c78-1483-48d6-acdb-62a1a7d11a11',
						educationID: null
					}
				]
			},
			{
				id: 'b4a5326f-983a-421b-b3c7-bbb0845b1f22',
				createdAt: '2025-09-20T15:14:10.000Z',
				updatedAt: '2025-09-20T15:14:10.000Z',
				userID: 2,
				text: 'Key takeaways from the client update meeting.',
				meetingID: 'b8d82a63-2b1c-4ec1-96f1-c8bb92714c34',
				notes: [
					{
						id: 'c6a32e9b-97f1-42dd-b52b-00a8e74f3b19',
						createdAt: '2025-09-20T15:16:45.000Z',
						updatedAt: '2025-09-20T15:16:45.000Z',
						userID: 2,
						note: 'Client wants faster delivery turnaround next sprint.',
						meetingID: 'b8d82a63-2b1c-4ec1-96f1-c8bb92714c34',
						highlightID: 'b4a5326f-983a-421b-b3c7-bbb0845b1f22'
					}
				],
				achievements: [
					{
						id: 'a8b92e4c-1c92-4b5e-9f89-d5b1e3d18a42',
						userID: 2,
						createdAt: '2025-09-05T14:12:21.000Z',
						updatedAt: '2025-09-20T09:45:33.000Z',
						description: 'Led the redesign of the internal dashboard.',
						result: 'Reduced task completion time by 30%.',
						myContribution: 'Coordinated design sprint and usability testing.',
						projectID: null,
						startDate: '2025-08-20T09:00:00.000Z',
						endDate: '2025-09-10T00:00:00.000Z',
						jobPositionID: 'a01e36df-83b8-4c1a-bd4c-9c18c97a217b',
						educationID: null
					}
				]
			},
			{
				id: 'c91d9127-60b0-453a-a0f9-d91b6dc49ef7',
				createdAt: '2025-09-25T13:10:30.000Z',
				updatedAt: '2025-09-25T13:10:30.000Z',
				userID: 2,
				text: 'Discussed project blockers during sprint review.',
				meetingID: 'c1e93ef1-3ef0-4b4e-ae1f-93c2e18b927d',
				notes: [
					{
						id: 'f21b89e2-0af0-4cb5-bffb-b44b1a6a1c44',
						createdAt: '2025-09-25T13:12:00.000Z',
						updatedAt: '2025-09-25T13:12:00.000Z',
						userID: 2,
						note: 'Backend deployment delayed due to CI errors.',
						meetingID: 'c1e93ef1-3ef0-4b4e-ae1f-93c2e18b927d',
						highlightID: 'c91d9127-60b0-453a-a0f9-d91b6dc49ef7'
					}
				],
				achievements: [
					{
						id: 'e12df90b-5c3b-45cb-9ac7-944e5297ff8b',
						userID: 2,
						createdAt: '2025-09-12T10:05:40.000Z',
						updatedAt: '2025-09-27T15:32:18.000Z',
						description: 'Automated reporting pipeline.',
						result: 'Reduced report generation time from 3 hours to 10 minutes.',
						myContribution: 'Developed and deployed automation scripts.',
						projectID: null,
						startDate: '2025-09-01T08:00:00.000Z',
						endDate: '2025-09-15T00:00:00.000Z',
						jobPositionID: 'a01e36df-83b8-4c1a-bd4c-9c18c97a217b',
						educationID: null
					}
				]
			},
			{
				id: 'df8179e5-68c0-4660-9a65-5f55a021d72e',
				createdAt: '2025-09-29T09:20:00.000Z',
				updatedAt: '2025-09-29T09:20:00.000Z',
				userID: 2,
				text: 'Performance review preparation notes.',
				meetingID: 'f35bb20b-cb0e-4a78-9334-1f3c46f08e14',
				notes: [
					{
						id: 'f3e4a918-4c7d-4e45-9ef1-d969fc7b98ff',
						createdAt: '2025-09-29T09:21:00.000Z',
						updatedAt: '2025-09-29T09:21:00.000Z',
						userID: 2,
						note: 'Mention successful process automation from Q3.',
						meetingID: 'f35bb20b-cb0e-4a78-9334-1f3c46f08e14',
						highlightID: 'df8179e5-68c0-4660-9a65-5f55a021d72e'
					}
				],
				achievements: [
					{
						id: '6e3d192f-74b3-4213-93ff-7c9d96d51a93',
						userID: 2,
						createdAt: '2025-09-18T13:45:12.000Z',
						updatedAt: '2025-09-28T11:21:59.000Z',
						description: 'Presented client proposal for new market expansion.',
						result: 'Secured $120K contract renewal.',
						myContribution: 'Created pitch deck and led client meeting.',
						projectID: null,
						startDate: '2025-09-10T10:00:00.000Z',
						endDate: '2025-09-20T00:00:00.000Z',
						jobPositionID: 'a01e36df-83b8-4c1a-bd4c-9c18c97a217b',
						educationID: null
					}
				]
			}
		];

		const notes = [
			{
				id: '2a8452c1-9b6e-4a6f-bf6e-91d1f9e56a23',
				createdAt: '2025-09-12T14:22:18.104Z',
				updatedAt: '2025-09-12T14:22:18.104Z',
				userID: 2,
				note: 'Discussed key project milestones and next steps.'
			},
			{
				id: '4f09a8db-b36d-40cb-b9a1-2e0a7dcf2f7e',
				createdAt: '2025-09-15T09:48:33.219Z',
				updatedAt: '2025-09-15T09:48:33.219Z',
				userID: 2,
				note: 'Clarified task ownership and adjusted delivery timelines.'
			},
			{
				id: '7cb1d8f4-faf1-4e8e-bb09-d3e7b0e86f9c',
				createdAt: '2025-09-18T16:11:05.752Z',
				updatedAt: '2025-09-18T16:11:05.752Z',
				userID: 2,
				note: 'Noted feedback from the client on presentation updates.'
			},
			{
				id: 'db3f2b71-2d8e-4c1a-84a4-6f36a2c523c5',
				createdAt: '2025-09-21T20:37:42.987Z',
				updatedAt: '2025-09-21T20:37:42.987Z',
				userID: 2,
				note: 'Outlined next meeting agenda topics and action items.'
			}
		];

		const questions = [
			{
				id: '6b2dfaf9-2d4b-4d3e-8e3c-f41c5a5a8b7b',
				createdAt: '2025-09-10T14:22:31.208Z',
				updatedAt: '2025-09-10T14:22:31.208Z',
				answer:
					'I’m excited about this role because it aligns with my skills and long-term career goals.',
				userID: 2,
				questionID: 'f2383f91-5b56-4c19-9f5f-6b8d4a7ac011',
				jobApplicationID: '23c0a859-aef0-4428-9431-0a4e47f28fc6',
				meetingID: '629f0c91-b848-4b8b-aca2-dc7814f9b383',
				question: {
					id: 'f2383f91-5b56-4c19-9f5f-6b8d4a7ac011',
					createdAt: '2025-07-11T23:18:10.504Z',
					updatedAt: '2025-07-11T23:18:10.504Z',
					question: 'Why are you interested in this position?',
					key: 'why-position',
					displayOn: ['Interview'],
					order: 2
				}
			},
			{
				id: 'de9a7d38-5b3f-44a4-a8a7-19b812edb31f',
				createdAt: '2025-09-10T14:25:12.419Z',
				updatedAt: '2025-09-10T14:25:12.419Z',
				answer: 'My strengths include adaptability, teamwork, and problem-solving under pressure.',
				userID: 2,
				questionID: '93b8ef6a-02d3-4b59-b0d7-35fdb41c9d2b',
				jobApplicationID: '23c0a859-aef0-4428-9431-0a4e47f28fc6',
				meetingID: '629f0c91-b848-4b8b-aca2-dc7814f9b383',
				question: {
					id: '93b8ef6a-02d3-4b59-b0d7-35fdb41c9d2b',
					createdAt: '2025-07-11T23:19:55.702Z',
					updatedAt: '2025-07-11T23:19:55.702Z',
					question: 'What are your greatest strengths?',
					key: 'strengths',
					displayOn: ['Interview'],
					order: 3
				}
			}
		];

		return { jobs, highlights, notes, questions };
	} catch (error) {
		console.error(error);
	}
};

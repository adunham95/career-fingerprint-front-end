<script>
	import Accordion from '$lib/Components/Accordion.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import { formatDate } from '$lib/Utils/formatDate';

	let current = $state('resume');

	let placeholderJobs = [
		{
			id: '1',
			name: 'Software Engineer',
			company: 'TechNova',
			description: 'Developed full-stack applications using React and Node.js.',
			location: 'San Francisco, CA',
			startDate: '2021-06-01',
			endDate: null,
			currentPosition: true
		},
		{
			id: '2',
			name: 'Frontend Developer',
			company: 'PixelCraft',
			description: 'Built responsive UI components and improved performance across web apps.',
			location: 'Remote',
			startDate: '2020-01-15',
			endDate: '2021-05-30',
			currentPosition: false
		},
		{
			id: '3',
			name: 'Software Engineering Intern',
			company: 'InnoSoft',
			description: 'Assisted with backend development and wrote unit tests.',
			location: 'Austin, TX',
			startDate: '2019-06-01',
			endDate: '2019-08-31',
			currentPosition: false
		},
		{
			id: '4',
			name: 'Technical Support Specialist',
			company: 'NetAssist',
			description: 'Provided customer support and resolved technical issues.',
			location: 'Chicago, IL',
			startDate: '2018-03-01',
			endDate: '2019-05-01',
			currentPosition: false
		},
		{
			id: '5',
			name: 'Junior Web Developer',
			company: 'BrightByte',
			description: 'Maintained company website and implemented new features.',
			location: 'New York, NY',
			startDate: '2017-07-01',
			endDate: '2018-02-28',
			currentPosition: false
		}
	];

	const placeholderEducation = [
		{
			id: '1',
			institution: 'Western Carolina University',
			degree: 'Computer engineering',
			startDate: '2013-08-23',
			endDate: '2017-05-23',
			currentPosition: false,
			description: 'Learned computers'
		}
	];

	const placeholderProjects = [
		{
			id: 'p1',
			name: 'Internal Dashboard Revamp',
			description:
				'Redesigned and rebuilt the company’s internal admin dashboard using React and Tailwind CSS.',
			jobID: '1',
			job: {
				id: '1',
				name: 'Software Engineer',
				company: 'TechNova',
				description: 'Developed full-stack applications using React and Node.js.',
				location: 'San Francisco, CA',
				startDate: '2021-06-01',
				endDate: null,
				currentPosition: true
			}
		},
		{
			id: 'p2',
			name: 'Customer Analytics Tool',
			description:
				'Developed a single-page application to visualize customer behavior and sales trends.',
			jobID: '2',
			job: {
				id: '2',
				name: 'Frontend Developer',
				company: 'PixelCraft',
				description: 'Built responsive UI components and improved performance across web apps.',
				location: 'Remote',
				startDate: '2020-01-15',
				endDate: '2021-05-30',
				currentPosition: false
			}
		},
		{
			id: 'p3',
			name: 'API Testing Automation',
			description:
				'Created automated test scripts for backend APIs using Jest and Postman during the internship program.',
			jobID: '3',
			job: {
				id: '3',
				name: 'Software Engineering Intern',
				company: 'InnoSoft',
				description: 'Assisted with backend development and wrote unit tests.',
				location: 'Austin, TX',
				startDate: '2019-06-01',
				endDate: '2019-08-31',
				currentPosition: false
			}
		}
	];
</script>

<PageContainer className="py-2">
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:grid-rows-2">
		<div class="flex flex-col gap-2">
			<Label label="Take Notes" />
			<TextInput id="title" label="Title" hideLabel placeholder="Note Title" />
			<TextArea id="note" label="Note" hideLabel placeholder="Note" />
			<div class="flex justify-end">
				<button class="btn btn-text--primary">Add Note</button>
			</div>
		</div>
		<div class="block space-y-2 md:hidden">
			<h3 class="font-title">Assign To Job</h3>
			<Select
				label="Current Job Applications"
				id="jobApplicaiton"
				value=""
				options={[
					{ id: 'johndeere-sse', label: 'John Deere - Senior Software Engineer' },
					{ id: 'riv-sse', label: 'Rivian - Senior Software Engineer' }
				]}
			/>
			<Label id="jobDetails" label="Job details" />
			<TextInput id="jobTitle" label="Job Title" placeholder="Job Title" hideLabel />
			<TextArea id="jobDescription" label="Job Description" placeholder="Description" hideLabel />
			<div class="flex justify-end">
				<button class="btn btn-text--primary">Save</button>
			</div>
		</div>
		<div class="  row-span-2">
			<NavPillButtons
				bind:currentTab={current}
				tabs={[
					{ id: 'details', label: 'Job Details' },
					{ id: 'resume', label: 'Resume' },
					{ id: 'achievements', label: 'Achievements' },
					{ id: 'projects', label: 'Projects' },
					{ id: 'notes', label: 'Notes' }
				]}
			/>
			<div class="overflow-y-auto px-1 py-1 md:max-h-[600px]">
				{#if current === 'resume'}
					<ul class="space-y-2">
						{#each placeholderJobs as job}
							<Card size="sm" headline={`${job.name} | ${job.company}`}>
								<h5>
									{formatDate(job.startDate)} - {job.currentPosition
										? 'Current'
										: formatDate(job.endDate)}
								</h5>
								<p>{job.description}</p>
							</Card>
						{/each}
						{#each placeholderEducation as edu}
							<Card size="sm" headline={`${edu.degree} | ${edu.institution}`}>
								<h5>
									{formatDate(edu.startDate)} - {edu.currentPosition
										? 'Current'
										: formatDate(edu.endDate)}
								</h5>
								<p>{edu.description}</p>
							</Card>
						{/each}
					</ul>
				{:else if current === 'achievements'}
					<ul class="list-inside list-disc">
						<li>Led the refactoring of a legacy codebase, reducing technical debt by 40%.</li>
						<li>
							Designed and implemented a microservice that improved system scalability and reduced
							load time by 25%.
						</li>
						<li>
							Migrated a monolithic architecture to a microservices-based architecture using Docker
							and Kubernetes.
						</li>
						<li>Developed a new user-facing feature that increased customer engagement by 30%.</li>
						<li>Contributed to a core product used by over 500,000 monthly active users.</li>
					</ul>
				{:else if current === 'projects'}
					<ul class="space-y-2">
						{#each placeholderProjects as prj}
							<Card size="sm" headline={prj.name}>
								<div class="flex">
									<p class="badge badge--secondary">{prj.job.name} | {prj.job.company}</p>
								</div>
								<p>{prj.description}</p>
							</Card>
						{/each}
					</ul>
				{:else if current === 'notes'}
					<Card size="sm">
						<p>This is a note</p>
					</Card>
				{/if}
			</div>
		</div>
		<div class="hidden flex-col gap-2 md:flex">
			<h3 class="font-title">Assign To Job</h3>
			<Select
				label="Current Job Applications"
				id="jobApplicaiton"
				value=""
				options={[
					{ id: 'johndeere-sse', label: 'John Deere - Senior Software Engineer' },
					{ id: 'riv-sse', label: 'Rivian - Senior Software Engineer' }
				]}
			/>
			<Label id="jobDetails" label="Job details" />
			<TextInput id="jobTitle" label="Job Title" placeholder="Job Title" hideLabel />
			<TextArea id="jobDescription" label="Job Description" placeholder="Description" hideLabel />
			<div class="flex justify-end">
				<button class="btn btn-text--primary">Save</button>
			</div>
		</div>
	</div>
</PageContainer>

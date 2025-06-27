<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import Accordion from '$lib/Components/Accordion.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import AutogrowTextInput from '$lib/Components/FormElements/AutogrowTextInput.svelte';
	import DateInput from '$lib/Components/FormElements/DateInput.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import Toggle from '$lib/Components/FormElements/Toggle.svelte';
	import BasicResume from '$lib/Components/Resumes/BasicResume.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import type { JobPosition } from '../../../../app.js';

	const { data } = $props();

	console.log(data);

	let resumeName = $state(data.resume.name);

	let personalInfo = $state({
		firstName: data.resume.firstName || data.user.firstName,
		lastName: data.resume.lastName || data.user.lastName,
		title: data.resume.title,
		email: data.resume.contactEmail || data.user.email,
		phoneNumber: data.resume.phoneNumber,
		location: data.resume.location,
		website: data.resume.website,
		linkedin: data.resume.linkedIn,
		github: data.resume.github,
		summary: data.resume.summary || data.user.pitch || ''
	});

	let jobs = $state(data.jobs);

	const experience = [
		{
			company: 'Tech Innovations Inc.',
			position: 'Senior Software Engineer',
			duration: 'Jan 2020 - Present',
			location: 'San Francisco, CA',
			description:
				"Lead developer for the company's flagship product, managing a team of 5 engineers.",
			achievements: [
				'Redesigned the architecture resulting in 40% performance improvement',
				'Implemented CI/CD pipeline reducing deployment time by 60%',
				'Mentored 3 junior developers who were promoted within a year',
				'Redesigned the architecture resulting in 40% performance improvement',
				'Implemented CI/CD pipeline reducing deployment time by 60%',
				'Mentored 3 junior developers who were promoted within a year',
				'Redesigned the architecture resulting in 40% performance improvement',
				'Implemented CI/CD pipeline reducing deployment time by 60%',
				'Mentored 3 junior developers who were promoted within a year',
				'Redesigned the architecture resulting in 40% performance improvement',
				'Implemented CI/CD pipeline reducing deployment time by 60%',
				'Mentored 3 junior developers who were promoted within a year'
			]
		},
		{
			company: 'DataSoft Solutions',
			position: 'Software Engineer',
			duration: 'Mar 2017 - Dec 2019',
			location: 'Seattle, WA',
			description: 'Full-stack developer working on enterprise data management solutions.',
			achievements: [
				'Developed RESTful APIs serving 10,000+ daily users',
				'Optimized database queries resulting in 30% faster load times',
				'Contributed to open-source libraries used by the company'
			]
		},
		{
			company: 'StartUp Ventures',
			position: 'Junior Developer',
			duration: 'Jun 2015 - Feb 2017',
			location: 'Portland, OR',
			description: 'Worked on front-end development for various client projects.',
			achievements: [
				'Built responsive web applications using React',
				'Collaborated with designers to implement pixel-perfect UIs',
				'Participated in code reviews and quality assurance'
			]
		}
	];

	const education = [
		{
			id: '1',
			institution: 'University of California, Berkeley',
			degree: 'Master of Science in Computer Science',
			duration: '2013 - 2015',
			description: 'Focused on distributed systems and machine learning.'
		},
		{
			id: '2',
			institution: 'Oregon State University',
			degree: 'Bachelor of Science in Computer Science',
			duration: '2009 - 2013',
			description: "Minor in Mathematics. Dean's List for 6 semesters."
		}
	];

	async function updateResumeName() {
		const url = `${PUBLIC_API_URL}/resume/${data.resume.id}`;

		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				name: resumeName
			})
		});

		if (res.ok) {
			toastStore.show({
				type: 'success',
				message: `Resume Updated`
			});
		}
	}

	async function updateResume() {
		const url = `${PUBLIC_API_URL}/resume/${data.resume.id}`;

		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(personalInfo)
		});

		if (res.ok) {
			toastStore.show({
				type: 'success',
				message: `Resume Updated`
			});
		}
	}

	const typeMap = {
		education: 'Education',
		'job-positions': 'Job'
	};

	async function addObject(type: keyof typeof typeMap) {
		const url = `${PUBLIC_API_URL}/${type}`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			}
		});

		if (res.ok) {
			toastStore.show({
				type: 'success',
				message: `${typeMap[type]} Added`
			});
			switch (type) {
				case 'job-positions':
					const newJob: JobPosition = await res.json();

					jobs?.push(newJob);

					break;
				default:
					break;
			}
		} else {
			toastStore.show({
				type: 'error',
				message: `${typeMap[type]} Added`
			});
		}
	}

	async function deleteObject(type: keyof typeof typeMap, id: string) {
		const url = `${PUBLIC_API_URL}/${type}/${id}`;

		const res = await fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			}
		});

		if (res.ok) {
			toastStore.show({
				type: 'success',
				message: `${typeMap[type]} Deleted`
			});
			switch (type) {
				case 'job-positions':
					const newJob: JobPosition = await res.json();

					jobs = jobs?.filter((j) => j.id !== newJob.id);

					break;
				default:
					break;
			}
		} else {
			toastStore.show({
				type: 'error',
				message: `${typeMap[type]} Added`
			});
		}
	}

	function getObjectData(type: keyof typeof typeMap, item: JobPosition) {
		switch (type) {
			case 'job-positions':
				const { name, company, location, description, startDate, endDate, currentPosition } = item;
				return {
					name,
					company,
					location,
					description,
					startDate: startDate ? new Date(startDate).toISOString() : null,
					endDate: endDate ? new Date(endDate).toISOString() : null,
					currentPosition
				};

			default:
				return {};
		}
	}

	async function saveObject(type: keyof typeof typeMap, item: JobPosition) {
		const url = `${PUBLIC_API_URL}/${type}/${item.id}`;

		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(getObjectData(type, item))
		});

		if (res.ok) {
			toastStore.show({
				type: 'success',
				message: `${typeMap[type]} saved`
			});
			switch (type) {
				case 'job-positions':
					break;
				default:
					break;
			}
		} else {
			toastStore.show({
				type: 'error',
				message: `${typeMap[type]} Added`
			});
		}
	}
</script>

<PageContainer>
	<div class="pt-6">
		<AutogrowTextInput
			label="Resume Name"
			id="resumeName"
			bind:value={resumeName}
			placeholder="Untitled Resume"
			textSize="text-3xl"
			onblur={updateResumeName}
		/>
	</div>
	<div class="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
		<div class="col-span-1">
			<Accordion title="Profile">
				<Card contentClassName="space-y-2 px-4 py-4">
					<TextInput id="firstName" label="First Name" bind:value={personalInfo.firstName} />
					<TextInput id="lastName" label="Last Name" bind:value={personalInfo.lastName} />
					<TextInput
						id="contactEmail"
						label="Contact Email"
						type="email"
						bind:value={personalInfo.email}
					/>
					<TextInput id="phone" label="Phone" type="phone" bind:value={personalInfo.phoneNumber} />
					<TextInput id="location" label="Location" bind:value={personalInfo.location} />
					<TextInput id="website" label="Website" bind:value={personalInfo.website} />
					<TextInput id="linkedin" label="Linkedin" bind:value={personalInfo.linkedin} />
					<TextArea id="summary" label="Summary" bind:value={personalInfo.summary} />
					{#snippet actions()}
						<button class="btn btn-text--success btn-small" onclick={updateResume}>Save</button>
					{/snippet}
				</Card>
			</Accordion>
			<Accordion title="Jobs">
				{#snippet actions()}
					<button
						class="btn btn-outline--accent btn-small"
						onclick={() => addObject('job-positions')}>Add Job</button
					>
				{/snippet}
				<div class="space-y-4">
					{#each jobs || [] as job, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<TextInput id={'title' + idx} label="Title" bind:value={job.name} />
							<TextInput id={'company' + idx} label="Company" bind:value={job.company} />
							<TextInput id={'location' + idx} label="Location" bind:value={job.location} />
							<Toggle label="Current Job" bind:checked={job.currentPosition} />
							<DateInput id={'startDate' + idx} label="Start Date" bind:value={job.startDate} />
							{#if !job.currentPosition}
								<DateInput id={'endDate' + idx} label="End Date" bind:value={job.endDate} />
							{/if}
							<TextArea
								id={'description' + idx}
								label="Basic Description"
								bind:value={job.description}
							></TextArea>
							{#snippet actions()}
								<button
									class="btn btn-text--error btn-small"
									onclick={() => deleteObject('job-positions', job.id)}>Delete</button
								>
								<!-- <button class="btn btn-text--success btn-small">Save For This Resume</button> -->
								<button
									class="btn btn-text--success btn-small"
									onclick={() => saveObject('job-positions', job)}>Save</button
								>
							{/snippet}
						</Card>
					{/each}
				</div>
			</Accordion>
			<Accordion title="Education">
				{#snippet actions()}
					<button class="btn btn-outline--accent btn-small" onclick={() => addObject('education')}
						>Add Education</button
					>
				{/snippet}
				<div class="space-y-2 rounded border border-gray-300 p-4">
					<TextInput id="firstName" label="First Name" />
				</div>
			</Accordion>
			<p class="mt-4 text-gray-600">Download PDF version or print this resume</p>
			<button class="btn btn--primary mt-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 inline h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Download Resume
			</button>
		</div>
		<div class="md:col-span-2">
			<BasicResume {personalInfo} experience={jobs} {education} />
		</div>
	</div>
</PageContainer>

<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from '../steps.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import CheckCards from '$lib/Components/FormElements/CheckCards.svelte';
	import { onMount } from 'svelte';

	let text = $state();

	onMount(() => {
		document.addEventListener('mouseup', () => {
			let selText = window?.getSelection()?.toString();
			if (selText !== '') {
				text = selText;
			}
		});
	});

	const { data } = $props();

	console.log({ data });
</script>

<!-- Highlights -->

<PageContainer>
	<StepList currentStep={1} steps={getSteps(data.meetingID)} />
	<div class="mt-8 flex justify-between">
		<h1 class="font-title text-2xl">Meeting Details</h1>
		<div>
			<a href={`/prep/${data.meetingID}`} class="btn btn-text--primary">Prev Step</a>
			<a href={`/prep/${data.meetingID}/research`} class="btn btn-text--primary">Next Step</a>
		</div>
	</div>
	<div class="grid grid-cols-2 pt-2">
		<div>
			<p>
				<strong>Location:</strong> Remote / Hybrid / On-site (City, State)<br />
				<strong>Employment Type:</strong> Full-Time<br />
				<strong>Department:</strong> Engineering
			</p>

			<h2>About the Role</h2>
			<p class="bg-opacity-10 hover:bg-green-100">
				We are seeking a talented and motivated Software Developer to join our growing engineering
				team. As a Software Developer, you will be responsible for designing, developing, and
				maintaining high-quality software solutions that help solve real-world problems for our
				users.
			</p>

			<h2>Key Responsibilities</h2>
			<ul>
				<li>Design, develop, test, and deploy scalable and efficient code</li>
				<li>Collaborate with cross-functional teams to define and deliver new features</li>
				<li>Troubleshoot and resolve software defects and performance issues</li>
				<li>Write clean, well-documented, and maintainable code</li>
				<li>Participate in code reviews and provide constructive feedback</li>
			</ul>

			<h2>Requirements</h2>
			<ul>
				<li>Bachelor’s degree in Computer Science or a related field (or equivalent experience)</li>
				<li>
					Proficiency in one or more programming languages (e.g., JavaScript, Python, Java, C#)
				</li>
				<li>Experience with web frameworks and RESTful APIs</li>
				<li>Familiarity with version control systems (e.g., Git)</li>
				<li>Strong problem-solving and communication skills</li>
			</ul>

			<h2>Preferred Qualifications</h2>
			<ul>
				<li>Experience with cloud platforms like AWS, Azure, or GCP</li>
				<li>Knowledge of Agile development methodologies</li>
				<li>Contributions to open source projects or a strong developer portfolio</li>
			</ul>

			<h2>What We Offer</h2>
			<ul>
				<li>Competitive salary and benefits</li>
				<li>Flexible work hours and remote work options</li>
				<li>Professional development opportunities</li>
				<li>Collaborative and inclusive company culture</li>
			</ul>

			<p>
				<strong>To Apply:</strong> Please submit your resume and a brief cover letter outlining your
				experience and interest in the role to
				<a href="mailto:careers@example.com">careers@example.com</a>.
			</p>
		</div>
		<div>
			{#if text}
				<blockquote>
					<Card>
						{text}
					</Card>
				</blockquote>
				<CheckCards
					value=""
					options={[
						{
							id: '1',
							label: 'Led the refactoring of a legacy codebase, reducing technical debt by 40%.'
						},
						{
							id: '1',
							label:
								'Designed and implemented a microservice that improved system scalability and reduced load time by 25%.'
						},
						{
							id: '1',
							label:
								'Migrated a monolithic architecture to a microservices-based architecture using Docker andKubernetes.'
						},
						{
							id: '1',
							label:
								'Developed a new user-facing feature that increased customer engagement by 30%.'
						},
						{
							id: '1',
							label: 'Contributed to a core product used by over 500,000 monthly active users.'
						}
					]}
				/>
			{/if}
		</div>
	</div>
</PageContainer>

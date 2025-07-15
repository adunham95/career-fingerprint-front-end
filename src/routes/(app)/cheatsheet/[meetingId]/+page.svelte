<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { formatDate } from '$lib/Utils/formatDate';

	const { data } = $props();

	console.log({ data });
	let currentNote = $state('');
	let showMeetingDetails = $state(false);

	let selectedCompany = $state<string | null>(null);

	async function saveNote() {
		const url = `${PUBLIC_API_URL}/notes`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				note: currentNote,
				meetingID: data.meetingID,
				jobAppID: selectedCompany
			})
		});

		if (res.ok) {
			toastStore.show({ message: 'Note Save', type: 'success' });
			currentNote = '';
		}
	}

	let current = $state('resume');
</script>

<PageContainer className="py-2">
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:grid-rows-2">
		<div class="flex flex-col gap-2">
			<div class="pt-2 md:flex md:items-center md:justify-between">
				<div class="min-w-0 flex-1">
					<h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
						Meeting Cheat Sheet
					</h2>
				</div>
				<div class="mt-4 flex md:mt-0 md:ml-4">
					<button type="button" class="btn btn--primary" onclick={() => (showMeetingDetails = true)}
						>Finish Meeting</button
					>
				</div>
			</div>
			<Label label="Take Notes" />
			<TextArea
				id="note"
				label="Note"
				hideLabel
				placeholder="Note"
				rows={4}
				bind:value={currentNote}
			/>
			<div class="flex justify-end">
				<button class="btn btn-text--primary" onclick={saveNote}>Add Note</button>
			</div>
		</div>
		<div class="  row-span-2">
			<NavPillButtons
				bind:currentTab={current}
				tabs={[
					{ id: 'details', label: 'Job Details' },
					{ id: 'resume', label: 'Resume' },
					{ id: 'achievements', label: 'Achievements' },
					{ id: 'notes', label: 'Prior Notes' },
					{ id: 'highlights', label: 'Highlights' }
				]}
			/>
			<div class="overflow-y-auto px-1 py-1 md:max-h-[600px]">
				{#if current === 'resume'}
					<ul class="space-y-2">
						{#each data.jobs || [] as job}
							<Card size="sm" headline={`${job.name} | ${job.company}`}>
								<h5>
									{formatDate(job.startDate)} - {job.currentPosition
										? 'Current'
										: formatDate(job.endDate)}
								</h5>
								<p>{job.description}</p>
							</Card>
						{/each}
						{#each data.education || [] as edu}
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
						{#each data.achievements || [] as achievement}
							<li>
								{achievement.myContribution}
							</li>
						{/each}
					</ul>
				{:else if current === 'details'}
					<p>
						<strong>Location:</strong> Remote / Hybrid / On-site (City, State)<br />
						<strong>Employment Type:</strong> Full-Time<br />
						<strong>Department:</strong> Engineering
					</p>

					<h2>About the Role</h2>
					<p class="bg-opacity-10 hover:bg-green-100">
						We are seeking a talented and motivated Software Developer to join our growing
						engineering team. As a Software Developer, you will be responsible for designing,
						developing, and maintaining high-quality software solutions that help solve real-world
						problems for our users.
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
						<li>
							Bachelor’s degree in Computer Science or a related field (or equivalent experience)
						</li>
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
						<strong>To Apply:</strong> Please submit your resume and a brief cover letter outlining
						your experience and interest in the role to
						<a href="mailto:careers@example.com">careers@example.com</a>.
					</p>
				{:else if current === 'notes'}
					<Card size="sm">
						<p>This is a note</p>
					</Card>
				{:else if current === 'highlights'}
					<ol>
						<li>
							<blockquote>"...SKills in React.."</blockquote>
							<ol class="list-disk">
								<li>Led the refactoring of a legacy codebase, reducing technical debt by 40%.</li>
							</ol>
						</li>
					</ol>
				{/if}
			</div>
		</div>
	</div>
</PageContainer>

<Drawer
	bind:isOpen={showMeetingDetails}
	title="Update Your Meeting"
	subTitle="Update your meeting so you can find it later"
	saveFormID="updateMeeting"
>
	<NewMeetingForm
		id="updateMeeting"
		meetingID={data.meetingID}
		onSuccess={() => goto('/dashboard')}
	/>
</Drawer>

<script lang="ts">
	import { onMount } from 'svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Select from '../FormElements/Select.svelte';
	import type { Education, JobPosition } from '../../../app';
	import Label from '../FormElements/Label.svelte';
	import Rating from '../FormElements/Rating.svelte';
	import DateInput from '../FormElements/DateInput.svelte';

	interface Props {
		id: string;
	}

	const { id }: Props = $props();

	let description = $state('');
	let myContribution = $state('');
	let result = $state('');
	let jobID = $state(null);
	let educationID = $state(null);

	let education = $state<Education[]>([]);
	let jobs = $state<JobPosition[]>([]);

	onMount(async () => {
		education = await fetchEducation();
		jobs = await fetchJobs();
	});

	async function fetchEducation() {
		const resEducation = await fetch(`${PUBLIC_API_URL}/education/my`, {
			credentials: 'include'
		});
		return resEducation.json();
	}

	async function fetchJobs() {
		const resJobs = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
			credentials: 'include'
		});
		return resJobs.json();
	}

	async function submitFunction(e: SubmitEvent) {
		e.preventDefault();

		console.log('this is my data', { description, jobID, educationID });
	}
</script>

<!-- {
  "name": "string",
  "description": "string",
  "goal": "string",
  "result": "string",
  "metrics": "string",
  "myContribution": "string",
  "jobPostingID": "string",
  "projectID": "string"
} -->

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<!-- <TextInput id="ach-name" label="Name" /> -->
		<TextArea id="ach-desc" label="Background" bind:value={description} />
		<TextArea id="ach-contriubution" label="What I Did" bind:value={myContribution} />
		<TextArea id="ach-reult" label="What was the outcome" bind:value={result} />
		<Select
			id="select-job"
			label="Link To Job"
			bind:value={jobID}
			options={jobs.map((j) => ({ id: j.id, label: `${j.name} | ${j.company}` }))}
		/>
		<Select
			id="select-education"
			label="Link To Education"
			bind:value={educationID}
			options={education.map((j) => ({ id: j.id, label: `${j.degree} | ${j.institution}` }))}
		/>
		<DateInput label="Start Date" id="ach-start" value="" showDate />
		<DateInput label="End Date" id="ach-end" value="" showDate />
	</div>
</form>

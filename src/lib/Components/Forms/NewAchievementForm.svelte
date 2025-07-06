<script lang="ts">
	import { onMount } from 'svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Select from '../FormElements/Select.svelte';
	import type { Education, JobPosition } from '../../../app';
	import DateInput from '../FormElements/DateInput.svelte';
	import { toastStore } from '../Toasts/toast';

	interface Props {
		id: string;
		onSuccess?: () => void;
	}

	const { id, onSuccess = () => null }: Props = $props();

	let description = $state('');
	let myContribution = $state('');
	let result = $state('');
	let jobPositionID = $state(null);
	let educationID = $state(null);
	let startDate = $state(null);
	let endDate = $state(null);

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
		const url = `${PUBLIC_API_URL}/achievement`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				description,
				result,
				myContribution,
				jobPositionID,
				educationID,
				startDate: startDate ? new Date(startDate).toISOString() : null,
				endDate: endDate ? new Date(endDate).toISOString() : null
			})
		});

		if (res.ok) {
			toastStore.show({ message: 'New Achievement Added', type: 'success' });
			description = '';
			myContribution = '';
			result = '';
			startDate = null;
			endDate = null;
			jobPositionID = null;
			educationID = null;
			onSuccess();
		} else {
			toastStore.show({ message: 'Could not save achievement', type: 'error' });
		}
	}
</script>

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<TextArea id="ach-desc" label="Background" bind:value={description} />
		<TextArea id="ach-contriubution" label="What I Did" bind:value={myContribution} />
		<TextArea id="ach-reult" label="What was the outcome" bind:value={result} />
		<Select
			id="select-job"
			label="Link To Job"
			bind:value={jobPositionID}
			options={jobs.map((j) => ({ id: j.id, label: `${j.name} | ${j.company}` }))}
		/>
		<Select
			id="select-education"
			label="Link To Education"
			bind:value={educationID}
			options={education.map((j) => ({ id: j.id, label: `${j.degree} | ${j.institution}` }))}
		/>
		<DateInput label="Start Date" id="ach-start" bind:value={startDate} showDate />
		<DateInput label="End Date" id="ach-end" bind:value={endDate} showDate />
	</div>
</form>

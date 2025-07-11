<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';
	import type { Education, JobApplication, JobPosition } from '../../../app';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { toastStore } from '../Toasts/toast';
	import { createQuery, type QueryObserverResult } from '@tanstack/svelte-query';
	import { fetchMyEducation, myEducationQueryKey } from '$lib/API/Queries/my-education';
	import { fetchMyJobPositions, myJobPositionsQueryKey } from '$lib/API/Queries/my-jobs-positions';
	import {
		fetchMyJobApplications,
		myJobApplicationsQueryKey
	} from '$lib/API/Queries/my-job-applications';

	interface Props {
		id: string;
		onSuccess?: () => void;
	}

	const { id, onSuccess = () => null }: Props = $props();

	let title = $state();
	let time = $state<string | Date>();
	let type = $state('interview');
	let location = $state();
	let link = $state();
	let jobPositionID = $state(null);
	let educationID = $state(null);
	let jobAppID = $state(null);

	let MyEducationQuery = createQuery<Education[]>({
		queryKey: [myEducationQueryKey],
		queryFn: async () => await fetchMyEducation()
	});

	let MyJobPositionsQuery = createQuery<JobPosition[]>({
		queryKey: [myJobPositionsQueryKey],
		queryFn: async () => await fetchMyJobPositions()
	});

	let MyJobApplicationsQuery = createQuery<JobApplication[]>({
		queryKey: [myJobApplicationsQueryKey],
		queryFn: async () => await fetchMyJobApplications()
	});

	let education = $state<QueryObserverResult<Education[], Error>>();
	let jobPositions = $state<QueryObserverResult<JobPosition[], Error>>();
	let jobApps = $state<QueryObserverResult<JobApplication[], Error>>();

	const unsubscribeEducation = MyEducationQuery.subscribe((t) => {
		education = t;
	});
	const unsubscribeJobPositions = MyJobPositionsQuery.subscribe((t) => {
		jobPositions = t;
	});
	const unsubscribeJobApplications = MyJobApplicationsQuery.subscribe((t) => {
		jobApps = t;
	});

	onDestroy(() => {
		unsubscribeEducation();
		unsubscribeJobPositions();
		unsubscribeJobApplications();
	});

	$inspect({ education, jobPositions });

	async function submitFunction(e: SubmitEvent) {
		e.preventDefault();

		const url = `${PUBLIC_API_URL}/meetings`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				title,
				time: time ? new Date(time).toISOString() : null,
				type,
				jobAppID,
				jobPositionID,
				educationID,
				location,
				link
			})
		});

		if (res.ok) {
			toastStore.show({ message: 'New Meeting Added', type: 'success' });
			title = null;
			time = '';
			type = 'interview';
			jobPositionID = null;
			educationID = null;
			location = null;
			link = null;
			onSuccess();
		} else {
			toastStore.show({ message: 'Could not save achievement', type: 'error' });
		}
	}
</script>

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<TextInput id="evt-title" label="Event Title" bind:value={title} />
		<TextInput id="evt-time" label="Event Time" type="datetime-local" bind:value={time} />
		<TextInput id="evt-location" label="Event Location" bind:value={location} />
		<TextInput id="evt-link" label="Event Link" bind:value={link} />
		<Select
			id="evt-type"
			label="Type"
			bind:value={type}
			options={[
				{ id: 'interview', label: 'Interview' },
				{ id: '1-1', label: '1:1' },
				{ id: 'review', label: 'Review' }
			]}
		/>
		{#if type === 'interview'}
			<Select
				id="select-job-app"
				label="Link To Job Application"
				bind:value={jobAppID}
				options={jobApps?.data?.map((j) => ({ id: j.id, label: `${j.title} | ${j.company}` }))}
			/>
		{:else}
			<Select
				id="select-job"
				label="Link To Job"
				bind:value={jobPositionID}
				options={jobPositions?.data?.map((j) => ({ id: j.id, label: `${j.name} | ${j.company}` }))}
			/>
			<Select
				id="select-education"
				label="Link To Education"
				bind:value={educationID}
				options={education?.data?.map((j) => ({
					id: j.id,
					label: `${j.degree} | ${j.institution}`
				}))}
			/>
		{/if}
	</div>
</form>

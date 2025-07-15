<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';
	import type { Education, JobPosition } from '../../../app';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { toastStore } from '../Toasts/toast';
	import { createQuery, type QueryObserverResult } from '@tanstack/svelte-query';
	import { fetchMyEducation, myEducationQueryKey } from '$lib/API/Queries/my-education';
	import { fetchMyJobPositions, myJobPositionsQueryKey } from '$lib/API/Queries/my-jobs-positions';
	import AssignToJob from './AssignToJob.svelte';

	interface Props {
		id: string;
		meetingID?: string;
		onSuccess?: () => void;
		meeting?: Partial<{
			time?: string | Date;
		}>;
	}

	const { id, meetingID, onSuccess = () => null, meeting = {} }: Props = $props();

	let title = $state();
	let time = $state<string | Date>(meeting?.time || new Date().toUTCString());
	let type = $state('interview');
	let location = $state();
	let link = $state();
	let jobPositionID = $state(null);
	let educationID = $state(null);
	let jobAppID = $state(null);

	$inspect({ time });

	let MyEducationQuery = createQuery<Education[]>({
		queryKey: [myEducationQueryKey],
		queryFn: async () => await fetchMyEducation()
	});

	let MyJobPositionsQuery = createQuery<JobPosition[]>({
		queryKey: [myJobPositionsQueryKey],
		queryFn: async () => await fetchMyJobPositions()
	});

	let education = $state<QueryObserverResult<Education[], Error>>();
	let jobPositions = $state<QueryObserverResult<JobPosition[], Error>>();

	const unsubscribeEducation = MyEducationQuery.subscribe((t) => {
		education = t;
	});
	const unsubscribeJobPositions = MyJobPositionsQuery.subscribe((t) => {
		jobPositions = t;
	});

	onDestroy(() => {
		unsubscribeEducation();
		unsubscribeJobPositions();
	});

	$inspect({ education, jobPositions });

	async function submitFunction(e: SubmitEvent) {
		e.preventDefault();

		const url = meetingID
			? `${PUBLIC_API_URL}/meetings/${meetingID}`
			: `${PUBLIC_API_URL}/meetings`;

		const res = await fetch(url, {
			method: meetingID ? 'PATCH' : 'POST',
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
		<TextInput id="evt-time" label="Event Time" type="datetime-local" bind:value={time} required />
		<TextInput id="evt-location" label="Event Location" bind:value={location} />
		<TextInput id="evt-link" label="Event Link" bind:value={link} />
		<Select
			id="evt-type"
			label="Type"
			bind:value={type}
			options={[
				{ id: 'interview', label: 'Interview' },
				{ id: 'internal', label: 'Internal' }
			]}
		/>
		{#if type === 'interview'}
			<AssignToJob bind:selectedCompany={jobAppID} className="space-y-2" />
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

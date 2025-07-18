<script lang="ts">
	import Label from '../FormElements/Label.svelte';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { JobApplication } from '../../../app';
	import { createQuery, type QueryObserverResult } from '@tanstack/svelte-query';
	import {
		fetchMyJobApplications,
		myJobApplicationsQueryKey
	} from '$lib/API/Queries/my-job-applications';
	import { onDestroy } from 'svelte';

	interface Props {
		className?: string;
		selectedCompany?: string | null;
		oninput?: () => void;
	}

	let { className = '', selectedCompany = $bindable(), oninput }: Props = $props();

	let MyJobApplicationsQuery = createQuery<JobApplication[]>({
		queryKey: [myJobApplicationsQueryKey],
		queryFn: async () => await fetchMyJobApplications()
	});

	let applications = $state<QueryObserverResult<JobApplication[], Error>>();

	const unsubscribeJobApplications = MyJobApplicationsQuery.subscribe((t) => {
		applications = t;
	});

	onDestroy(() => {
		unsubscribeJobApplications();
	});

	let newJobTitle = $state('');
	let newJobCompany = $state(null);

	async function saveNewJobApplication() {
		const url = `${PUBLIC_API_URL}/job-applications`;

		if (newJobTitle === '' && newJobCompany === '') {
			return;
		}

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				title: newJobTitle,
				company: newJobCompany
			})
		});

		if (res.ok) {
			const newJob = await res.json();
			applications?.data?.push(newJob);
			selectedCompany = newJob.id;
		}
	}
</script>

<div class={className}>
	{#if (applications?.data?.length || 0) > 0}
		<Select
			{oninput}
			bind:value={selectedCompany}
			label="Current Job Applications"
			id="jobApplicaiton"
			options={(applications?.data || []).map((app) => ({
				id: app.id,
				label: `${app.company} - ${app.title}`
			}))}
		/>
	{/if}
	<Label id="jobDetails" label="Create New Job Application" />
	<TextInput
		id="jobTitle"
		label="Job Title"
		placeholder="Job Title"
		hideLabel
		bind:value={newJobTitle}
	/>
	<TextInput
		id="jobCompany"
		label="Company"
		placeholder="Company"
		hideLabel
		bind:value={newJobCompany}
	/>
	<div class="flex justify-end">
		<button type="button" class="btn btn-text--primary" onclick={saveNewJobApplication}
			>Add New Job Application</button
		>
	</div>
</div>

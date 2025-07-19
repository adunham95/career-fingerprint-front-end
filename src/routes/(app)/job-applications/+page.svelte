<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import {
		useCreateJobApplicationMutation,
		useMyJobApplicationsQuery,
		useUpdateJobApplicationMutation
	} from '$lib/API/job-applications.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import StatusBadge from '$lib/Components/StatusBadge.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { AppStatusEnum } from '$lib/Utils/AppStatusTypes.js';

	let isOpen = $state(false);
	let jobID = $state<string | null>(null);
	let jobTitle = $state('');
	let company = $state<string>('');
	let companyURL = $state<string | null>(null);
	let location = $state<string | null>(null);
	let jobDescription = $state<string | null>(null);
	let jobStatus = $state(AppStatusEnum.APPLIED);

	const { data } = $props();

	let applications = useMyJobApplicationsQuery(data.applications);
	let createJobApp = useCreateJobApplicationMutation();
	let updateJobApp = useUpdateJobApplicationMutation();

	function setJobDetails(id: string) {
		let selectedApp = $applications.data?.find((app) => app.id === id);
		jobID = id;
		jobTitle = selectedApp?.title || '';
		company = selectedApp?.company || '';
		companyURL = selectedApp?.companyURL || null;
		jobStatus = selectedApp?.status || AppStatusEnum.APPLIED;
		jobDescription = selectedApp?.jobDescription || null;
		isOpen = true;
	}

	async function saveNewJobApplication() {
		try {
			if (jobID) {
				$updateJobApp.mutateAsync({
					id: jobID,
					title: jobTitle,
					company,
					companyURL,
					location,
					status: jobStatus,
					jobDescription
				});
			} else {
				$createJobApp.mutateAsync({
					title: jobTitle,
					company,
					companyURL,
					location,
					status: jobStatus,
					jobDescription
				});
			}
			isOpen = false;
			jobID = null;
			jobTitle = '';
			company = '';
			companyURL = null;
			jobStatus = AppStatusEnum.APPLIED;
			jobDescription = null;
		} catch (error) {
			toastStore.show({ message: 'Error saving job application' });
		}
	}

	console.log({ data });
</script>

<PageContainer className="py-5">
	<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<li>
			<button
				onclick={() => (isOpen = true)}
				class="focus:ring-primary-500 relative block w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mx-auto size-6 text-gray-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
					/>
				</svg>

				New Job Application
			</button>
		</li>
		{#each $applications.data || [] as app}
			<li>
				<button class="w-full" onclick={() => setJobDetails(app.id)}>
					{@render JobCard(
						app.title,
						app.companyURL,
						app.company,
						app.location,
						app.status,
						app?._count?.notes,
						app?._count?.meetings
					)}
				</button>
			</li>
		{/each}
	</ul>
</PageContainer>

{#snippet JobCard(
	title?: string,
	url?: string,
	company?: string,
	location?: string,
	status?: AppStatusEnum,
	notes: number = 0,
	interviews: number = 0
)}
	<Card contentClassName="px-4 py-4">
		<div class="flex">
			<div class="size-14 shrink-0 overflow-hidden rounded border border-gray-300 p-1">
				<img
					src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`}
					alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
					class="size-full object-cover"
				/>
			</div>

			<div class="ml-4 flex flex-1 flex-col text-start">
				<h3 class="text-base">{title}</h3>
				<p class="text-xs text-gray-500">{company}</p>
			</div>
		</div>
		<div class="mt-1 flex justify-start gap-2">
			{#if location}
				<span class="badge badge--gray">{location}</span>
			{/if}
			{#if status}
				<StatusBadge {status} />
			{/if}
		</div>
		<div class="mt-1 flex justify-end gap-1 text-gray-500">
			<div class="ml-1 flex text-xs">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-3"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
					/>
				</svg>
				<span class="ml-0.5">{notes}</span>
			</div>
			<div class="ml-1 flex text-xs">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-3"
				>
					<path
						fill-rule="evenodd"
						d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
						clip-rule="evenodd"
					/>
				</svg>

				<span class=" ml-0.5 ring-gray-500/10 ring-inset">{interviews}</span>
			</div>
		</div>
	</Card>
{/snippet}

<Drawer bind:isOpen title="Add Job Application" onSave={saveNewJobApplication}>
	<div class="space-y-2">
		<TextInput id="jobTitle" label="Job Title" bind:value={jobTitle} required />
		<TextInput id="company" label="Company" bind:value={company} required />
		<TextInput id="companyURL" label="Company URL" bind:value={companyURL} />
		<TextInput id="location" label="Location" bind:value={location} />
		<TextArea id="jobDescription" label="Job Description" bind:value={jobDescription} />
		<Select
			id="status"
			label="Application Status"
			bind:value={jobStatus}
			options={[
				{ id: AppStatusEnum.APPLIED, label: 'Applied' },
				{ id: AppStatusEnum.INTERVIEWING, label: 'Interviewing' },
				{ id: AppStatusEnum.NEGOTIATION, label: 'Negotiation' },
				{ id: AppStatusEnum.ACCEPTED, label: 'Accepted' },
				{ id: AppStatusEnum.REJECTED, label: 'Rejected' },
				{ id: AppStatusEnum.GHOST, label: 'Ghosted' },
				{ id: AppStatusEnum.ARCHIVE, label: 'Archived' }
			]}
		/>
	</div>
</Drawer>

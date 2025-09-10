<script lang="ts">
	import Label from '../FormElements/Label.svelte';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import {
		useCreateJobApplicationMutation,
		useMyJobApplicationsQuery
	} from '$lib/API/job-applications';

	interface Props {
		className?: string;
		selectedCompany?: string | null;
		errorText?: string;
		oninput?: () => void;
	}

	let { className = '', selectedCompany = $bindable(), oninput, errorText }: Props = $props();

	let applications = useMyJobApplicationsQuery();
	let newApplication = useCreateJobApplicationMutation();

	let newJobTitle = $state('');
	let newJobCompany = $state(null);

	async function saveNewJobApplication() {
		if ((newJobTitle === '' && newJobCompany === '') || newJobCompany == null) {
			return;
		}

		const newJob = await $newApplication.mutateAsync({
			title: newJobTitle,
			company: newJobCompany
		});
		selectedCompany = newJob.id;
		newJobTitle = '';
		newJobCompany = null;
	}
</script>

<div class={className}>
	{#if ($applications?.data?.length || 0) > 0}
		<Select
			{oninput}
			bind:value={selectedCompany}
			label="Current Job Applications"
			id="jobApplicaiton"
			options={($applications?.data || []).map((app) => ({
				id: app.id,
				label: `${app.company} - ${app.title}`
			}))}
			{errorText}
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

<script lang="ts">
	import Label from '../FormElements/Label.svelte';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import {
		useCreateJobApplicationMutation,
		useMyJobApplicationsListQuery
	} from '$lib/API/job-applications';
	import ErrorText from '../FormElements/ErrorText.svelte';

	interface Props {
		className?: string;
		selectedCompany?: string | null;
		errorText?: string;
		oninput?: () => void;
	}

	let { className = '', selectedCompany = $bindable(), oninput, errorText }: Props = $props();

	let applications = useMyJobApplicationsListQuery();
	let newApplication = useCreateJobApplicationMutation();

	let newJobTitle = $state('');
	let newJobCompany = $state(null);
	let addingErrorMessage = $state('');

	async function saveNewJobApplication() {
		if ((newJobTitle === '' && newJobCompany === '') || newJobCompany == null) {
			return;
		}

		try {
			const newJob = await $newApplication.mutateAsync({
				title: newJobTitle,
				company: newJobCompany
			});
			selectedCompany = newJob.id;
			newJobTitle = '';
			newJobCompany = null;
			$applications.refetch();
		} catch (error) {}
	}
</script>

<div class={className}>
	{#if ($applications?.data?.length || 0) > 0}
		<Select
			{oninput}
			bind:value={selectedCompany}
			label="Current Job Applications"
			id="jobApplicaiton"
			options={[
				{ id: null, label: 'Select Or Create' },
				...($applications?.data || []).map((app) => ({
					id: app.id,
					label: `${app.company} - ${app.title}`
				}))
			]}
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
	{#if addingErrorMessage}
		<ErrorText errorText={addingErrorMessage} />
	{/if}
	<div class="flex justify-end">
		<button type="button" class="btn btn-text--primary" onclick={saveNewJobApplication}
			>Add New Job Application</button
		>
	</div>
</div>

<script lang="ts">
	import TextArea from '../FormElements/TextArea.svelte';
	import { useUpdateJobApplicationMutation } from '$lib/API/job-applications';
	import { toastStore } from '../Toasts/toast';

	interface Props {
		jobAppID: string;
		jobDescription?: string | null;
		onSuccess?: () => void;
	}

	let { jobAppID, jobDescription = $bindable(), onSuccess }: Props = $props();

	const updateJobApp = useUpdateJobApplicationMutation();

	async function updateJobDescription(e: SubmitEvent) {
		e.preventDefault();
		if (typeof jobDescription !== 'string') {
			alert('Not null');
			return;
		}
		try {
			await $updateJobApp.mutateAsync({ id: jobAppID, jobDescription });
			toastStore.show({ message: 'Updated Job Description' });
			onSuccess?.();
		} catch (error) {
			toastStore.show({ message: 'Could not  update job description', type: 'error' });
		}
	}
</script>

<form onsubmit={(e) => updateJobDescription(e)}>
	<TextArea id="job-description" label="Job Description" rows={6} bind:value={jobDescription} />
	<div class="flex justify-end pt-4">
		<button type="submit" class="btn btn--primary">Updated Job Description</button>
	</div>
</form>

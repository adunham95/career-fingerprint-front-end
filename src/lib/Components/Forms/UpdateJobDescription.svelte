<script lang="ts">
	import { createMutation, type CreateBaseMutationResult } from '@tanstack/svelte-query';
	import TextArea from '../FormElements/TextArea.svelte';
	import { patchJobApp } from '$lib/API/Mutations/update-job-app';
	import { onDestroy } from 'svelte';
	import type { JobApplication } from '../../../app';

	interface Props {
		jobAppID: string;
		jobDescription?: string | null;
	}

	let { jobAppID, jobDescription = $bindable() }: Props = $props();

	let save: CreateBaseMutationResult<
		JobApplication | null,
		Error,
		Partial<JobApplication>,
		unknown
	>;

	const saveMutation = createMutation({
		mutationFn: patchJobApp,
		onSuccess: (data) => {
			alert('saved');
		}
	});

	const unsubscribeJobApplications = saveMutation.subscribe((t) => {
		save = t;
	});

	onDestroy(() => {
		unsubscribeJobApplications();
	});

	function updateJobDescription(e: SubmitEvent) {
		e.preventDefault();
		if (typeof jobDescription !== 'string') {
			alert('Not null');
			return;
		}
		if (save.hasOwnProperty('mutate')) {
			save.mutate({ id: jobAppID, jobDescription });
		}
	}
</script>

<form onsubmit={(e) => updateJobDescription(e)}>
	<TextArea id="" label="Job Description" rows={6} bind:value={jobDescription} />
	<div class="flex justify-end pt-4">
		<button type="submit" class="btn btn--primary">Updated Job Description</button>
	</div>
</form>

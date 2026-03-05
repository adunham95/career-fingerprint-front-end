<script lang="ts">
	import { goto } from '$app/navigation';
	import { useCreateOnboardingJobMutation } from '$lib/API/onboarding.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import JobDetails from '$lib/Components/Forms/JobDetails.svelte';
	import OnboardSteps from '../OnboardSteps.svelte';
	import type { JobPosition } from '../../../../app.js';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { toastStore } from '$lib/Components/Toasts/toast';

	onMount(async () => {
		trackingStore.pageViewEvent('Onboard Job');
	});

	let createJob = useCreateOnboardingJobMutation();

	let job = $state<Omit<JobPosition, 'id' | 'achievements' | 'bulletPoints'>>({
		name: null,
		company: null,
		description: null,
		location: null,
		startDate: null,
		endDate: null,
		currentPosition: true
	});

	async function handleNext() {
		trackingStore.trackAction('Next Step Click');
		try {
			await $createJob.mutateAsync(job);
			toastStore.show({ message: 'New Job Added', type: 'success' });
			goto('/onboard/achievement');
		} catch {
			toastStore.show({ message: 'Could not save job', type: 'error' });
		}
	}
</script>

<Card
	headline="Add Your Current Job"
	className=" w-full max-w-[500px] max-h-[calc(100vh-20px)] md:my-4 md:mx-2"
	contentClassName="space-y-3"
>
	<OnboardSteps step={1} />
	<JobDetails bind:job={job as JobPosition} />
	{#snippet actions()}
		<div class="col-span-2 flex w-full justify-between">
			<a
				href="/onboard/membership"
				class={`btn btn-text--primary`}
				onclick={() => {
					trackingStore.trackAction('Skip Onboarding Click');
				}}>Skip For Now</a
			>
			<button
				id="next-button"
				class={`btn btn--primary`}
				disabled={$createJob.isPending}
				onclick={handleNext}
			>
				{$createJob.isPending ? 'Saving...' : 'Next'}
			</button>
		</div>
	{/snippet}
</Card>

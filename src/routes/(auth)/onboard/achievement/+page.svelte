<script lang="ts">
	import { goto } from '$app/navigation';
	import { useCreateOnboardingAchievementMutation } from '$lib/API/onboarding';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { onMount } from 'svelte';
	import OnboardSteps from '../OnboardSteps.svelte';
	import { trackingStore } from '$lib/Stores/tracking';

	let description = $state('');
	let myContribution = $state('');
	let result = $state('');
	let error = $state<{ [key: string]: string }>({});

	let newAchievement = useCreateOnboardingAchievementMutation();

	onMount(async () => {
		trackingStore.pageViewEvent('Onboard Achievement');
	});

	async function handleNext() {
		trackingStore.trackAction('Next Step Click - Achievement');
		error = {};

		if (!myContribution) {
			error.myContribution = 'Missing Contribution';
			return;
		}

		try {
			await $newAchievement.mutateAsync({
				description,
				result,
				myContribution,
				achievementTags: []
			});
			toastStore.show({ message: 'New Achievement Added', type: 'success' });
			goto('/onboard/membership');
		} catch {
			toastStore.show({ message: 'Could not save achievement', type: 'error' });
		}
	}
</script>

<Card
	headline="Add Your First Achievement"
	className=" w-full max-w-[500px] max-h-[calc(100vh-20px)] md:my-4 md:mx-2"
	contentClassName="space-y-3"
>
	<OnboardSteps step={2} />
	<TextArea
		id="ach-desc"
		label="Situation"
		subLabel="Describe the context or background of the task."
		bind:value={description}
		errorText={error?.description}
	/>
	<TextArea
		id="ach-contribution"
		label="Task/Action"
		subLabel="Describe the task or action that you took."
		bind:value={myContribution}
		errorText={error?.myContribution}
	/>
	<TextArea
		id="ach-result"
		label="Result"
		subLabel="Describe the impact of the task/action."
		bind:value={result}
		errorText={error?.result}
	/>
	{#snippet actions()}
		<div class="col-span-2 flex w-full justify-between">
			<a
				href="/onboard/membership"
				class="btn btn-text--primary"
				onclick={() => {
					trackingStore.trackAction('Skip Onboarding Click - Achievement');
				}}
			>
				Skip For Now</a
			>
			<button class="btn btn--primary" disabled={$newAchievement.isPending} onclick={handleNext}>
				{$newAchievement.isPending ? 'Saving...' : 'Next'}
			</button>
		</div>
	{/snippet}
</Card>

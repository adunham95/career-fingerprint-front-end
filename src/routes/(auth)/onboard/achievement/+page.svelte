<script lang="ts">
	import { goto, preloadCode } from '$app/navigation';
	import { useCreateOnboardingAchievementMutation } from '$lib/API/onboarding';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { onMount } from 'svelte';
	import OnboardSteps from '../OnboardSteps.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';

	let description = $state('');
	let myContribution = $state('');
	let result = $state('');
	let jobName = $state('');
	let error = $state<{ [key: string]: string }>({});
	let achievementSaved = $state(false);

	let newAchievement = useCreateOnboardingAchievementMutation();

	const trackedFields = new Set<string>();
	function trackFieldFilled(field: string, value: string) {
		if (value && !trackedFields.has(field)) {
			trackedFields.add(field);
			trackingStore.trackAction('Onboard Achievement - Field Filled', { field });
		}
	}

	onMount(async () => {
		trackingStore.pageViewEvent('Onboard Achievement');
	});

	async function handleNext() {
		trackingStore.trackAction('Next Step Click - Achievement', {
			has_situation: !!description,
			has_task_action: !!myContribution,
			has_result: !!result
		});
		error = {};

		if (!myContribution) {
			error.myContribution = 'Missing Contribution';
			trackingStore.trackAction('Onboard Achievement - Validation Error', {
				field: 'task_action',
				reason: 'required'
			});
			return;
		}

		try {
			await $newAchievement.mutateAsync({
				description,
				result,
				myContribution,
				jobName,
				achievementTags: []
			});
			achievementSaved = true;
			trackingStore.trackAction('Onboard Achievement - Save Success', {
				has_situation: !!description,
				has_result: !!result
			});
			toastStore.show({ message: 'New Achievement Added', type: 'success' });
			preloadCode('/onboard/membership');
			goto('/onboard/membership');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'unknown';
			trackingStore.trackAction('Onboard Achievement - Save Error', { error: message });
			toastStore.show({ message: 'Could not save achievement', type: 'error' });
		}
	}
</script>

<Card
	headline="Add Your First Achievement"
	className=" w-full max-w-[500px] md:max-h-[calc(100vh-20px)] md:my-4 md:mx-2"
	contentClassName="space-y-3"
>
	{#if achievementSaved}
		<div class="flex flex-col items-center justify-center py-8 text-center">
			<div class="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
				<svg
					class="text-primary h-7 w-7"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557L3.04 10.345c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
					/>
				</svg>
			</div>
			<h3 class="font-title text-secondary mb-2 text-2xl font-normal">Achievement saved!</h3>
			<p class="text-sm text-gray-600">Adding it to your timeline...</p>
			<div class="mt-4 flex gap-1">
				<span class="bg-primary/40 h-2 w-2 animate-bounce rounded-full" style="animation-delay: 0ms"
				></span>
				<span
					class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
					style="animation-delay: 150ms"
				></span>
				<span
					class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
					style="animation-delay: 300ms"
				></span>
			</div>
		</div>
	{:else}
		<div>
			<p class="text-base text-gray-500">Want to set up your trial membership first?</p>
			<a href="/onboard/membership" class="text-primary hover:text-primary-700">
				Skip to membership
			</a>
		</div>
		<OnboardSteps step={1} />
		<TextArea
			id="ach-desc"
			label="Situation"
			subLabel="Describe the context or background of the task."
			bind:value={description}
			errorText={error?.description}
			onblur={() => trackFieldFilled('situation', description)}
		/>
		<TextArea
			id="ach-contribution"
			label="Task/Action"
			subLabel="Describe the task or action that you took."
			bind:value={myContribution}
			errorText={error?.myContribution}
			onblur={() => trackFieldFilled('task_action', myContribution)}
		/>
		<TextArea
			id="ach-result"
			label="Result"
			subLabel="Describe the impact of the task/action."
			bind:value={result}
			errorText={error?.result}
			onblur={() => trackFieldFilled('result', result)}
		/>
		<div aria-hidden="true" class="w-full border-t border-gray-300"></div>
		<p class="text-sm text-gray-500">Which job is this for? (optional)</p>
		<p class="text-sm text-gray-500">
			Linking achievements to a job keeps your career story organized and makes your resume export
			way more useful.
		</p>
		<TextInput
			id="job"
			label="Job Title"
			bind:value={jobName}
			onblur={() => trackFieldFilled('jobName', jobName)}
		/>
	{/if}
	{#snippet actions()}
		<div class="col-span-2 flex w-full justify-end md:justify-between">
			<button
				class="btn btn--primary w-full"
				disabled={$newAchievement.isPending}
				onclick={handleNext}
			>
				{$newAchievement.isPending ? 'Saving...' : 'Next'}
			</button>
		</div>
	{/snippet}
</Card>

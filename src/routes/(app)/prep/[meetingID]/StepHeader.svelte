<script lang="ts">
	import StepList from '$lib/Components/StepList.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { getCurrentStepDetails, getSteps } from './steps';

	interface Props {
		meetingID: string;
		currentStep: number;
		onNextClick?: (e: MouseEvent) => void;
		onPrevClick?: (e: MouseEvent) => void;
		onFinish?: () => void;
	}

	const {
		meetingID,
		currentStep = 0,
		onNextClick = () => null,
		onPrevClick = () => null,
		onFinish
	}: Props = $props();

	const currentStepDetails = $derived.by(() => {
		return getCurrentStepDetails(meetingID, currentStep);
	});
</script>

<StepList {currentStep} steps={getSteps(meetingID)} />
<div class="mt-8 flex justify-between pb-2 print:hidden">
	<h1 class="font-title text-2xl">{currentStepDetails.currentStep?.label}</h1>
	<div>
		{#if currentStepDetails.prevStep}
			<a
				href={currentStepDetails.prevStep.path}
				class="btn btn-text--primary h-auto"
				onclick={(e) => {
					onPrevClick?.(e);
					trackingStore.trackAction('Step List Click', {
						type: 'previous',
						path: currentStepDetails.prevStep?.path || ''
					});
				}}>Prev Step</a
			>
		{:else}
			<button disabled class="btn btn-text--disabled inline h-auto">Prev Step</button>
		{/if}
		{#if currentStepDetails.nextStep}
			<a
				href={currentStepDetails.nextStep.path}
				class="btn btn-text--primary h-auto"
				onclick={(e) => {
					onNextClick?.(e);
					trackingStore.trackAction('Step List Click', {
						type: 'next',
						path: currentStepDetails.nextStep?.path || ''
					});
				}}>Next Step</a
			>
		{:else if currentStepDetails.isLast && onFinish}
			<button onclick={onFinish} class="btn btn-text--primary inline h-auto">Finish</button>
		{:else}
			<button disabled class="btn btn-text--disabled inline h-auto">Next Step</button>
		{/if}
	</div>
</div>

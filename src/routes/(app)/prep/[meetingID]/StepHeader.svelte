<script lang="ts">
	import StepList from '$lib/Components/StepList.svelte';
	import { getCurrentStepDetails, getSteps } from './steps';

	interface Props {
		meetingID: string;
		currentStep: number;
	}

	const { meetingID, currentStep = 0 }: Props = $props();

	const currentStepDetails = $derived.by(() => {
		return getCurrentStepDetails(meetingID, currentStep);
	});
</script>

<StepList {currentStep} steps={getSteps(meetingID)} />
<div class="mt-8 flex justify-between">
	<h1 class="font-title text-2xl">{currentStepDetails.currentStep?.label}</h1>
	<div>
		{#if currentStepDetails.prevStep}
			<a href={currentStepDetails.prevStep.path} class="btn btn-text--primary">Prev Step</a>
		{:else}
			<button disabled class="btn btn-text--disabled">Prev Step</button>
		{/if}
		{#if currentStepDetails.nextStep}
			<a href={currentStepDetails.nextStep.path} class="btn btn-text--primary">Next Step</a>
		{:else}
			<button disabled class="btn btn-text--disabled">Next Step</button>
		{/if}
	</div>
</div>

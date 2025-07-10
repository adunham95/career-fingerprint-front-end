<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from '../steps.js';

	const { data } = $props();

	console.log({ data });
</script>

<!-- 
Questions
Additional Notes
-->

<PageContainer>
	<StepList currentStep={3} steps={getSteps(data.meetingID)} />
	<div class="mt-8 flex justify-between">
		<h1 class="font-title text-2xl">Meeting Review</h1>
		<div>
			<a href={`/prep/${data.meetingID}/research`} class="btn btn-text--primary">Prev Step</a>
			<button disabled class="btn btn-text--disabled">Next Step</button>
		</div>
	</div>
	<div></div>
</PageContainer>

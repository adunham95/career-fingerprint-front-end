<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from '../steps.js';

	const { data } = $props();

	console.log({ data });
</script>

<!-- 
Research
Notes
Why your a good fit
-->

<PageContainer>
	<StepList currentStep={2} steps={getSteps(data.meetingID)} />
	<div class="mt-8 flex justify-between">
		<h1 class="font-title text-2xl">Meeting Research</h1>
		<div>
			<a href={`/prep/${data.meetingID}/details`} class="btn btn-text--primary">Prev Step</a>
			<a href={`/prep/${data.meetingID}/review`} class="btn btn-text--primary">Next Step</a>
		</div>
	</div>
</PageContainer>

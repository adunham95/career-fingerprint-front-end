<script>
	import ExpandedTimeline from '$lib/Components/Calender/ExpandedTimeline.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/NewAchievementForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	const { data } = $props();

	console.log({ data });

	let isAchievementOpen = $state(false);
</script>

<PageContainer>
	<div class="align-center mt-5 mb-5 flex justify-between border-b border-gray-200 pb-5">
		<h1 class="text-2xl font-semibold text-gray-900">My Achievement Timeline</h1>
		<div>
			<button class="btn btn-text--primary">Print Timeline</button>
			<button class="btn btn--primary" onclick={() => (isAchievementOpen = true)}
				>Add Achievement</button
			>
		</div>
	</div>
	<div class="grid grid-cols-2">
		<ExpandedTimeline dates={data.achievements || []} />
	</div>
</PageContainer>

<Drawer
	bind:isOpen={isAchievementOpen}
	title="Add Achievement"
	subTitle="Add an a achievement here"
	saveFormID="newAchievement"
>
	<NewAchievementForm id="newAchievement" onSuccess={() => (isAchievementOpen = false)} />
</Drawer>

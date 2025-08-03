<script>
	import UpcomingEventRow from '$lib/Components/Calender/UpcomingEventRow.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/NewAchievementForm.svelte';

	const { data } = $props();
</script>

<!-- <div aria-hidden="true" class="relative">
	<img src="/images/pexels-jplenio-1119973.jpg" alt="" class="h-52 w-full object-cover" />
	<div class="from-background absolute inset-0 bg-linear-to-t"></div>
</div> -->

<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
	<div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
		<h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Weekly Check In</h2>
		<!-- <p class="mt-4 text-gray-500">Add your achievements and prep for upcoming meetings</p> -->
	</div>
</div>

<PageContainer>
	<div class="grid grid-cols-2 gap-4 py-2">
		<Card headline="Add New Achievement">
			<NewAchievementForm id="checkin" />
			<div class="flex justify-end pt-2">
				<button type="submit" class="btn btn--primary">Add Achievement</button>
			</div>
		</Card>
		<div>
			<div class="flex justify-between">
				<h3 class="font-title pb-4 text-xl">Upcoming Meetings</h3>
				<button class="btn btn-text--primary">Add Meeting</button>
			</div>
			<ul class="space-y-2">
				{#each data.meetings || [] as meeting}
					<li>
						<Card size="sm">
							<UpcomingEventRow {...meeting} />
						</Card>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</PageContainer>

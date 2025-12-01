<script>
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TabNav from '$lib/Components/Header/TabNav.svelte';

	const { data, children } = $props();

	console.log({ data });
</script>

<PageContainer className="py-6">
	<div class="flex justify-between">
		<h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
			{data.currentUser?.firstName || 'User'}
		</h2>
	</div>
	<TabNav
		options={[
			{ path: 'my-fingerprint', label: 'My Fingerprint' },
			{ path: 'achievements', label: 'Achievements' },
			{ path: 'meetings', label: 'Meetings' }
		]}
	/>
	<div>
		{@render children?.()}
	</div>
</PageContainer>

<script>
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TabNav from '$lib/Components/Header/TabNav.svelte';

	let { children } = $props();
</script>

<PageContainer>
	<TabNav
		options={[
			{ path: '/settings/profile', label: 'My Account' },
			{ path: '/settings/membership', label: 'Membership' },
			{ path: '/settings/billing', label: 'Billing' },
			{ path: '/settings/referral', label: 'Referrals' },
			{ path: '/settings/connections', label: 'Connetions' }
			// { path: '/settings/org', label: 'Organizations' }
		]}
	/>

	{@render children()}
</PageContainer>

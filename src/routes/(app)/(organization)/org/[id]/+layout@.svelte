<script lang="ts">
	import AccountHeader from '$lib/Components/Header/AccountHeader.svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/API/queryClient.js';

	let { children, data } = $props();

	console.log({ data });
</script>

<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools buttonPosition="bottom-left" />
	<AccountHeader
		userID={data?.user?.id || 0}
		appTitle="Career Fingerprint"
		routes={[
			{ title: 'My Dashboard', path: '/dashboard' },
			{ title: 'Org Dashboard', path: `/org/${data.org.id}` }
		]}
		lastName={data?.user?.lastName}
		firstName={data?.user?.firstName}
		profileImageURL={data?.user?.profileImage}
		profileRoutes={[
			{ title: 'Account', path: '/settings/profile' },
			{ title: 'Membership', path: '/settings/membership' },
			{ title: 'Referrals', path: '/settings/referral' }
		]}
	/>

	{@render children()}
</QueryClientProvider>

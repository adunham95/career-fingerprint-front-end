<script lang="ts">
	import AccountHeader from '$lib/Components/Header/AccountHeader.svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/API/queryClient.js';

	let { children, data } = $props();

	console.log({ data });

	const profileRoutes = $derived(() => {
		if (data.user.userType === 'platform-admin') {
			return [
				{ title: 'Account', path: '/settings/profile' },
				{ title: 'Membership', path: '/settings/membership' },
				{ title: 'Referrals', path: '/settings/referral' },
				{ title: 'Admin Panel', path: '/admin' }
			];
		}
		return [
			{ title: 'Account', path: '/settings/profile' },
			{ title: 'Connections', path: '/settings/connections' },
			{ title: 'Membership', path: '/settings/membership' },
			{ title: 'Referrals', path: '/settings/referral' }
		];
	});
</script>

<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools buttonPosition="bottom-left" />
	<AccountHeader
		userID={data.user.id || 0}
		appTitle="Career Fingerprint"
		routes={[
			{ title: 'Dashboard', path: '/dashboard' },
			{ title: 'My Fingerprint', path: '/my-fingerprint' },
			{ title: 'Resumes', path: '/resumes' },
			{ title: 'Job Applications', path: '/job-applications' },
			{ title: 'Achievement Timeline', path: '/timeline' },
			{ title: 'Meetings', path: '/meetings' }
		]}
		lastName={data.user.lastName}
		firstName={data.user.firstName}
		profileImageURL={data.user.profileImage}
		profileRoutes={profileRoutes()}
	/>
	<main class="pb-4">
		{@render children()}
	</main>
</QueryClientProvider>

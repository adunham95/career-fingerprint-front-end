<script lang="ts">
	import AccountHeader from '$lib/Components/Header/AccountHeader.svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/API/queryClient.js';

	let { children, data } = $props();

	console.log({ data });
</script>

<QueryClientProvider client={queryClient}>
	<!-- <SvelteQueryDevtools buttonPosition="bottom-left" /> -->
	<AccountHeader
		appTitle="Career Fingerprint"
		routes={[
			{ title: 'Dashboard', path: '/dashboard' },
			{ title: 'Resumes', path: '/resumes' },
			{ title: 'Job Applications', path: '/job-applications' },
			{ title: 'Achievement Timeline', path: '/timeline' },
			{ title: 'Meetings', path: '/meetings' }
		]}
		lastName={data.user.lastName}
		firstName={data.user.firstName}
		profileImageURL={data.user.profileImage}
		profileRoutes={[
			{ title: 'Account', path: '/settings/profile' },
			{ title: 'Membership', path: '/settings/membership' }
		]}
	/>

	{@render children()}
</QueryClientProvider>

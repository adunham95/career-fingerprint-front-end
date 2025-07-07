<script lang="ts">
	import AccountHeader from '$lib/Components/Header/AccountHeader.svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	let { children, data } = $props();

	console.log({ data });

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 600000,
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools />
	<AccountHeader
		appTitle="Career Fingerprint"
		routes={[
			{ title: 'Dashboard', path: '/dashboard' },
			{ title: 'Resumes', path: '/resumes' },
			{ title: 'Job Applications', path: '/job-applications' },
			{ title: 'Meetings', path: '/calender' }
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

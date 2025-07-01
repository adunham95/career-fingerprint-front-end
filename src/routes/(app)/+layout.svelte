<script lang="ts">
	import AccountHeader from '$lib/Components/Header/AccountHeader.svelte';

	let { children, data } = $props();

	console.log({ data });
</script>

<AccountHeader
	appTitle="Career Fingerprint"
	routes={[
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'Resumes', path: '/resumes' },
		{ title: 'Job Applications', path: '/job-applications' }
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

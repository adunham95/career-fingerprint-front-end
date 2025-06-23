<script lang="ts">
	import AccountHeader from '$lib/Compoenents/Header/AccountHeader.svelte';

	let { children, data } = $props();

	console.log({ data });
</script>

<AccountHeader
	appTitle="Career Fingerprint"
	routes={[
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'Profile', path: '/profile' },
		{ title: 'Resumes', path: '/resumes' }
	]}
	lastName={data.user.lastName}
	firstName={data.user.firstName}
	profileImageURL={data.user.profileImage}
	email={data.user.email}
	profileRoutes={[{ title: 'Account', path: '/account' }]}
/>

{@render children()}

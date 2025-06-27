<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import AccountHeader from '$lib/Components/Header/AccountHeader.svelte';

	let { children, data } = $props();

	console.log({ data });
</script>

<AccountHeader
	appTitle="Skill Fingerprint"
	routes={[
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'Resumes', path: '/resumes' }
	]}
	lastName={data.user.lastName}
	firstName={data.user.firstName}
	profileImageURL={data.user.profileImage}
	email={data.user.email}
	profileRoutes={[{ title: 'Account', path: '/settings/profile' }]}
/>

{@render children()}

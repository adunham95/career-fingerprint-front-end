<script lang="ts">
	import AccountHeader from '$lib/Compoenents/Header/AccountHeader.svelte';

	let { children } = $props();
</script>

<AccountHeader
	appTitle="Career Fingerprint"
	routes={[
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'Profile', path: '/profile' },
		{ title: 'Resumes', path: '/resumes' }
	]}
/>

{@render children()}

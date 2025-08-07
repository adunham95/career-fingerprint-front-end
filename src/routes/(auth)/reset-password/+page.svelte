<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	const email = page.url.searchParams.get('email');
	const token = page.url.searchParams.get('token');

	console.log({ email, token });

	onMount(() => {
		trackingStore.pageViewEvent('Reset Password');
	});

	let password = $state('');
	let isLoading = $state(false);

	async function resetPassword(e: SubmitEvent) {
		e.preventDefault();

		if (!email || !token) {
			toastStore.show({ message: 'No Email Or token', type: 'error' });
		}

		isLoading = true;
		const url = `${PUBLIC_API_URL}/auth/reset-password`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json' // Set content type to JSON
				},
				body: JSON.stringify({
					token,
					email,
					password
				})
			});
			if (res.ok) {
				toastStore.show({ message: 'Successfully reset password', type: 'success' });
				const data = await res.json();
				console.log(data);
				await goto('/login');
				isLoading = false;
			} else {
				const data = await res.json();
				console.log(res, data);
				isLoading = false;
			}
		} catch (error) {
			toastStore.show({ message: 'Error resetting password', type: 'error' });
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
		}
	}
</script>

<Card headline="Reset Password" className=" w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	<form onsubmit={resetPassword} class="space-y-2">
		<TextInput id="password" label="Password" bind:value={password} autocomplete="new-password" />
		<div class="flex w-full justify-between pt-2">
			<a href="/login" class="btn btn-text--primary btn-small">Login</a>
			<button disabled={isLoading} class="btn btn-text--primary btn-small">Reset Password</button>
		</div>
	</form>
</Card>

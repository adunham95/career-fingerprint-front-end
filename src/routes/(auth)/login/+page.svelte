<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Login');
	});

	async function login(e: SubmitEvent) {
		e.preventDefault();

		console.log({ email, password });

		isLoading = true;
		const url = `${PUBLIC_API_URL}/auth/login`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json' // Set content type to JSON
				},
				body: JSON.stringify({
					email,
					password
				})
			});
			if (res.ok) {
				toastStore.show({ message: 'Successfully logged in', type: 'success' });
				const data = await res.json();
				console.log(data);
				await goto('/dashboard');
				isLoading = false;
			} else {
				const data = await res.json();
				console.log(res, data);
				toastStore.show({ message: 'Error logging in', type: 'error' });
				isLoading = false;
			}
		} catch (error) {
			toastStore.show({ message: 'Error logging in', type: 'error' });
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
		}
	}
</script>

<Card headline="Sign in" className=" w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	<p>
		Not a member? <a href="/get-started" class=" text-primary hover:text-primary-800"
			>Create your account</a
		>
	</p>
	<form onsubmit={(e) => login(e)} class="space-y-2">
		<TextInput id="email" label="Email" bind:value={email} autocomplete={'email webauthn'} />
		<TextInput
			id="password"
			label="Password"
			type="password"
			bind:value={password}
			autocomplete={'current-password webauthn'}
		/>
		<div class="flex w-full justify-between pt-2">
			<a href="/forgot-password" class="btn btn-text--primary btn-small">Forgot Password</a>
			<button disabled={isLoading} class="btn btn-text--primary btn-small">Login</button>
		</div>
	</form>
</Card>

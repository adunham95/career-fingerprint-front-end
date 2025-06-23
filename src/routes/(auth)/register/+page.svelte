<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';

	let email = $state();
	let password = $state();
	let firstName = $state();
	let lastName = $state();
	let isLoading = $state(false);

	async function login(e: SubmitEvent) {
		e.preventDefault();

		isLoading = true;
		const url = `${PUBLIC_API_URL}/users`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json' // Set content type to JSON
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					password
				})
			});
			if (res.ok) {
				// toastStore.show({ message: 'Successfully logged in', type: 'success' });
				const data = await res.json();
				console.log(data);
				await goto('/login');
				isLoading = false;
			} else {
				const data = await res.json();
				console.log(res, data);
				// toastStore.show({ message: 'Error logging in', type: 'error' });
				isLoading = false;
			}
		} catch (error) {
			// toastStore.show({ message: 'Error logging in', type: 'error' });
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
		}
	}
</script>

<Card headline="Sign in" contentClassName="space-y-3">
	<form onsubmit={(e) => login(e)} class="gap-2 space-y-2 md:grid md:grid-cols-2">
		<TextInput id="firstName" label="First Name" bind:value={firstName} autocomplete="given-name" />
		<TextInput id="lastName" label="Last Name" bind:value={lastName} />
		<TextInput id="email" label="Email" bind:value={email} autocomplete={'email'} />
		<TextInput
			id="password"
			label="Password"
			type="password"
			bind:value={password}
			autocomplete={'new-password'}
		/>
		<div class="flex w-full justify-between pt-2">
			<a href="/login" class="btn btn-text--primary btn-small">Login</a>
			<button class="btn btn-text--primary btn-small">Create Account</button>
		</div>
	</form>
</Card>

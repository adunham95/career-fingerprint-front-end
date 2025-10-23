<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_GTAG } from '$env/static/public';
	import { useRegisterUserMutation } from '$lib/API/user';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let isLoading = $state(false);

	let registerUser = useRegisterUserMutation();

	// Define the conversion function
	function gtag_report_conversion(url?: string) {
		const callback = () => {
			if (url) window.location.href = url;
		};

		if (typeof window.gtag === 'function') {
			window.gtag('event', 'conversion', {
				send_to: `${PUBLIC_GTAG}/94kXCPz816YbEJej6c5B`,
				value: 1.0,
				currency: 'USD',
				event_callback: callback
			});
		} else {
			console.warn('gtag not found');
			callback(); // fallback
		}
	}

	onMount(() => {
		trackingStore.pageViewEvent('Register');
	});

	async function login() {
		if (!email || !firstName || !password) {
			toastStore.show({ message: 'Missing account elements', type: 'error' });
			return;
		}

		isLoading = true;

		try {
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			await $registerUser.mutateAsync({
				firstName,
				lastName,
				email,
				password,
				timezone
			});

			toastStore.show({
				type: 'success',
				message: `User saved`
			});
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({
				event: 'sign_up_success'
			});
			gtag_report_conversion();
			goto('/dashboard');
			isLoading = false;
		} catch (error) {
			toastStore.show({ message: 'Creating Account', type: 'error' });
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
		}
	}
</script>

<Card headline="Create Account" className=" w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	<form
		onsubmit={(e) => {
			e.preventDefault();
			trackingStore.trackAction('Submit New Account');
			login();
		}}
		class="gap-2 space-y-2 md:grid md:grid-cols-2"
	>
		<TextInput
			id="firstName"
			label="First Name"
			bind:value={firstName}
			autocomplete="given-name"
			required
		/>
		<TextInput id="lastName" label="Last Name" bind:value={lastName} />
		<TextInput id="email" label="Email" bind:value={email} autocomplete={'email'} required />
		<TextInput
			required
			id="password"
			label="Password"
			type="password"
			bind:value={password}
			autocomplete={'new-password'}
		/>
		<div class="col-span-2 flex w-full justify-between pt-2">
			<a href="/login" class="btn btn-text--primary btn-small">Login</a>
			<button disabled={isLoading} class="btn btn-text--primary btn-small" type="submit"
				>Create Account</button
			>
		</div>
	</form>
</Card>

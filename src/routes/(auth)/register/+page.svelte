<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_GTAG } from '$env/static/public';
	import { useRegisterUserMutation } from '$lib/API/user';
	import Card from '$lib/Components/Containers/Card.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import PasswordRequirements from '$lib/Components/FormElements/PasswordRequirements.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { validatePassword } from '$lib/Utils/validatePassword';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let isLoading = $state(false);
	let errorText = $state<{ [key: string]: string }>({});
	const orgID = page.url.searchParams.get('org') || undefined;

	let registerUser = useRegisterUserMutation();

	// Define the conversion function
	function gtag_report_conversion(url?: string) {
		const callback = () => {
			if (url) window.location.href = url;
		};

		if (typeof window?.gtag === 'function') {
			window?.gtag('event', 'conversion', {
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
		errorText = {};
		if (!email) {
			errorText['email'] = 'Required';
		}
		if (!email) {
			errorText['firstName'] = 'Required';
		}
		if (!validatePassword(password, confirmPassword).isValid) {
			errorText['password'] = 'Password not valid';
		}

		if (Object.keys(errorText).length > 0) {
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
				timezone,
				orgID
			});

			toastStore.show({
				type: 'success',
				message: `User saved`
			});
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({
				event: 'sign_up_success'
			});
			trackingStore.trackAction('Register User');
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
		id="create-account"
		onsubmit={(e) => {
			e.preventDefault();
			trackingStore.trackAction('Submit New Account Click');
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
			errorText={errorText['firstName']}
		/>
		<TextInput
			id="lastName"
			label="Last Name"
			bind:value={lastName}
			errorText={errorText['lastName']}
		/>
		<TextInput
			className="col-span-2"
			id="email"
			label="Email"
			type="email"
			bind:value={email}
			autocomplete={'email'}
			required
			errorText={errorText['email']}
		/>
		<TextInput
			required
			id="password"
			label="Password"
			type="password"
			bind:value={password}
			autocomplete={'new-password'}
		/>
		<TextInput
			required
			id="confirmPassword"
			label="Confirm Password"
			type="password"
			bind:value={confirmPassword}
			autocomplete={'new-password'}
		/>
		<ErrorText errorText={errorText['password']} />
		<PasswordRequirements {password} className="col-span-2" {confirmPassword} />
		<p class="col-span-2 text-[10px] text-gray-500">
			By creating an account, you agree to our
			<a href="https://mycareerfingerprint.com/terms" class="underline">Terms of Service</a> and
			<a href="https://mycareerfingerprint.com/privacy" class="underline">Privacy Policy</a>.
		</p>
	</form>
	{#snippet actions()}
		<div class="col-span-2 flex w-full justify-between">
			<a href="/login" class="btn btn-text--primary btn-small">Login</a>
			<button
				disabled={isLoading}
				class="btn btn-text--primary btn-small"
				type="submit"
				form="create-account"
			>
				Create Account
			</button>
		</div>
	{/snippet}
</Card>

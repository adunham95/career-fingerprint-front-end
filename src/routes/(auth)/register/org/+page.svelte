<script lang="ts">
	import { goto } from '$app/navigation';
	import { useRegisterOrg } from '$lib/API/org';
	import Card from '$lib/Components/Containers/Card.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';

	let orgName = $state('');
	let orgEmail = $state('');
	let streetAddress = $state('');
	let city = $state('');
	let providence = $state('');
	let zip = $state('');
	let country = $state('US');

	let errorMessage = $state<string | null>(null);

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state<{ [key: string]: string }>({});

	let createOrgAndUser = useRegisterOrg();

	async function createOrganization() {
		try {
			if (password !== confirmPassword) {
				error.confirmPassword = 'Passwords Do not match';
				return;
			}
			if (!email || !firstName || !password || !orgName || !orgEmail) {
				toastStore.show({ message: 'Missing account elements', type: 'error' });
				return;
			}
			await $createOrgAndUser.mutateAsync({
				firstName,
				lastName,
				email,
				password,
				orgEmail,
				orgName,
				orgSize: 0,
				postalCode: zip,
				country
			});
			toastStore.show({
				type: 'success',
				message: `Organization Created`
			});
			goto('/dashboard');
		} catch (error) {
			let message = 'Something went wrong.';
			if (error instanceof Error) {
				message = error.message;
			}

			errorMessage = message;
		}
	}
</script>

<Card
	headline="Create Organization"
	className=" w-full max-w-[750px] md:mx-2 @container/create-org"
	contentClassName="space-y-3"
	formID="new-org"
	onSubmit={createOrganization}
>
	<div class={``}>
		{#if errorMessage}
			<ErrorText errorText={errorMessage} />
		{/if}
		<h2 class="text-lg font-medium text-gray-900">Organization information</h2>

		<div class="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-6">
			<TextInput bind:value={orgName} required id="name" label="Name" className="md:col-span-6" />
			<TextInput
				required
				id="org-email"
				bind:value={orgEmail}
				label="Billing Email"
				className="md:col-span-3"
				type="email"
			/>
			<!-- Collect Billing Address -->
			<TextInput
				bind:value={streetAddress}
				required
				id="street-address"
				label="Billing Street Address"
				className="md:col-span-3"
			/>
			<TextInput
				bind:value={city}
				required
				id="address-city"
				label="City"
				className="md:col-span-2"
			/>
			<TextInput
				bind:value={providence}
				required
				id="address-state"
				label="State/Providence"
				className="md:col-span-1"
			/>
			<TextInput
				bind:value={zip}
				required
				id="address-zip"
				label="Zip/Postal Cose"
				className="md:col-span-1"
			/>
			<Select
				bind:value={country}
				className="md:col-span-2"
				id="address-country"
				label="County"
				options={[
					{ label: 'United States', id: 'US' },
					{ label: 'Bahamas', id: 'BS' },
					{ label: 'Canada', id: 'CA' },
					{ label: 'Jamaica', id: 'JM' },
					{ label: 'United Kingdom', id: 'GB' },
					{ label: 'Virgin Islands, U.S.', id: 'VI' }
				]}
			/>
		</div>
	</div>

	<div class={`mt-5 border-t border-gray-200 pt-5`}>
		<h2 class="text-lg font-medium text-gray-900">User information</h2>

		<div class="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-4">
			<TextInput
				required
				id="firstName"
				bind:value={firstName}
				label="First Name"
				className="md:col-span-2 col-span-1"
			/>
			<TextInput
				required
				id="lastName"
				bind:value={lastName}
				label="Last Name"
				className="md:col-span-2 col-span-1"
			/>
			<TextInput
				required
				id="email"
				bind:value={email}
				label="Email"
				className="md:col-span-4 col-span-1"
				type="email"
			/>
			<TextInput
				required
				id="password"
				bind:value={password}
				label="Password"
				className="md:col-span-2 col-span-1"
			/>
			<TextInput
				required
				id="password-confirm"
				bind:value={confirmPassword}
				label="Confirm Password"
				errorText={error?.confirmPassword}
				className="md:col-span-2 col-span-1"
			/>
		</div>
	</div>
	{#snippet actions()}
		<a href="/login" class="btn btn-text--primary btn-small">Login</a>
		<button class="btn btn-text--primary btn-small" type="submit">Create Account</button>
	{/snippet}
</Card>

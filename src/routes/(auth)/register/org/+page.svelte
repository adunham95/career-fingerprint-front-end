<script lang="ts">
	import { useRegisterOrg } from '$lib/API/org';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';

	let orgName = $state('');
	let orgEmail = $state('');

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
			}
			await $createOrgAndUser.mutateAsync({
				firstName,
				lastName,
				email,
				password,
				orgEmail,
				orgName,
				orgSize: 0
			});
		} catch (error) {}
	}
</script>

<Card
	headline="Create Organization"
	className=" w-full max-w-[500px] mx-2 @container/create-org"
	contentClassName="space-y-3"
	formID="new-org"
	onSubmit={createOrganization}
>
	<div class={``}>
		<h2 class="text-lg font-medium text-gray-900">Organization information</h2>

		<div class="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
			<TextInput bind:value={orgName} required id="name" label="Name" className="col-span-4" />
			<TextInput
				required
				id="org-email"
				bind:value={orgEmail}
				label="Billing Email"
				className="col-span-4"
				type="email"
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

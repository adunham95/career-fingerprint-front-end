<script lang="ts">
	import { PUBLIC_DEFAULT_ORG_KEY } from '$env/static/public';
	import { useRegisterOrg } from '$lib/API/org';
	import {
		useCreateCheckoutOrgSession,
		useGetEstimate,
		useGetPlanByID
	} from '$lib/API/subscription';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import TextInputWAddOns from '$lib/Components/FormElements/TextInputWAddOns.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount, untrack } from 'svelte';
	import type { Organization } from '../../../../app';

	onMount(async () => {
		trackingStore.pageViewEvent('Get Started', { type: 'Org' });
	});

	let groupSize = $state(1);
	let createOrgAndUser = useRegisterOrg();

	let newOrg: Organization;

	let orgName = $state('');
	let orgDomain = $state('');
	let orgEmail = $state('');

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');

	let formState = $state('details');

	async function createUser() {
		try {
			// TODO Validation

			const { org } = await $createOrgAndUser.mutateAsync({
				firstName,
				lastName,
				email,
				password,
				orgDomain,
				orgEmail,
				orgName
			});
			newOrg = org;
		} catch (error) {
			toastStore.show({ message: 'Error Creating Organization And User' });
		}
	}
</script>

<div class="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
	<h2 class="sr-only">Checkout</h2>

	<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
		<div>
			<div class={`${formState === 'details' ? 'block' : 'hidden'}`}>
				<h2 class="text-lg font-medium text-gray-900">Organization information</h2>

				<div class="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
					<TextInput
						bind:value={orgName}
						id="name"
						label="Organization Name"
						className="col-span-4"
					/>

					<TextInputWAddOns
						preInlineText="example@"
						bind:value={orgDomain}
						className="col-span-4"
						id="org-domain"
						label="Org Domain"
					/>
					<TextInput
						id="org-email"
						bind:value={orgEmail}
						label="Organization Email"
						subLabel="Used for organization communication and billing"
						className="col-span-4"
						type="email"
					/>
				</div>
			</div>

			<div
				class={`mt-10 border-t border-gray-200 pt-10  ${formState === 'details' ? 'block' : 'hidden'}`}
			>
				<h2 class="text-lg font-medium text-gray-900">User information</h2>

				<div class="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
					<TextInput
						id="email"
						bind:value={email}
						label="Email"
						className="col-span-4"
						type="email"
					/>
					<TextInput
						id="firstName"
						bind:value={firstName}
						label="First Name"
						className="col-span-2"
					/>
					<TextInput id="lastName" bind:value={lastName} label="Last Name" className="col-span-2" />
					<TextInput id="password" bind:value={password} label="Password" className="col-span-2" />
				</div>
			</div>
		</div>

		<!-- Order summary -->
		<div class="mt-10 lg:mt-0">
			<div class="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
				<div class="border-t border-gray-200 px-4 py-6 sm:px-6">
					<button
						onclick={() => createUser()}
						class={`btn btn--primary w-full ${formState === 'details' ? 'block' : 'hidden'}`}
						>Create Account</button
					>
				</div>
			</div>
		</div>
	</div>
</div>

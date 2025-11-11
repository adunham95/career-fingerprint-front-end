<script lang="ts">
	import { useCreateOrg } from '$lib/API/org';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import TextInputWAddOns from '$lib/Components/FormElements/TextInputWAddOns.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import Select from '$lib/Components/FormElements/Select.svelte';

	const { userID, onSuccess }: { userID: number; onSuccess?: () => void } = $props();

	let orgName = $state('');
	let orgEmail = $state('');
	let orgLogo = $state('');
	let orgDomain = $state('');
	let streetAddress = $state('');
	let city = $state('');
	let providence = $state('');
	let zip = $state('');
	let country = $state('US');

	let errorMessage = $state<string | null>(null);

	let createOrgMutation = useCreateOrg();

	let formState = $state('details');

	async function createNewOrg() {
		try {
			await $createOrgMutation.mutateAsync({
				orgName,
				orgEmail,
				orgLogo,
				orgDomain,
				postalCode: zip,
				country,
				admin: userID
			});
			orgName = '';
			orgEmail = '';
			orgLogo = '';
			orgDomain = '';
			zip = '';
			country = '';
			toastStore.show({ message: 'New Org Created', type: 'success' });
			onSuccess?.();
		} catch (error) {}
	}
</script>

<TwoColumn title={'New Organization information'}>
	<Card className="md:col-span-2">
		<div class={`${formState === 'details' ? 'block' : 'hidden'}`}>
			<div class="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-6">
				<ImageUpload className="md:col-span-6" id="logo" label="Logo" bind:value={orgLogo} />
				<TextInput bind:value={orgName} required id="name" label="Name" className="md:col-span-6" />
				<TextInput
					required
					id="org-email"
					bind:value={orgEmail}
					label="Billing Email"
					className="md:col-span-3"
					type="email"
				/>
				<!-- <TextInputWAddOns
					preInlineText="example@"
					bind:value={orgDomain}
					className="md:col-span-2"
					id="org-domain"
					label="Org Domain"
				/> -->
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
					label="Zip/PostalCode"
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

		{#snippet actions()}
			<button onclick={createNewOrg} class={`btn btn--primary`}>Create Organization</button>
		{/snippet}
	</Card>
</TwoColumn>

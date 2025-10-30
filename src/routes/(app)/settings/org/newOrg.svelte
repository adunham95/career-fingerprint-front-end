<script lang="ts">
	import { useCreateOrg } from '$lib/API/org';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import TextInputWAddOns from '$lib/Components/FormElements/TextInputWAddOns.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';

	const { userID, onSuccess }: { userID: number; onSuccess?: () => void } = $props();

	let orgName = $state('');
	let orgDomain = $state('');
	let orgEmail = $state('');
	let orgLogo = $state('');

	let createOrgMutation = useCreateOrg();

	let formState = $state('details');

	async function createNewOrg() {
		try {
			await $createOrgMutation.mutateAsync({
				orgName,
				orgDomain,
				orgEmail,
				orgLogo,
				admin: userID
			});
			toastStore.show({ message: 'New Org Created', type: 'success' });
			onSuccess?.();
		} catch (error) {}
	}
</script>

<TwoColumn title={'New Organization information'}>
	<Card className="md:col-span-2">
		<div class={`${formState === 'details' ? 'block' : 'hidden'}`}>
			<div class="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-4">
				<ImageUpload className="md:col-span-4" id="logo" label="Logo" bind:value={orgLogo} />
				<TextInput
					bind:value={orgName}
					id="name"
					label="Organization Name"
					className="md:col-span-4"
				/>

				<TextInputWAddOns
					preInlineText="example@"
					bind:value={orgDomain}
					className="md:col-span-2"
					id="org-domain"
					label="Org Domain"
				/>
				<TextInput
					id="org-email"
					bind:value={orgEmail}
					label="Organization Email"
					subLabel="Used for organization communication and billing"
					className="md:col-span-2"
					type="email"
				/>
			</div>
		</div>

		{#snippet actions()}
			<button onclick={createNewOrg} class={`btn btn--primary`}>Create Organization</button>
		{/snippet}
	</Card>
</TwoColumn>

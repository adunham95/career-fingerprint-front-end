<script>
	import { useUpdateOrg } from '$lib/API/org';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Org Details');
	});

	const updateOrgMutation = useUpdateOrg();

	let profile = $state({ name: data.org?.name || '', domain: data.org?.domain });

	function updateOrg() {
		try {
			$updateOrgMutation.mutateAsync({ id: data.org?.id || '', ...profile });
			toastStore.show({ message: 'Org Updated' });
		} catch (error) {
			toastStore.show({ message: 'Error Updating Org', type: 'error' });
		}
	}
</script>

<PageContainer>
	<TwoColumn title={'Details'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextInput
						className="sm:col-span-3"
						id="orgName"
						label="Org Name"
						bind:value={profile.name}
					/>

					<TextInput
						className="sm:col-span-3"
						id="domain"
						label="Domain"
						bind:value={profile.domain}
					/>
				</div>
			</form>
			{#snippet actions()}
				<button
					type="submit"
					class="btn btn--primary"
					onclick={() => {
						updateOrg();
						trackingStore.trackAction('Update Org Click');
					}}>Update</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
</PageContainer>

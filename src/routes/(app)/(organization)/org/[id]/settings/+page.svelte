<script lang="ts">
	import {
		useCreateDomain,
		useDeleteDomain,
		useOrgDomains,
		useUpdateDomain,
		useUpdateOrg
	} from '$lib/API/org';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	const { data } = $props();
	let newDomain = $state('');

	onMount(() => {
		trackingStore.pageViewEvent('Org Details');
	});

	const updateOrgMutation = useUpdateOrg();

	const orgDomains = useOrgDomains(data.org?.id || '', data.org?.domains || []);
	const updateDomainFunction = useUpdateDomain(data.org?.id || '');
	const deleteDomainFunction = useDeleteDomain(data.org?.id || '');
	const createDomainFunction = useCreateDomain(data.org?.id || '');

	let profile = $state({
		name: data.org?.name || '',
		domain: data.org?.domain,
		logoURL: data.org?.logoURL
	});

	function updateOrg() {
		try {
			$updateOrgMutation.mutateAsync({ id: data.org?.id || '', ...profile });
			toastStore.show({ message: 'Org Updated' });
		} catch (error) {
			toastStore.show({ message: 'Error Updating Org', type: 'error' });
		}
	}

	async function updateDomain(domain: string, id: string) {
		try {
			await $updateDomainFunction.mutateAsync({ id, domain, orgID: data.org?.id || '' });
			toastStore.show({ message: 'Domain Updated' });
		} catch (error) {
			toastStore.show({ message: 'Could not update domain', type: 'error' });
		}
	}

	async function deleteDomain(id: string) {
		try {
			await $deleteDomainFunction.mutateAsync({ id });
			toastStore.show({ message: 'Domain Deleted' });
		} catch (error) {
			toastStore.show({ message: 'Could not delete domain', type: 'error' });
		}
	}

	async function addDomain() {
		try {
			await $createDomainFunction.mutateAsync({ domain: newDomain, orgID: data.org?.id || '' });
			newDomain = '';
			toastStore.show({ message: 'Domain Added' });
		} catch (error) {
			toastStore.show({ message: 'Could not add domain', type: 'error' });
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

					<ImageUpload className="sm:col-span-6" label="Org Logo" bind:value={profile.logoURL} />
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
	<TwoColumn title={'Domains'}>
		<Card className="md:col-span-2 relative overflow-hidden">
			{#if $orgDomains.isFetching}
				<div class="absolute inset-0 overflow-hidden">
					<div class="flex h-full w-full items-center justify-center bg-gray-500/25">
						<Loader />
					</div>
				</div>
			{/if}
			<div class=" space-y-4">
				{#each $orgDomains.data as domainData}
					<div class="flex gap-1">
						<TextInput
							className=" flex-1 w-full"
							id="domain"
							label="Domain"
							bind:value={domainData.domain}
						/>
						<div class="mt-2 flex flex-col justify-end">
							<button
								class="btn btn-text--success"
								onclick={() => {
									updateDomain(domainData.domain, domainData.id);
								}}>Update</button
							>
						</div>
						<div class="mt-2 flex flex-col justify-end">
							<button
								class="btn btn-text--error"
								onclick={() => {
									deleteDomain(domainData.id);
								}}>Delete</button
							>
						</div>
					</div>
				{/each}
				<div class="flex gap-1">
					<TextInput
						className=" flex-1 w-full"
						id="domain"
						label="New Domain"
						bind:value={newDomain}
					/>
					<div class="mt-2 flex flex-col justify-end">
						<button
							class="btn btn-text--success"
							onclick={() => {
								addDomain();
							}}>Save</button
						>
					</div>
				</div>
			</div>
		</Card>
	</TwoColumn>
</PageContainer>

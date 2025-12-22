<script lang="ts">
	import {
		useCreateDomain,
		useCreateOrgPromoCode,
		useDeleteDomain,
		useOrgDomains,
		useOrgPromoCode,
		useUpdateDomain,
		useUpdateOrg
	} from '$lib/API/org';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { permissionGate } from '$lib/Utils/permissionGate.js';
	import { onMount } from 'svelte';

	const { data } = $props();
	let newDomain = $state('');
	let promoCodeText = $state('');

	onMount(() => {
		trackingStore.pageViewEvent('Org Details');
	});

	const updateOrgMutation = useUpdateOrg();

	const orgDomains = useOrgDomains(data.org?.id || '', data.org?.domains || []);
	const updateDomainFunction = useUpdateDomain(data.org?.id || '');
	const deleteDomainFunction = useDeleteDomain(data.org?.id || '');
	const createDomainFunction = useCreateDomain(data.org?.id || '');

	const promoCodes = useOrgPromoCode(data.org?.id);
	const createPromoCode = useCreateOrgPromoCode(data.org?.id);

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

	async function addPromoCode() {
		try {
			await $createPromoCode.mutateAsync({
				orgID: data.org?.id || '',
				promoCodeText: promoCodeText.toUpperCase()
			});
			toastStore.show({ message: 'Promo Code Added' });
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Could not add promo code';

			toastStore.show({ message, type: 'error' });
		}
	}
</script>

<PageContainer>
	{#if permissionGate(['org:update_details'], data.myPermissions)}
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
										trackingStore.trackAction('Update Org Domain');
									}}>Update</button
								>
							</div>
							<div class="mt-2 flex flex-col justify-end">
								<button
									class="btn btn-text--error"
									onclick={() => {
										deleteDomain(domainData.id);
										trackingStore.trackAction('Delete Org Domain');
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
									trackingStore.trackAction('Add Org Domain');
								}}>Save</button
							>
						</div>
					</div>
				</div>
			</Card>
		</TwoColumn>
	{:else}
		<InfoBlock
			title="Missing Permissions"
			description="You have missing permissions. If you need to access this contact your admin to add those permissions"
		/>
	{/if}
	{#if permissionGate(['org:create_promo_code'], data.myPermissions) && data.org?.orgSubscription?.[0]?.plan?.features.includes('org:createPromoCode')}
		<TwoColumn title={'Promo Code'}>
			<Card className="md:col-span-2 relative overflow-hidden">
				{#if $promoCodes.isFetching}
					<div class="absolute inset-0 overflow-hidden">
						<div class="flex h-full w-full items-center justify-center bg-gray-500/25">
							<Loader />
						</div>
					</div>
				{/if}

				<div class=" space-y-4">
					{#if $promoCodes.data?.code}
						<h2>Your Referral Code</h2>
						<div class=" flex items-center justify-between rounded-lg bg-gray-200 px-4 py-2">
							<div class="flex">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="mr-2 size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
									/>
								</svg>

								<p>{$promoCodes.data?.code}</p>
							</div>
						</div>
					{:else if data.org?.orgSubscription?.[0].plan?.features.includes('org:createCustomPromoCode')}
						<form
							class="flex items-end justify-start gap-2"
							onsubmit={(e) => {
								e.preventDefault();
								addPromoCode();
							}}
						>
							<TextInput
								label="Promo Code"
								id="promo-code"
								bind:value={promoCodeText}
								minlength={4}
								maxlength={20}
								className="w-full"
								pattern={'[A-Z0-9][A-Z0-9-]{2, 18}[A-Z0-9]'}
							/>
							<div>
								<button class="btn btn--primary whitespace-nowrap" type="submit">
									Create My Custom Promo Code
								</button>
							</div>
						</form>
					{:else}
						<form
							class="flex items-end justify-start gap-2"
							onsubmit={(e) => {
								e.preventDefault();
								addPromoCode();
							}}
						>
							<div>
								<button class="btn btn--primary whitespace-nowrap" type="submit">
									Create My Custom Promo Code
								</button>
							</div>
						</form>
					{/if}
				</div>
			</Card>
		</TwoColumn>
	{/if}
</PageContainer>

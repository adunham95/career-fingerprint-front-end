<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Modal from '$lib/Components/Overlays/Modal.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { copyTextToClipboard } from '$lib/Utils/copyTextToClipboard';
	import { formatDate } from 'date-fns';
	import type { Organization } from '../../../../../app.js';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';

	const { data } = $props();

	let selectedOrg = $state<Organization | null>(null);
	let showAddSubscription = $state<boolean>(false);

	console.log({ data });

	async function copyText(text: string) {
		try {
			await copyTextToClipboard(text);
			toastStore.show({ message: 'Text Copied' });
		} catch (error) {
			toastStore.show({ message: 'Error Coping Text', type: 'error' });
		}
	}
</script>

<PageContainer>
	<div class="mt-8 mb-12 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<table class="relative min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th
								scope="col"
								class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
								>Name</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Seat Count</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Stripe Customer ID</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Admins
							</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Created At</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.orgs || [] as org}
							<tr class="hover:bg-gray-100">
								<td
									class="hover:text-primary py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0"
								>
									<button
										onclick={() => {
											showAddSubscription = true;
											selectedOrg = org;
										}}
									>
										{org.name}
									</button>
								</td>
								<td
									class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0"
								>
									{org.seatCount}
								</td>
								<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
									<button
										onclick={() => {
											copyText(org.stripeCustomerID);
										}}
									>
										{org.stripeCustomerID}
									</button>
								</td>
								<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
									>{org?._count?.orgAdmins}</td
								>
								<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
									>{formatDate(org.createdAt, 'Pp')}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</PageContainer>

<Modal
	title="Add Subscription"
	bind:isOpen={showAddSubscription}
	onClose={() => {
		selectedOrg = null;
	}}
>
	<div class="space-y-2">
		{#if selectedOrg}
			<h2>{selectedOrg.name}</h2>
			{#if selectedOrg.stripeCustomerID}
				<p>
					Click to copy: <button onclick={() => copyText(selectedOrg?.stripeCustomerID || '')}
						>{selectedOrg.stripeCustomerID}</button
					>
				</p>
			{/if}
		{/if}
		<InfoBlock
			title="To Add Subscription"
			description="To add a new subscription to an organization. Copy the stripe id, and create a new subscription in stripe with the stripe id. When created add the stripe subscriptionID here along with the seat count. Stripe will handle sending the invoice and collecting payment. "
		/>
		<TextInput id="user-count" label="User Count" type="number" step={10} min={1} />
		<TextInput id="stripe-subscription" label="Stripe Subscription" />
		<Select
			value=""
			id="sub-type"
			label="Select A Subscription Type"
			options={[
				{ id: 'org-basic', label: 'Basic' },
				{ id: 'org-premium', label: 'Premium' }
			]}
		/>
	</div>
	{#snippet actions()}
		<button class="btn btn--success">Save</button>
	{/snippet}
</Modal>

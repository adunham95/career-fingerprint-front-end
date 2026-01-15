<script lang="ts">
	import { useCreateClientInvite } from '$lib/API/clients.js';
	import { useOrgInviteLink, useOrgUsersByPageQuery, useRemoveUserFromOrg } from '$lib/API/org';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import TablePagination from '$lib/Components/TablePagination.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { permissionGate } from '$lib/Utils/permissionGate.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	let page = $state(1);

	let newUserEmail = $state('');
	let newUserFirstName = $state('');
	let showAddUser = $state(false);

	let users = useOrgUsersByPageQuery(data.org?.id || '', () => page);
	let inviteUser = useCreateClientInvite();

	let removeUser = useRemoveUserFromOrg();

	async function removeUserFromOrg(orgUserID: string) {
		try {
			await $removeUser.mutateAsync({ orgUserID });
			$users.refetch();
		} catch (error) {}
	}

	async function addClient() {
		try {
			await $inviteUser.mutateAsync({ firstName: newUserFirstName, email: newUserEmail });
			showAddUser = false;
			newUserEmail = '';
			newUserFirstName = '';
		} catch (error) {}
	}

	onMount(() => {
		trackingStore.pageViewEvent('Org Clients');
	});
</script>

<PageContainer>
	<div class="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-base font-semibold text-gray-900">Clients</h1>
				<p class="mt-2 text-sm text-gray-700">A list of all the clients in your account.</p>
			</div>
			{#if permissionGate(['client:add'], data.myPermissions)}
				<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						class="btn btn--primary"
						onclick={() => {
							showAddUser = true;
							trackingStore.trackAction('Invite Client Click');
						}}
					>
						Invite Client
					</button>
				</div>
			{/if}
		</div>
	</div>

	{#if $users}
		{#if $users?.isPending}
			<div class="flex justify-center">
				<Loader />
			</div>
		{/if}
		{#if !permissionGate(['client:list'], data.myPermissions)}
			<InfoBlock title="Permission Locked" description="You do not have access to view clients" />
		{:else if ($users?.data?.users || []).length > 0}
			<div class="mt-8 flow-root overflow-hidden">
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<table class="w-full text-left">
						<thead>
							<tr>
								<th
									scope="col"
									class="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
								>
									Name
								</th>
								<th
									scope="col"
									class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
									>Email</th
								>
								<th scope="col" class="py-3.5 pl-3">
									<span class="sr-only">Remove User</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{#each $users?.data?.users || [] as orgUser}
								<tr>
									<td class="relative py-4 pr-3 text-sm font-medium text-gray-900">
										<a
											href={`/org/${data.org?.id || ''}/seats/${orgUser.id}`}
											class=" hover:text-primary"
										>
											{orgUser?.user?.firstName}
											{orgUser?.user?.lastName}
										</a>
										<p class="table-cell text-sm text-gray-500 sm:hidden">{orgUser?.user?.email}</p>
										<div class="absolute right-full bottom-0 h-px w-screen bg-gray-100"></div>
										<div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100"></div>
									</td>
									<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
										{orgUser?.user?.email}
									</td>
									<td class="py-4 pl-3 text-right text-sm font-medium">
										<button
											class="btn btn-text--primary"
											onclick={() => {
												removeUserFromOrg(orgUser.id);
												trackingStore.trackAction('Remove user from clients click');
											}}
										>
											Remove
											<span class="sr-only"
												>, {orgUser?.user?.firstName} {orgUser?.user?.lastName}</span
											>
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<TablePagination
				bind:currentPage={page}
				totalPages={$users?.data?.totalPages || 1}
				range={2}
				showFirstLast
				onPageChange={() => $users.refetch()}
			/>
		{:else}
			<InfoBlock
				title="No Clients"
				description="You have no client. Invite clients to show them in the list"
			/>
		{/if}
	{/if}
</PageContainer>

<Drawer title="Invite" bind:isOpen={showAddUser} saveFormID="newOrgClient">
	<form
		class="space-y-4"
		id="newOrgClient"
		onsubmit={(e) => {
			e.preventDefault(), addClient();
			trackingStore.trackAction('Invite Add Client Click');
		}}
	>
		<TextInput id="new-email" type="email" required label="Email" bind:value={newUserEmail} />
		<TextInput id="new-firstName" label="First Name" bind:value={newUserFirstName} />
	</form>
</Drawer>

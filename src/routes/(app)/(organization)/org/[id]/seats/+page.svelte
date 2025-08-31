<script lang="ts">
	import { useOrgUsersByPageQuery, useRemoveUserFromOrg } from '$lib/API/org';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import TablePagination from '$lib/Components/TablePagination.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	let page = $state(1);

	let users = useOrgUsersByPageQuery(data.org?.id || '', () => page);

	let removeUser = useRemoveUserFromOrg();

	async function removeUserFromOrg(userID: number) {
		try {
			await $removeUser.mutateAsync({ userID, orgID: data.org?.id || '' });
			$users.refetch();
		} catch (error) {}
	}

	onMount(() => {
		trackingStore.pageViewEvent('Org Seats');
	});
</script>

<PageContainer>
	<div class="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-base font-semibold text-gray-900">Users</h1>
				<p class="mt-2 text-sm text-gray-700">A list of all the users in your account.</p>
			</div>
			<!-- <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button type="button" class="btn btn--primary">Add user</button>
			</div> -->
		</div>
	</div>

	{#if $users}
		{#if $users?.isPending}
			<div class="flex justify-center">
				<Loader />
			</div>
		{/if}
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
								<div
									class="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200"
								></div>
								<div
									class="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200"
								></div>
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
						{#each $users?.data?.users || [] as user}
							<tr>
								<td class="relative py-4 pr-3 text-sm font-medium text-gray-900">
									<span>
										{user.firstName}
										{user.lastName}
									</span>
									<p class="table-cell text-sm text-gray-500 sm:hidden">{user.email}</p>
									<div class="absolute right-full bottom-0 h-px w-screen bg-gray-100"></div>
									<div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100"></div>
								</td>
								<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
									{user.email}
								</td>
								<td class="py-4 pl-3 text-right text-sm font-medium">
									<button class="btn btn-text--primary" onclick={() => removeUserFromOrg(user.id)}>
										Remove
										<span class="sr-only">, {user.firstName} {user.lastName}</span>
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
			onPageChange={() => $users.refetch()}
		/>
	{/if}
</PageContainer>

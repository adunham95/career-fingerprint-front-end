<script lang="ts">
	import { useOrgUsersByPageQuery, useRemoveUserFromOrg } from '$lib/API/org';
	import { useUploadOrgUsers } from '$lib/API/user.js';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import FileUpload from '$lib/Components/FormElements/FileUpload.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import Modal from '$lib/Components/Overlays/Modal.svelte';
	import TablePagination from '$lib/Components/TablePagination.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	let page = $state(1);
	let showUploadModal = $state(false);
	let uploadFile: File | null = $state(null);
	let uploadError = $state<string | null>(null);

	let users = useOrgUsersByPageQuery(data.org?.id || '', () => page);
	let uploadOrgUsersMutation = useUploadOrgUsers();

	let removeUser = useRemoveUserFromOrg();

	async function removeUserFromOrg(userID: number) {
		try {
			await $removeUser.mutateAsync({ userID, orgID: data.org?.id || '' });
			$users.refetch();
		} catch (error) {}
	}

	async function uploadOrgUsers() {
		try {
			if (!uploadFile) {
				throw Error('Missing File');
			}
			await $uploadOrgUsersMutation.mutateAsync({ file: uploadFile, orgID: data.org?.id || '' });
			showUploadModal = false;
			uploadFile = null;
			toastStore.show({
				message: 'CSV Uploaded successfully',
				details: 'Check back shortly to see the added users'
			});
			$users.refetch();
		} catch (error) {
			console.log({ error });
			let message = 'Something went wrong.';
			if (error instanceof Error) {
				message = error.message;
			}

			uploadError = message;
		}
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
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button class="btn btn--primary" onclick={() => (showUploadModal = true)}>
					Upload Users
				</button>
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
									<a href={`/org/${data.org?.id || ''}/seats/${user.id}`}>
										{user.firstName}
										{user.lastName}
									</a>
									<p class="table-cell text-sm text-gray-500 sm:hidden">{user.email}</p>
									<div class="absolute right-full bottom-0 h-px w-screen bg-gray-100"></div>
									<div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100"></div>
								</td>
								<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
									{user.email}
								</td>
								<td class="py-4 pl-3 text-right text-sm font-medium">
									<button
										class="btn btn-text--primary"
										onclick={() => {
											removeUserFromOrg(user.id);
											trackingStore.trackAction('Remove user from seat click');
										}}
									>
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
			range={2}
			showFirstLast
			onPageChange={() => $users.refetch()}
		/>
	{/if}
</PageContainer>

<Modal
	title="Upload Users"
	bind:isOpen={showUploadModal}
	onClose={() => ((uploadFile = null), (uploadError = null))}
>
	<InfoBlock
		title="CSV Template"
		description="Download the template fill in the user data. Then upload to add users to your organization"
	>
		{#snippet actions()}
			<div class="flex justify-end">
				<a href="/template-org-user.csv" download="" class="btn btn-tiny btn-text--info"
					>Download Template</a
				>
			</div>
		{/snippet}
	</InfoBlock>
	{#if uploadError}
		<p class=" text-error-500 pt-3 font-bold">{uploadError}</p>
	{/if}

	<FileUpload setFile={(file) => (uploadFile = file)} />
	{#snippet actions()}
		<button
			disabled={$uploadOrgUsersMutation.isPending}
			class="btn btn--success"
			onclick={uploadOrgUsers}>Upload Users</button
		>
	{/snippet}
</Modal>

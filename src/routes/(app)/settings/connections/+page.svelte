<script lang="ts">
	import { page } from '$app/state';
	import {
		useJoinOrgWithJoinCode,
		useOrgConnections,
		useRemoveUserFromOrg,
		useVerifyJoinCode
	} from '$lib/API/org';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import Toggle from '$lib/Components/FormElements/Toggle.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import OrgConnectionStatusChip from '$lib/Components/OrgConnectionStatusChip.svelte';
	import Modal from '$lib/Components/Overlays/Modal.svelte';

	const verifyJoinCodeMutation = useVerifyJoinCode();
	const joinOrgMutation = useJoinOrgWithJoinCode();
	const orgConnectionsQuery = useOrgConnections();
	const removeFromOrgMutation = useRemoveUserFromOrg();

	let joinState = $state('add-code');

	let joinCode = $state(page.url.searchParams.get('joinCode'));

	async function verifyJoinCode() {
		joinState = 'join';
		if (joinCode == null) {
			return;
		}
		try {
			await $verifyJoinCodeMutation.mutateAsync({ joinCode });
		} catch (error) {}
	}

	async function joinOrg() {
		if (joinCode == null) {
			return;
		}
		try {
			let response = await $joinOrgMutation.mutateAsync({ joinCode });
			console.log(response);
			joinState = 'success';
			joinCode = '';
		} catch (error) {}
	}

	async function removeFromOrg(orgUserID: string) {
		try {
			let response = await $removeFromOrgMutation.mutateAsync({ orgUserID });
			$orgConnectionsQuery.refetch();
		} catch (error) {}
	}

	console.log({ connections: $orgConnectionsQuery.data });
</script>

<PageContainer>
	<div class="pt-4">
		{#if $verifyJoinCodeMutation.isPending}
			<div class="flex justify-center">
				<Loader />
			</div>
		{/if}
		{#if joinState === 'join'}
			{#if $verifyJoinCodeMutation?.data?.valid}
				<Card className="mt-5" headline="Organization found">
					<p>
						You’ve been invited to connect with {$verifyJoinCodeMutation.data.org?.name} as a coaching
						participant. You stay in control. You’ll choose what your coach can and can’t see after you
						join.
					</p>
					{#snippet actions()}
						<button
							class="btn btn-text--primary"
							onclick={() => {
								joinState = 'add-code';
								joinCode = '';
							}}>Cancel</button
						>
						<button class="btn btn--primary" onclick={joinOrg}>Accept and Join</button>
					{/snippet}
				</Card>
			{:else}
				<Card className="mt-5" headline="There was an error">
					<ErrorText errorText={` ${$verifyJoinCodeMutation?.data?.message}`} />

					{#snippet actions()}
						<button
							class="btn btn--primary"
							onclick={() => {
								joinState = 'add-code';
								joinCode = '';
							}}>Cancel</button
						>
					{/snippet}
				</Card>
			{/if}
		{:else if joinState === 'success'}
			<div class="bg-success-50 rounded-md p-4">
				<div class="flex">
					<div class="shrink-0">
						<svg
							viewBox="0 0 20 20"
							fill="currentColor"
							data-slot="icon"
							aria-hidden="true"
							class="text-success-400 size-5"
						>
							<path
								d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
								clip-rule="evenodd"
								fill-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-success-800 font-medium">
							You Have Successfully Connected {$verifyJoinCodeMutation?.data?.org?.name
								? `to ${$verifyJoinCodeMutation.data.org?.name}`
								: ''}
						</p>
					</div>
					<div class="ml-auto pl-3">
						<div class="-mx-1.5 -my-1.5">
							<button
								type="button"
								onclick={() => {
									joinState = 'add-code';
									joinCode = '';
								}}
								class="bg-success-50 text-success-500 hover:bg-success-100 focus-visible:ring-success-600 focus-visible:ring-offset-success-50 inline-flex rounded-md p-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
							>
								<span class="sr-only">Dismiss</span>
								<svg
									viewBox="0 0 20 20"
									fill="currentColor"
									data-slot="icon"
									aria-hidden="true"
									class="size-5"
								>
									<path
										d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else if joinState === 'add-code'}
			<p>Enter the invite code you received from your organization.</p>
			<div class="flex">
				<TextInput
					id="join-org"
					label="Join An Org"
					hideLabel
					bind:value={joinCode}
					className="w-full"
					placeholder="Invite code (for example: ABC12-XYZ)"
				/>
				<button class="btn btn-text--primary whitespace-nowrap" onclick={verifyJoinCode}>
					Verify Code
				</button>
			</div>
		{/if}
	</div>

	<div
		class="align-center mt-5 mb-5 flex flex-col justify-between border-b border-gray-200 pb-5 sm:flex-row print:hidden"
	>
		<h1 class="text-2xl font-semibold text-gray-900">Connected Organizations</h1>
	</div>
	<ul
		role="list"
		class="my-4 divide-y divide-gray-100 overflow-hidden shadow-xs outline-1 outline-gray-900/5 sm:rounded-xl"
	>
		{#each $orgConnectionsQuery.data as connection}
			<li class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
				<div class="flex min-w-0 gap-x-4">
					{#if connection?.org?.logoURL}
						<img
							src={connection.org.logoURL}
							alt=""
							class="size-12 flex-none rounded-full bg-gray-50"
						/>
					{:else}
						<div
							class="flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-gray-50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-8"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
								/>
							</svg>
						</div>
					{/if}
					<div class="flex min-w-0 flex-auto flex-col">
						<p class="text-sm/6 font-semibold text-gray-900">
							{connection?.org?.name || 'Org Name Not Found'}
						</p>
						<div>
							<OrgConnectionStatusChip status={connection.status} />
						</div>
					</div>
				</div>
				<div class="flex shrink-0 items-center gap-x-4">
					{#if connection.status === 'active'}
						<!-- {#if connection.dataAccess === 'consented'}
							<button class="btn btn-text--warning">Update Permissions</button>
						{/if} -->
						<button class="btn btn-text--error" onclick={() => removeFromOrg(connection.id)}>
							Revoke Access
						</button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</PageContainer>

<Modal isOpen title="Edit Permissions">
	<div>
		<div class="grid grid-cols-2 gap-4">
			<Toggle label="View Fingerprint" subLabel="Allow the org to see your fingerprint." />
			<Toggle label="Edit Fingerprint" subLabel="Allow the org to edit your fingerprint." />
			<Toggle label="Job Applications" subLabel="Allow the org to see your job applications." />
		</div>
	</div>
</Modal>

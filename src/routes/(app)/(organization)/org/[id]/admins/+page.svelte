<script lang="ts">
	import {
		useAddAdmin,
		useOrgAdmins,
		useOrgRoles,
		useRemoveAdminFromOrg,
		useUpdateOrgUser
	} from '$lib/API/org.js';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { permissionGate } from '$lib/Utils/permissionGate.js';
	import { onMount } from 'svelte';

	const { data } = $props();
	console.log(data);

	let showNewAdmin = $state(false);
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');

	let editOrgRoles = $state(false);
	let editOrgRolesOrgUserID = $state<string | null>();
	let orgRoles = $state<string[]>(['viewer']);

	const removeAdminFunction = useRemoveAdminFromOrg();
	const orgAdmins = useOrgAdmins(data.org?.id || '');
	const addAdminMutation = useAddAdmin();
	const orgRolesQuery = useOrgRoles(data.org?.id || '');
	const updateAdminMutation = useUpdateOrgUser();

	const transformedRoles = $derived.by(() => {
		let data = $orgRolesQuery.data as { id: string; label: string; description: string }[];
		if (!data) return [] as { id: string; label: string; description: string }[];
		return data;
	});

	function visualRoleList(roles: string[]) {
		return roles.reduce((accumulator, currentValue) => {
			console.log({ accumulator, currentValue });

			const role = ($orgRolesQuery.data || []).find((r) => r.id === currentValue);
			console.log(role);
			if (role !== undefined) {
				console.log('role defined');
				accumulator = [...accumulator, role.label];
			}
			return accumulator;
		}, []);
	}

	async function updateAdminRole() {
		try {
			if (!editOrgRolesOrgUserID) {
				toastStore.show({ message: 'Could not update admin', type: 'error' });
				return;
			}
			await $updateAdminMutation.mutateAsync({ roles: orgRoles, orgUserID: editOrgRolesOrgUserID });
			toastStore.show({
				message: 'Admin Role Update. The user will need to logout and login again'
			});
			$orgAdmins.refetch();
			orgRoles = ['viewer'];
			editOrgRoles = false;
			editOrgRolesOrgUserID = null;
		} catch (error) {
			toastStore.show({ message: 'Could not update admin', type: 'error' });
		}
	}

	async function removeAdminFromOrg(userID: number) {
		try {
			await $removeAdminFunction.mutateAsync({ userID, orgID: data.org?.id || '' });
			await $orgAdmins.refetch();
			toastStore.show({ message: 'Removed Admin' });
		} catch (error) {
			toastStore.show({ message: 'Could not remove admin', type: 'error' });
		}
	}

	async function addNewAdmin(e: SubmitEvent) {
		e.preventDefault();
		try {
			console.log({ firstName, lastName, email });
			await $addAdminMutation.mutateAsync({
				firstName,
				lastName,
				email,
				orgID: data.org?.id || '',
				roles: orgRoles
			});
			toastStore.show({ message: 'Added New Admin' });
			await $orgAdmins.refetch();
			showNewAdmin = false;
			firstName = '';
			lastName = '';
			email = '';
			orgRoles = ['viewer'];
		} catch (error) {
			toastStore.show({ message: 'Error new admin', type: 'error' });
		}
	}

	onMount(() => {
		trackingStore.pageViewEvent('Org Admins');
	});
</script>

<PageContainer>
	<div class="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-base font-semibold text-gray-900">Admins</h1>
				<p class="mt-2 text-sm text-gray-700">A list of all the users in your account.</p>
			</div>
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				{#if permissionGate(['admins:manage'], data.myPermissions)}
					<button
						type="button"
						class="btn btn--primary"
						onclick={() => {
							showNewAdmin = true;
							trackingStore.trackAction('Add Admin Click');
						}}>Add Admin</button
					>
				{/if}
			</div>
		</div>
	</div>
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
						<th
							scope="col"
							class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
							>Roles</th
						>
						<th scope="col" class="py-3.5 pl-3">
							<span class="sr-only">Remove User</span>
						</th>
					</tr>
				</thead>
				{#if permissionGate(['admins:view'], data.myPermissions)}
					<tbody>
						{#each $orgAdmins.data || [] as admin}
							<tr>
								<td class="relative py-4 pr-3 text-sm font-medium text-gray-900">
									<span>
										{admin.user.firstName}
										{admin.user.lastName}
									</span>
									<p class="text-sm text-gray-500 sm:hidden">{admin.user.email}</p>
									<p class="text-sm text-gray-500 sm:hidden">
										{admin.roles.join(',')}
									</p>
								</td>
								<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
									{admin.user.email}
								</td>
								<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
									{#if permissionGate(['admins:manage'], data.myPermissions)}
										<button
											class="btn btn-text--primary"
											onclick={() => {
												editOrgRoles = true;
												editOrgRolesOrgUserID = admin.id;
												orgRoles = admin.roles;
											}}
										>
											{visualRoleList(admin.roles).join(', ')}
										</button>
									{:else}
										<p>{visualRoleList(admin.roles).join(', ')}</p>
									{/if}
								</td>
								<td class="py-4 pl-3 text-right text-sm font-medium">
									{#if permissionGate(['admins:manage'], data.myPermissions)}
										<button
											class="btn btn-text--primary disabled:cursor-not-allowed disabled:text-gray-500 hover:disabled:bg-transparent"
											disabled={data?.user?.id === admin.user.id}
											onclick={() => {
												removeAdminFromOrg(admin.user.id);
												trackingStore.trackAction('Remove Admin Click');
											}}
										>
											Remove
											<span class="sr-only">, {admin.user.firstName} {admin.user.lastName}</span>
										</button>
									{:else}
										<span class="sr-only">You Do Not Have Permission To Remove Users</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				{:else}
					<InfoBlock
						title="Missing Permission"
						description="You do not have the correct permission to view admins"
					/>
				{/if}
			</table>
		</div>
	</div>
</PageContainer>

<Drawer
	bind:isOpen={showNewAdmin}
	title="New Admin"
	subTitle="Add a new admin to your organization"
	saveFormID="newAdminForm"
>
	<form id="newAdminForm" class=" space-y-2" onsubmit={addNewAdmin}>
		<TextInput id="firstName" label="First Name" bind:value={firstName} />
		<TextInput id="lastName" label="Last Name" bind:value={lastName} />
		<TextInput id="email" label="Email" type="email" bind:value={email} />
		<Label id="selectRoles" label="Select User Roles" />
		<div class="pt-2">
			<div class="grid grid-cols-1 gap-3 pt-2">
				{#each transformedRoles as role}
					<label
						for={role.id}
						class={`cursor-pointer rounded border-2 bg-white p-2 transition-all
					${
						orgRoles.includes(role.id)
							? 'border-accent bg-accent/10 shadow-md'
							: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
					}
				`}
					>
						<input
							id={role.id}
							type="checkbox"
							value={role.id}
							name="categories"
							class="hidden"
							bind:group={orgRoles}
						/>

						<div class="flex flex-col gap-1">
							<p class="truncate font-medium text-gray-900">
								{role.label}
							</p>
							<p class="line-clamp-2 text-xs leading-tight text-gray-500">
								{role.description}
							</p>
						</div>
					</label>
				{/each}
			</div>
		</div>
	</form>
</Drawer>

<Drawer title="Select Role" bind:isOpen={editOrgRoles} onSave={updateAdminRole}>
	<div class="pt-2">
		<div class="grid grid-cols-1 gap-3 pt-2">
			{#each transformedRoles as role}
				<label
					for={role.id}
					class={`cursor-pointer rounded border-2 bg-white p-2 transition-all
					${
						orgRoles.includes(role.id)
							? 'border-accent bg-accent/10 shadow-md'
							: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
					}
				`}
				>
					<input
						id={role.id}
						type="checkbox"
						value={role.id}
						name="categories"
						class="hidden"
						bind:group={orgRoles}
					/>

					<div class="flex flex-col gap-1">
						<p class="truncate font-medium text-gray-900">
							{role.label}
						</p>
						<p class="line-clamp-2 text-xs leading-tight text-gray-500">
							{role.description}
						</p>
					</div>
				</label>
			{/each}
			<input
				id={'member'}
				type="checkbox"
				value={'member'}
				name="categories"
				class="hidden"
				bind:group={orgRoles}
			/>
		</div>
	</div>
</Drawer>

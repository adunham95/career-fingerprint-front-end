<script lang="ts">
	import { goto } from '$app/navigation';
	import { useJoinOrgWithJoinCode } from '$lib/API/org';
	import { toastStore } from '$lib/Components/Toasts/toast';

	const { data } = $props();

	const joinOrgMutation = useJoinOrgWithJoinCode();

	async function joinOrg() {
		const joinCode = data.joinCode;
		if (joinCode == null) {
			return;
		}
		try {
			let response = await $joinOrgMutation.mutateAsync({ joinCode });
			toastStore.show({ message: 'You Have successfully joined an org', type: 'success' });
			if (response?.success) {
				if (data.user?.subscription && response.subscriptionType !== 'org-managed') {
					goto('/onboard/billing');
				} else {
					goto('/settings/connections');
				}
			}
		} catch (error) {
			toastStore.show({ message: 'There was an error joining the org', type: 'error' });
		}
	}

	console.log(data);
</script>

<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
	<div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
		<div class="flex items-center justify-center gap-2">
			<div>
				<img src="/logo-brand.svg" class="h-14 w-auto" alt="Career Fingerprint" />
			</div>
			<div class=" text-gray-300">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					data-slot="icon"
					aria-hidden="true"
					class="size-8 text-inherit"
					><path
						d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
					/></svg
				>
			</div>
			<div>
				{#if data.verifyResponse?.org?.logoURL}
					<img
						src={data.verifyResponse?.org?.logoURL}
						class="h-14 w-auto"
						alt="Career Fingerprint"
					/>
				{:else}
					<div></div>
				{/if}
			</div>
		</div>
		<h2 class="mt-6 text-center text-xl tracking-tight text-gray-900">
			Join <span class=" font-bold"> {data.verifyResponse?.org?.name} </span>
		</h2>
		{#if data.user}
			<div class="mt-5">
				<p></p>
			</div>
			<div class="flex rounded border border-gray-500/20 p-4">
				{#if data.user.profileImage}
					<div>
						<img src="/logo-brand.svg" class=" h-10 w-auto" alt="Career Fingerprint" />
					</div>
				{/if}
				<div class="ml-2">
					<p>{data.user.firstName} {data.user.lastName}</p>
					<p class="text-sm text-gray-700">{data.user.email}</p>
				</div>
			</div>
			{#if data.verifyResponse?.valid}
				<div class="mt-4 flex gap-2">
					<a href="/dashboard" class="btn btn-outline--secondary w-full text-center">Cancel</a>
					<button class="btn btn--primary w-full" onclick={joinOrg}>Join</button>
				</div>
			{/if}
		{:else}
			<div class="mt-4 flex gap-2">
				<a
					href={`/register?redirect=/join-org/${data.joinCode}`}
					class="btn btn-outline--secondary w-full text-center"
					>Create Account
				</a>
				<a
					href={`/login?redirect=/join-org/${data.joinCode}`}
					class="btn btn--primary w-full text-center">Login</a
				>
			</div>
		{/if}
	</div>
</div>

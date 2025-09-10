<script>
	import { invalidateAll } from '$app/navigation';
	import { useGetInviteStats, useNewInviteCodeQuery } from '$lib/API/user';
	import Card from '$lib/Components/Containers/Card.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import SocialShare from '$lib/Components/SocialShare.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { copyTextToClipboard } from '$lib/Utils/copyTextToClipboard';
	import { onMount } from 'svelte';
	const { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Referral Settings');
	});

	$inspect(data);

	const inviteStats = useGetInviteStats();

	let isLoadingCode = $state(false);

	async function copyText() {
		try {
			await copyTextToClipboard(
				`https://careerfingerprint.app/get-started?code=${data.user.inviteCode}`
			);
			toastStore.show({ message: 'Text Copied' });
		} catch (error) {
			toastStore.show({ message: 'Error Coping Text', type: 'error' });
		}
	}

	let getMyReferralCode = useNewInviteCodeQuery();

	async function generateMyReferralCode() {
		isLoadingCode = true;
		trackingStore.trackAction('Generate Referral Code Click');
		try {
			await $getMyReferralCode.mutateAsync();
			invalidateAll();
		} catch (error) {
			console.log(error);
			toastStore.show({ message: 'Could Not Generate Referral Code' });
		} finally {
			isLoadingCode = false;
		}
	}
</script>

<div class="bg-linear-0 from-transparent to-gray-100 pb-2">
	<div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
		<div class="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
			<div>
				<div class="flex justify-center">
					<img src="/images/undraw_share-link_y9oh.svg" alt="" class="h-24 w-auto" />
				</div>
				<h3 class="mt-6 text-sm font-medium text-gray-900">Share</h3>
				<p class="mt-2 text-sm text-gray-500">Share your custom invite link.</p>
			</div>
			<div>
				<div class="flex justify-center">
					<img src="/images/undraw_monthly-users_m84v.svg" alt="" class="h-24 w-auto" />
				</div>
				<h3 class="mt-6 text-sm font-medium text-gray-900">Free Trial</h3>
				<p class="mt-2 text-sm text-gray-500">They get an extended free trial for one month.</p>
			</div>
			<div>
				<div class="flex justify-center">
					<img src="/images/undraw_in-progress_cdfz.svg" alt="" class="h-24 w-auto" />
				</div>
				<h3 class="mt-6 text-sm font-medium text-gray-900">Reward</h3>
				<p class="mt-2 text-sm text-gray-500">
					After the free trial, you get a $2 in credits when they subscribe.
				</p>
			</div>
		</div>
	</div>
</div>

{#if data.user.inviteCode}
	<div class=" mx-auto grid grid-cols-1 gap-2.5 md:grid-cols-3">
		<Card className="col-span-2">
			<div class="py-2">
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

						<p>https://careerfingerprint.app/get-started?code={data.user.inviteCode}</p>
					</div>
					<button
						class="rounded p-1 hover:bg-gray-300"
						onclick={() => {
							copyText();
							trackingStore.trackAction('Share Referral Code Click');
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
							/>
						</svg>
						<span class="sr-only">Copy Referral Code</span>
					</button>
				</div>
			</div>
			{#snippet actions()}
				<SocialShare
					text="Here is my link for a free trial of Career Fingerprint"
					url={`https://careerfingerprint.app/get-started?code=${data.user.inviteCode}`}
				/>
			{/snippet}
		</Card>
		<Card>
			<div class="flex flex-col items-center justify-center">
				{#if $inviteStats.isLoading}
					<Loader />
				{:else}
					<p class=" text-9xl">{$inviteStats.data?.totalInvited || 0}</p>
					<p class="text-lg">Invites Credited</p>
				{/if}
			</div>
		</Card>
	</div>
{:else}
	<button
		class="btn btn--primary disabled:bg-gray-700"
		onclick={generateMyReferralCode}
		disabled={isLoadingCode}
	>
		Get My Referral Code
	</button>
{/if}

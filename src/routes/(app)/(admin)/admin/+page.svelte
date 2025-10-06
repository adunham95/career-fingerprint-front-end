<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import type { Snippet } from 'svelte';

	function isPositiveInteger(value: number) {
		return Number.isInteger(value) && value > 0;
	}

	const { data } = $props();
	console.log(data);
</script>

<PageContainer>
	<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{@render statBox(
			'Total Users',
			'/admin/users',
			'View All',
			data.adminDash.totalUsers || 0,
			iconUsers,
			data.adminDash.newSignups
		)}
		{@render statBox(
			'Premium Users',
			'/admin/users',
			'View All',
			data.adminDash.premiumUsers,
			badge
		)}
	</dl>
</PageContainer>

{#snippet statBox(
	title: string,
	path: string,
	cta: string,
	count: number,
	icon: Snippet,
	difference?: number
)}
	<div
		class="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow-sm sm:px-6 sm:pt-6"
	>
		<dt>
			<div class="bg-primary absolute rounded-md p-3">
				{@render icon()}
			</div>
			<p class="ml-16 truncate text-sm font-medium text-gray-500">{title}</p>
		</dt>
		<dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
			<p class="text-2xl font-semibold text-gray-900">{count}</p>
			{#if difference}
				<p
					class={`ml-2 flex items-baseline text-sm font-semibold ${isPositiveInteger(difference) ? 'text-green-600' : 'text-red-600'} `}
				>
					{#if isPositiveInteger(difference)}
						<svg
							viewBox="0 0 20 20"
							fill="currentColor"
							data-slot="icon"
							aria-hidden="true"
							class="size-5 shrink-0 self-center text-green-500"
						>
							<path
								d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
								clip-rule="evenodd"
								fill-rule="evenodd"
							/>
						</svg>
						<span class="sr-only"> Increased by </span>
					{:else}
						<svg
							viewBox="0 0 20 20"
							fill="currentColor"
							data-slot="icon"
							aria-hidden="true"
							class="size-5 shrink-0 self-center text-red-500"
						>
							<path
								d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
								clip-rule="evenodd"
								fill-rule="evenodd"
							/>
						</svg>
						<span class="sr-only"> Decreased by </span>
					{/if}
					{difference}
				</p>
			{/if}
			<div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a href={path} class="text-primary hover:text-primary-600 font-medium">{cta}</a>
				</div>
			</div>
		</dd>
	</div>
{/snippet}

{#snippet iconUsers()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		data-slot="icon"
		aria-hidden="true"
		class="size-6 text-white"
	>
		<path
			d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet badge()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-6 text-white"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
		/>
	</svg>
{/snippet}

<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		range?: number;
		showFirstLast?: boolean;
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = $bindable(),
		totalPages = $bindable(),
		range = 1,
		showFirstLast = true,
		onPageChange
	}: Props = $props();

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			onPageChange?.(page);
		}
	}

	const hasPrev = $derived(currentPage > 1);
	const hasNext = $derived(currentPage < totalPages);

	const pages = $derived(() => {
		const start = Math.max(1, currentPage - range);
		const end = Math.min(totalPages, currentPage + range);
		const list: number[] = [];
		for (let i = start; i <= end; i++) list.push(i);
		return list;
	});

	const firstPageInRange = $derived(() => pages()[0]);
	const lastPageInRange = $derived(() => (pages.length ? pages()[pages.length - 1] : 0));
</script>

<nav
	class="flex w-full flex-wrap items-center justify-center gap-2 border-t border-gray-200 px-2 py-3 sm:justify-between sm:px-4 sm:pt-2 sm:pb-5"
>
	<!-- Desktop Pagination -->
	<div class="hidden w-full items-center justify-between sm:flex">
		<!-- Left Controls -->
		<div class="flex items-center gap-1">
			{#if showFirstLast && hasPrev && currentPage > range + 1}
				<button
					onclick={() => goToPage(1)}
					class="rounded border px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
				>
					« First
					<span class="sr-only">Go To Page {1}</span>
				</button>
			{/if}

			<button
				onclick={() => hasPrev && goToPage(currentPage - 1)}
				disabled={!hasPrev}
				class="rounded border px-3 py-1 text-sm font-medium
					{hasPrev ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
			>
				‹ Prev
				<span class="sr-only">Go To Page {currentPage - 1}</span>
			</button>
		</div>

		<!-- Page Numbers -->
		<div class="flex items-center gap-1">
			{#each pages() as page}
				<button
					onclick={() => goToPage(page)}
					disabled={page === currentPage}
					class={`rounded border px-3 py-1 text-sm font-medium ${
						page === currentPage
							? 'bg-indigo-100 text-indigo-600'
							: 'text-gray-500 hover:bg-gray-100'
					}`}
				>
					{page}
					<span class="sr-only">Go To Page {page}</span>
				</button>
			{/each}
		</div>

		<!-- Right Controls -->
		<div class="flex items-center gap-1">
			<button
				onclick={() => hasNext && goToPage(currentPage + 1)}
				disabled={!hasNext}
				class="rounded border px-3 py-1 text-sm font-medium
					{hasNext ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
			>
				Next ›
				<span class="sr-only">Go To Page {currentPage + 1}</span>
			</button>

			{#if showFirstLast && hasNext && currentPage < totalPages - range}
				<button
					onclick={() => goToPage(totalPages)}
					class="rounded border px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
				>
					Last »
					<span class="sr-only">Go To Page {totalPages}</span>
				</button>
			{/if}
		</div>
	</div>

	<!-- Mobile Pagination -->
	<div class="flex w-full items-center justify-between gap-2 sm:hidden">
		<!-- Left Actions -->
		<div class="flex items-center gap-2">
			{#if showFirstLast}
				<button
					onclick={() => goToPage(1)}
					disabled={!hasPrev}
					class="rounded border px-3 py-2 text-sm font-medium
						{hasPrev ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
				>
					«
					<span class="sr-only">Go To Page 1</span>
				</button>
			{/if}

			<button
				onclick={() => hasPrev && goToPage(currentPage - 1)}
				disabled={!hasPrev}
				class="rounded border px-3 py-2 text-sm font-medium
		{hasPrev ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
			>
				‹
				<span class="sr-only">Go To Page {currentPage - 1}</span>
			</button>
		</div>

		<!-- Page Info -->
		<span class="text-sm font-medium text-gray-600">
			Page {currentPage} of {totalPages}
		</span>

		<!-- Right Actions -->
		<div class="flex items-center gap-2">
			<button
				onclick={() => hasNext && goToPage(currentPage + 1)}
				disabled={!hasNext}
				class="rounded border px-3 py-2 text-sm font-medium
			{hasNext ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
			>
				›
				<span class="sr-only">Go To Page {currentPage + 1}</span>
			</button>

			{#if showFirstLast}
				<button
					onclick={() => goToPage(totalPages)}
					disabled={!hasNext}
					class="rounded border px-3 py-2 text-sm font-medium
		{hasNext ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
				>
					»
					<span class="sr-only">Go To Page {totalPages}</span>
				</button>
			{/if}
		</div>
	</div>
</nav>

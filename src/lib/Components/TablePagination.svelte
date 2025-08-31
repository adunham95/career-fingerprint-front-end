<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange?: () => void;
	}

	let { currentPage = $bindable(), totalPages = $bindable(), onPageChange }: Props = $props();

	// Ensure page numbers stay within bounds

	const prevPage = $derived(currentPage > 1 ? currentPage - 1 : null);
	const nextPage = $derived(currentPage < totalPages ? currentPage + 1 : null);

	function goToPage(page: number) {
		currentPage = page;
		onPageChange?.();
	}
</script>

<nav
	class="flex w-full items-center justify-between space-x-2 border-t border-gray-200 px-4 pt-2 pb-5 sm:px-0"
>
	<!-- Previous -->
	<button
		onclick={() => prevPage && goToPage(prevPage)}
		disabled={!prevPage}
		class="rounded border px-3 py-1 text-sm font-medium
      {prevPage ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
	>
		Previous
	</button>

	<div>
		<!-- X - 1 -->
		{#if prevPage}
			<button
				onclick={() => goToPage(prevPage)}
				class="rounded border px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
			>
				{prevPage}
			</button>
		{/if}

		<!-- Current Page -->
		<button
			disabled
			class="rounded border bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600"
		>
			{currentPage} of {totalPages}
		</button>

		<!-- X + 1 -->
		{#if nextPage}
			<button
				onclick={() => goToPage(nextPage)}
				class="rounded border px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
			>
				{nextPage}
			</button>
		{/if}
	</div>
	<!-- Next -->
	<button
		onclick={() => nextPage && goToPage(nextPage)}
		disabled={!nextPage}
		class="rounded border px-3 py-1 text-sm font-medium
      {nextPage ? 'text-gray-500 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}"
	>
		Next
	</button>
</nav>

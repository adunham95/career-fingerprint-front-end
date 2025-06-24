<!-- src/lib/components/Toast.svelte -->
<script lang="ts">
	import { toastStore, type Toast } from './toast';
	import { onDestroy } from 'svelte';

	let toasts: Toast[] = $state([]);

	const unsubscribe = toastStore.subscribe((t) => {
		console.log(t);
		toasts = t;
	});

	onDestroy(() => {
		unsubscribe();
	});

	function getStyle(style: 'success' | 'error' | 'info' | 'warning' | undefined) {
		if (style === 'error') return 'border-error-400';
		if (style === 'success') return 'border-success-400';
		if (style === 'warning') return 'border-warning-400';
		return 'border-info-400';
	}
</script>

<div
	aria-live="assertive"
	class="pointer-events-none fixed inset-0 z-[99999] flex items-end px-4 py-6 sm:items-start sm:p-6"
>
	<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
		{#each toasts as toast (toast.id)}
			<div
				class={` border-l-4 ${getStyle(toast.type)} pointer-events-auto w-full max-w-sm overflow-hidden rounded-sm bg-gray-50 shadow-lg ring-1 ring-black/5`}
			>
				<div class="p-4">
					<div class="flex items-start">
						<div class="ml-3 w-0 flex-1 pt-0.5">
							<p class="text-sm font-medium text-gray-900">{toast.message}</p>
							<p class="mt-1 text-sm text-gray-500">{toast.details}</p>
						</div>
						<div class="ml-4 flex shrink-0">
							<button
								onclick={() => toastStore.remove(toast.id)}
								type="button"
								class="focus:ring-primary inline-flex rounded-md bg-gray-50 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
							>
								<span class="sr-only">Close</span>
								<svg
									class="size-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									data-slot="icon"
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
		{/each}
	</div>
</div>

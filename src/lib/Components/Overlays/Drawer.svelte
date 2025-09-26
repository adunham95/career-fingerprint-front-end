<!-- Drawer.svelte -->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking';

	type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

	interface Props {
		isOpen?: boolean;
		position?: DrawerPosition;
		width?: string;
		backdrop?: boolean;
		closeOnEscape?: boolean;
		closeOnBackdrop?: boolean;
		children: Snippet;
		title: string;
		subTitle?: string;
		onSave?: () => void;
		onClose?: () => void;
		saveFormID?: string;
	}

	let {
		isOpen = $bindable(false),
		position = 'right',
		width = 'w-80',
		backdrop = true,
		closeOnEscape = true,
		closeOnBackdrop = true,
		children,
		title,
		subTitle,
		onSave,
		onClose,
		saveFormID
	}: Props = $props();

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			isOpen = false;
		}
	}

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			isOpen = false;
		}
	}

	// Get position classes
	function getPositionClasses(pos: DrawerPosition): string {
		switch (pos) {
			case 'left':
				return 'left-0 top-0 h-full';
			case 'right':
				return 'right-0 top-0 h-full';
			case 'top':
				return 'top-0 left-0 w-full';
			case 'bottom':
				return 'bottom-0 left-0 w-full';
			default:
				return 'right-0 top-0 h-full';
		}
	}

	// Get transition direction
	function getTransitionParams(pos: DrawerPosition) {
		switch (pos) {
			case 'left':
				return { x: -300, duration: 300, easing: quintOut };
			case 'right':
				return { x: 300, duration: 300, easing: quintOut };
			case 'top':
				return { y: -300, duration: 300, easing: quintOut };
			case 'bottom':
				return { y: 300, duration: 300, easing: quintOut };
			default:
				return { x: 300, duration: 300, easing: quintOut };
		}
	}
</script>

{#if isOpen}
	<!-- Backdrop -->
	{#if backdrop}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
			onclick={handleBackdropClick}
			role="button"
			tabindex="-1"
			aria-label="Close drawer"
		></div>
	{/if}

	<!-- Drawer -->
	<div
		class="fixed {getPositionClasses(position)} {position === 'top' || position === 'bottom'
			? 'h-auto'
			: width} z-50 overflow-hidden bg-white shadow-lg"
		transition:fly={getTransitionParams(position)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="drawer-title"
	>
		<form class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
			<div class="h-0 flex-1 overflow-y-auto">
				<div class="bg-secondary px-4 py-6 sm:px-6">
					<div class="flex items-center justify-between">
						<h2 class="text-base font-semibold text-white" id="drawer-title">{title}</h2>
						<div class="ml-3 flex h-7 items-center">
							<button
								onclick={() => {
									isOpen = false;
									onClose?.();
								}}
								type="button"
								class="bg-secondary text-secondary-200 relative rounded-md hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
							>
								<span class="absolute -inset-2.5"></span>
								<span class="sr-only">Close panel</span>
								<svg
									class="size-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
									data-slot="icon"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
					<div class="mt-1">
						<p class="text-secondary-300 text-sm">
							{subTitle}
						</p>
					</div>
				</div>
				<div class="flex flex-1 flex-col justify-between p-4">
					{@render children()}
				</div>
			</div>
			<div class="flex shrink-0 justify-end px-4 py-4">
				<button
					type="button"
					class="btn btn-text--error"
					onclick={() => {
						onClose?.();
						isOpen = false;
						trackingStore.trackAction('Close Drawer', { title });
					}}>Cancel</button
				>
				{#if onSave}
					<button
						type="submit"
						class="btn btn-text--primary"
						onclick={() => {
							trackingStore.pageViewEvent('Save Drawer', { title });
							onSave();
						}}>Save</button
					>
				{/if}
				{#if saveFormID}
					<button
						type="submit"
						class="btn btn-text--primary"
						form={saveFormID}
						onclick={() => {
							trackingStore.trackAction('Submit Drawer', { title, formID: saveFormID });
						}}>Save</button
					>
				{/if}
			</div>
		</form>
	</div>
{/if}

<style>
	/* Ensure smooth transitions */
	:global(body) {
		transition: none;
	}
</style>

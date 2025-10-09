<script lang="ts">
	import { isLastDayOfMonth } from 'date-fns';
	import Loader from './Loader.svelte';

	interface Props {
		number?: number;
		text?: string;
		name: string;
		subLabel?: string;
		ofNumber?: number;
		difference?: number;
		isDifferencePercentage?: boolean;
		isLoading?: boolean;
	}

	function isPositiveInteger(value: number) {
		return Number.isInteger(value) && value > 0;
	}

	function formatNumber(num: number) {
		return num?.toLocaleString() ?? '0';
	}

	const {
		number,
		text,
		name,
		ofNumber,
		difference,
		subLabel,
		isDifferencePercentage = false,
		isLoading = false
	}: Props = $props();
</script>

<div
	class="relative flex aspect-square w-full items-center justify-center rounded-lg border-2 border-gray-600/30 bg-gray-600/10 px-4 py-2 text-center md:aspect-video"
>
	{#if isLoading}
		<Loader />
	{:else}
		<div class="px-4 py-5 sm:p-6">
			<dt class=" text-gray-900">
				<div>
					{name}
				</div>
				{#if subLabel}
					<p class="text-sm text-gray-600">{subLabel}</p>
				{/if}
			</dt>
			<dd class="mt-1 flex items-baseline justify-center md:block lg:flex">
				<div class="flex items-baseline text-2xl font-semibold text-gray-700">
					{#if number != null}
						<div>
							{formatNumber(number)}
						</div>
					{/if}
					{#if text}
						<div>
							{text}
						</div>
					{/if}
					{#if ofNumber}
						<span class="ml-2 text-sm font-medium text-gray-500">of {ofNumber}</span>
					{/if}

					{#if difference}
						<p
							class={`ml-2 flex items-baseline text-xs font-semibold ${isPositiveInteger(difference) ? 'text-green-600' : 'text-red-600'} `}
						>
							{#if isPositiveInteger(difference)}
								<svg
									viewBox="0 0 20 20"
									fill="currentColor"
									data-slot="icon"
									aria-hidden="true"
									class="size-3 shrink-0 self-center text-green-500"
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
									class="size-3 shrink-0 self-center text-red-500"
								>
									<path
										d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
										clip-rule="evenodd"
										fill-rule="evenodd"
									/>
								</svg>
								<span class="sr-only"> Decreased by </span>
							{/if}
							{isDifferencePercentage ? `${difference}%` : difference}
						</p>
					{/if}
				</div>
			</dd>
		</div>
	{/if}
</div>

<script lang="ts">
	import { centsToDollars } from '$lib/Utils/centsToDollars';

	interface Props {
		lineItems?: { description: string; amount: number }[];
		subTotal: number;
		discounts: number[];
		taxes: number[];
		total: number;
		trialDays?: number;
		postTrialLabel?: string;
	}

	const { lineItems, subTotal, discounts, taxes, total, trialDays, postTrialLabel }: Props =
		$props();

	const isTrial = trialDays != null && trialDays > 0;

	// Only show subtotal if something is modifying it (discount or tax applied)
	const showSubtotal = discounts.length > 0 || taxes.length > 0;
</script>

<div>
	<dl class="mt-10 space-y-6 text-sm font-medium text-gray-500">
		{#if lineItems}
			{#each lineItems as line}
				<div class="flex justify-between">
					<dt>{line.description}</dt>
					<dd class="text-gray-900">${centsToDollars(line.amount)}</dd>
				</div>
			{/each}
		{/if}

		{#if showSubtotal}
			<div class="flex justify-between">
				<dt>Subtotal</dt>
				<dd class="text-gray-900">${centsToDollars(subTotal)}</dd>
			</div>
		{/if}

		{#if discounts.length > 0}
			<div class="flex justify-between text-lg">
				{#each discounts as discount}
					<dt class="flex">Discount</dt>
					<dd class="text-gray-900">-${centsToDollars(discount)}</dd>
				{/each}
			</div>
		{/if}

		{#if taxes.length > 0}
			<div class="flex justify-between">
				{#each taxes as tax}
					<dt>Taxes</dt>
					<dd class="text-gray-900">${centsToDollars(tax)}</dd>
				{/each}
			</div>
		{/if}
	</dl>

	<div class="mt-6 border-t border-gray-200 pt-6">
		<div class="flex items-baseline justify-between">
			<span class="text-base font-medium text-gray-900">Due Today</span>
			<div class="text-right">
				{#if isTrial}
					<span class="text-base font-semibold" style="color: #00bfa6;">$0.00</span>
				{:else}
					<span class="text-base font-medium text-gray-900">${centsToDollars(total)}</span>
				{/if}
			</div>
		</div>

		{#if isTrial}
			<p class="mt-1 text-right text-xs text-gray-400">
				Free for {trialDays} days{postTrialLabel ? ` — ${postTrialLabel}` : ''}. Cancel any time.
			</p>
		{/if}
	</div>
</div>

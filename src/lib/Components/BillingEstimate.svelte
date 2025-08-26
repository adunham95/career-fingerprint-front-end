<script lang="ts">
	import { centsToDollars } from '$lib/Utils/centsToDollars';

	interface Props {
		lineItems?: { description: string; amount: number }[];
		subTotal: number;
		discounts: number[];
		taxes: number[];
		total: number;
	}

	const { lineItems, subTotal, discounts, taxes, total }: Props = $props();
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
		<div class="flex justify-between">
			<dt>Subtotal</dt>
			<dd class="text-gray-900">${centsToDollars(subTotal)}</dd>
		</div>
		{#if discounts.length > 0}
			<div class="flex justify-between">
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
	<p
		class="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-900"
	>
		<span class="text-base">Estimated First Total</span>
		<span class="text-base">${centsToDollars(total)}</span>
	</p>
</div>

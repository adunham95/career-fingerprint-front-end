<script lang="ts">
	import { useValidateCouponCode } from '$lib/API/subscription';
	import { trackingStore } from '$lib/Stores/tracking';
	import TextInput from './FormElements/TextInput.svelte';

	interface Props {
		promoID: string | null;
		promoValidated: () => void;
	}

	let { promoID = $bindable(), promoValidated }: Props = $props();

	let couponCode = $state('');
	let error = $state('');
	let discountDetails = $state<null | string>(null);

	let validateCouponCodeData = useValidateCouponCode();

	async function validateCouponCode() {
		try {
			let res = await $validateCouponCodeData.mutateAsync({ code: couponCode });
			if (res.valid) {
				discountDetails = res.code || null;
				promoID = res.id || null;
				promoValidated();
			} else {
				error = 'Invalid or expired promo code';
			}
		} catch (error) {}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();

		validateCouponCode();
		trackingStore.trackAction('Apply Coupon Code', {
			code: couponCode
		});
	}}
>
	<div class="flex w-full">
		<TextInput id="coupon-code" label="Coupon Code" className="w-full" bind:value={couponCode} />
		<button class="btn btn-text--primary ml-2" type="submit"> Apply </button>
	</div>
	{#if discountDetails}<p class="text-green-500">Code {discountDetails} Applied</p>{/if}
	{#if error}<p class="text-red-500">{error}</p>{/if}
</form>

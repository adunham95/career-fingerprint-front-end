<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
</script>

<PageContainer className="divide-y divide-gray-300">
	<TwoColumn title={'Membership Details'}>
		<Card className="md:col-span-2">
			<dl class="divide-y divide-gray-100">
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Tier</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Elevate</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Since</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">May 20, 2021</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Expiries</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">May 20, 2026</dd>
				</div>
			</dl>
		</Card>
	</TwoColumn>
	<TwoColumn title={'Upgrade'}>
		<Card className="md:col-span-2">
			<h1>This is your Membership</h1>
		</Card>
	</TwoColumn>
	<TwoColumn title={'Billing'}>
		<Card className="md:col-span-2">
			<h1>Billing details</h1>
		</Card>
	</TwoColumn>
</PageContainer>

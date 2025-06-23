<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
</script>

<PageContainer className="divide-y divide-gray-300">
	<TwoColumn title={'Membership Type'}>
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

<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
</script>

<PageContainer>
	<TwoColumn title={'Org Details'}>
		<Card>
			<h1></h1>
			{#snippet actions()}
				<button class="btn btn--success">Save</button>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Subscription'}>
		{#snippet subSection()}
			<button class="btn btn-text--primary">Add Subscription</button>
		{/snippet}
		<div class="space-y-4">
			<Card>
				<h1></h1>
				{#snippet actions()}
					<button class="btn btn--success">Save</button>
				{/snippet}
			</Card>
		</div>
	</TwoColumn>
</PageContainer>

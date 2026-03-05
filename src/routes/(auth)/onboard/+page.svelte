<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
</script>

<Card
	headline="Add Your Current Job"
	className=" w-full max-w-[500px] max-h-[calc(100vh-20px)] my-4 overflow-y-auto mx-2"
	contentClassName="space-y-3"
>
	<nav aria-label="Progress">
		<ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
			<li class="md:flex-1">
				<!-- Completed Step -->
				<a
					href="#"
					class="group border-primary flex flex-col border-l-4 py-2 pl-4 hover:border-indigo-800 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
				>
					<span class="text-primary text-sm font-medium group-hover:text-indigo-800">Step 1</span>
					<span class="text-sm font-medium text-gray-900">Job details</span>
				</a>
			</li>
			<li class="md:flex-1">
				<!-- Current Step -->
				<a
					href="#"
					aria-current="step"
					class="border-primary flex flex-col border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
				>
					<span class="text-primary text-sm font-medium">Step 2</span>
					<span class="text-sm font-medium text-gray-900">First Achievement</span>
				</a>
			</li>
			<li class="md:flex-1">
				<!-- Upcoming Step -->
				<a
					href="#"
					class="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
				>
					<span class="text-sm font-medium text-gray-500 group-hover:text-gray-700">Step 3</span>
					<span class="text-sm font-medium text-gray-900">Membership</span>
				</a>
			</li>
		</ol>
	</nav>
	<TextInput label="Current Job" id="job" />
	{#snippet actions()}
		<div class="col-span-2 flex w-full justify-between">
			<button
				disabled
				class={`btn btn-text--primary`}
				onclick={() => {
					// trackingStore.trackAction('Register User Subscription Click');
				}}
			>
				Previous
			</button>
			<button
				id="pay-button"
				class={`btn btn-text--primary`}
				onclick={() => {
					// trackingStore.trackAction('Register User Subscription Click');
				}}
			>
				Next
			</button>
		</div>
	{/snippet}
</Card>

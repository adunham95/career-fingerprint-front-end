<script>
	import Card from '$lib/Compoenents/Containers/Card.svelte';
	import PageContainer from '$lib/Compoenents/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Compoenents/Containers/TwoColumn.svelte';
	import TextArea from '$lib/Compoenents/FormElements/TextArea.svelte';
	import TextInput from '$lib/Compoenents/FormElements/TextInput.svelte';
</script>

<PageContainer className="divide-y divide-gray-300">
	<TwoColumn title={'Account'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextInput
						className="sm:col-span-3"
						id="firstName"
						label="First Name"
						placeholder="Adrian"
					/>
					<TextInput
						className="sm:col-span-3"
						id="lastName"
						label="Last Name"
						placeholder="Dunham"
					/>
					<TextInput
						className="sm:col-span-6"
						id="email"
						label="Email"
						placeholder="adunham95@gmail.com"
					/>
					<TextInput className="sm:col-span-3" id="password" label="Password" />
					<TextInput className="sm:col-span-3" id="confirm-password" label="Confirm Password" />
				</div>
			</form>
			{#snippet actions()}
				<button type="submit" class="btn">Update</button>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Profile'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextArea className="sm:col-span-6" id="about" label="About" />
				</div>
			</form>
			{#snippet actions()}
				<button type="button" class="btn btn-text">Delete</button>
				<button type="submit" class="btn">Save</button>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Positions'} childrenClassName="space-y-4">
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextInput id="jobTitle" label="Title" className="sm:col-span-3" />
					<TextInput id="company" label="Company" className="sm:col-span-3" />
					<TextArea id="description" label="Description" className="sm:col-span-6" />
				</div>
			</form>
			{#snippet actions()}
				<button type="button" class="btn btn-text">Delete</button>
				<button type="submit" class="btn">Save</button>
			{/snippet}
		</Card>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextInput id="jobTitle" label="Title" className="sm:col-span-3" />
					<TextInput id="company" label="Company" className="sm:col-span-3" />
					<TextArea id="description" label="Description" className="sm:col-span-6" />
				</div>
			</form>
			{#snippet actions()}
				<button type="button" class="btn btn-text">Delete</button>
				<button type="submit" class="btn">Save</button>
			{/snippet}
		</Card>
	</TwoColumn>
</PageContainer>

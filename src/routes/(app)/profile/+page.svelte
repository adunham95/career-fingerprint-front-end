<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';

	const { data } = $props();
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
						value={data.user.firstName}
					/>
					<TextInput
						className="sm:col-span-3"
						id="lastName"
						label="Last Name"
						placeholder="Dunham"
						value={data.user.lastName}
					/>
					<TextInput
						className="sm:col-span-6"
						id="email"
						label="Email"
						placeholder="adunham95@gmail.com"
						value={data.user.email}
					/>
					<TextInput className="sm:col-span-3" id="password" label="Password" />
					<TextInput className="sm:col-span-3" id="confirm-password" label="Confirm Password" />
				</div>
			</form>
			{#snippet actions()}
				<button type="submit" class="btn btn--primary">Update</button>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Profile'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextArea className="sm:col-span-6" id="pitch" label="60 Second Pitch" />
					<Select
						label="What are you looking for?"
						className="sm:col-span-3"
						options={[{ id: 'growing', label: 'Growing my skillset' }]}
						value={data.user.lookingFor}
					/>
					<ImageUpload />
				</div>
			</form>
			{#snippet actions()}
				<button type="button" class="btn btn-text--error">Delete</button>
				<button type="submit" class="btn btn--primary">Save</button>
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
				<button type="button" class="btn btn-text--error">Delete</button>
				<button type="submit" class="btn btn--primary">Save</button>
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
				<button type="button" class="btn btn-text--error">Delete</button>
				<button type="submit" class="btn btn--primary">Save</button>
			{/snippet}
		</Card>
	</TwoColumn>
</PageContainer>

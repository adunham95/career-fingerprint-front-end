<script>
	import Card from '$lib/Compoenents/Containers/Card.svelte';
	import TextInput from '$lib/Compoenents/FormElements/TextInput.svelte';
</script>

<div class="inset-0 flex h-screen w-screen items-center justify-center">
	<Card headline="Sign in" contentClassName="space-y-3">
		<p>
			Not a member? <a href="/get-started" class=" text-primary hover:text-primary-800"
				>Create your account</a
			>
		</p>
		<TextInput id="email" label="Email" />
		<TextInput id="password" label="Password" type="password" />
		<div class="flex w-full justify-between pt-2">
			<button class="btn btn-text--primary btn-small">Forgot Password</button>
			<button class="btn btn-text--primary btn-small">Login</button>
		</div>
	</Card>
</div>

<style>
	:global(body) {
		background-image: url('/images/pexels-pixabay-434337.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>

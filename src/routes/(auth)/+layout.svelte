<script lang="ts">
	let { children } = $props();
</script>

<div class="inset-0 flex h-screen w-screen items-center justify-center">
	<img
		src="/images/pexels-pixabay-434337.jpg"
		alt="background"
		class="absolute inset-0 -z-10 size-full object-cover object-top"
	/>
	{@render children()}
</div>

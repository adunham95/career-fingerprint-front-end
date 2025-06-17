<script lang="ts">
	const { children, className = '' } = $props();
</script>

<div class={`mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 ${className}`}>
	{@render children()}
</div>

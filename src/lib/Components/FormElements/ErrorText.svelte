<script lang="ts">
	const { errorText }: { errorText?: string } = $props();
</script>

{#if errorText}
	<p class="mt-2 text-sm text-red-600">{errorText}</p>
{/if}

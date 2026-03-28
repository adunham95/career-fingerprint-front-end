<script lang="ts">
	const { errorText, id }: { errorText?: string | null; id?: string } = $props();
</script>

{#if errorText}
	<p {id} class="mt-2 text-sm text-red-600">{errorText}</p>
{/if}

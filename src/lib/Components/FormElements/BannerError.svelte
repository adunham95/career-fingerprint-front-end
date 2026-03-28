<script lang="ts">
	const { message }: { message: string | null } = $props();
</script>

{#if message}
	<div role="alert" class="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
		{message}
	</div>
{/if}

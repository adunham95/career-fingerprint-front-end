<script lang="ts">
	export let value: string | null;
	export let onSelect: (id: string) => void;

	const types = [
		{ id: 'quality', label: 'Quality', icon: '✨', color: 'bg-rose-50 border-rose-200' },
		{ id: 'efficiency', label: 'Efficiency', icon: '⚡', color: 'bg-blue-50 border-blue-200' },
		{
			id: 'collaboration',
			label: 'Collaboration',
			icon: '🤝',
			color: 'bg-green-50 border-green-200'
		},
		{ id: 'growth', label: 'Growth', icon: '📈', color: 'bg-yellow-50 border-yellow-200' }
	];
</script>

<div class="grid grid-cols-2 gap-4">
	{#each types as t}
		<div
			on:click={() => onSelect(t.id)}
			class={`cursor-pointer rounded-xl border p-5 text-center transition-all
				${value === t.id ? `${t.color} border-2` : 'border-gray-200 bg-white hover:bg-gray-50'}`}
		>
			<div class="mb-2 text-2xl">{t.icon}</div>
			<div class="font-medium">{t.label}</div>
		</div>
	{/each}
</div>

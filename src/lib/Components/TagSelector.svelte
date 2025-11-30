<script lang="ts">
	export let selected: string[] = [];
	export let onToggle: (tag: string) => void;

	const tags = [
		{
			id: 'communication',
			label: 'Communication',
			icon: '💬',
			color: 'bg-blue-50 border-blue-200'
		},
		{
			id: 'presentation',
			label: 'Presentation',
			icon: '🎤',
			color: 'bg-purple-50 border-purple-200'
		},
		{ id: 'leadership', label: 'Leadership', icon: '⭐', color: 'bg-yellow-50 border-yellow-200' },
		{
			id: 'collaboration',
			label: 'Collaboration',
			icon: '🤝',
			color: 'bg-green-50 border-green-200'
		},
		{ id: 'analytics', label: 'Analytics', icon: '📊', color: 'bg-pink-50 border-pink-200' },
		{
			id: 'problem-solving',
			label: 'Problem Solving',
			icon: '🧩',
			color: 'bg-orange-50 border-orange-200'
		}
	];
</script>

<div class="grid grid-cols-2 gap-4">
	{#each tags as t}
		<div
			on:click={() => onToggle(t.id)}
			class={`cursor-pointer rounded-xl border p-5 text-center transition-all
				${selected.includes(t.id) ? `${t.color} border-2` : 'border-gray-200 bg-white hover:bg-gray-50'}`}
		>
			<div class="mb-2 text-2xl">{t.icon}</div>
			<div class="font-medium">{t.label}</div>
		</div>
	{/each}
</div>

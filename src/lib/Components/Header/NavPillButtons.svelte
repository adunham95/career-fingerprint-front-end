<script lang="ts">
	interface Props {
		currentTab: string;
		tabs: { id: string; label: string }[];
	}

	let { currentTab = $bindable(), tabs }: Props = $props();
</script>

<div class="@container/navbuttons">
	<div class="grid grid-cols-1 @sm/navbuttons:hidden">
		<select
			bind:value={currentTab}
			aria-label="Select a tab"
			class="focus:outline-primary col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2"
		>
			{#each tabs as tab}
				<option value={tab.id}>{tab.label}</option>
			{/each}
		</select>
	</div>
	<div class="hidden @sm/navbuttons:block">
		<nav class="flex space-x-4" aria-label="Tabs">
			{#each tabs as tab}
				<button
					onclick={() => (currentTab = tab.id)}
					class={`rounded-md px-3 py-2 text-sm font-medium ${tab.id === currentTab ? 'bg-primary-300 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
					>{tab.label}
				</button>
			{/each}
			<!-- Current: "bg-indigo-100 text-indigo-700", Default: "text-gray-500 hover:text-gray-700" -->
		</nav>
	</div>
</div>

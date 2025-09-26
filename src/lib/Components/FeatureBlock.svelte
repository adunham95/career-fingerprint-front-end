<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';

	interface Props {
		title: string;
		description: string;
	}

	const { title, description }: Props = $props();
</script>

<div class="rounded-md border-3 border-amber-200 bg-amber-100 p-4">
	<div class="flex">
		<div class="shrink-0">
			<svg
				class="size-5 text-amber-400"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<div class="ml-3 w-full">
			<h3 class="text-sm font-medium text-amber-800">{title}</h3>
			<div class="mt-2 text-sm text-amber-700">
				<p>
					{description}
				</p>
				<div class="flex justify-end">
					<a
						href="/setting/membership/"
						onclick={() => trackingStore.trackAction('Upgrade Membership Click')}
						class=" rounded p-1 hover:bg-amber-900 hover:text-amber-200">Upgrade</a
					>
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';

	interface Props {
		dates: { title: string; description: string; date: Date; type?: 'achievement' }[];
	}

	const { dates }: Props = $props();
</script>

<div class="flow-root">
	<ul role="list" class="-mb-8">
		{#each dates as day, idx}
			<li>
				<div class="relative pb-8">
					{#if idx < dates.length - 1}
						<span class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"
						></span>
					{/if}
					<div class="relative flex items-start space-x-3">
						<div>
							<div class="relative px-1">
								<div
									class="flex size-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white"
								>
									{#if day.type === 'achievement'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											class="size-5 text-gray-500"
										>
											<path
												fill-rule="evenodd"
												d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								</div>
							</div>
						</div>
						<div
							class="hover:bg-secondary/20 min-w-0 flex-1 rounded p-2 transition-colors duration-300"
						>
							<div>
								<div class="text-sm">{day.title}</div>
								<p class="mt-0.5 text-sm text-gray-500">
									{formatDistanceToNow(day.date, { addSuffix: true })}
								</p>
							</div>
							<div class="mt-2 text-sm text-gray-700">
								<p>
									{day.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

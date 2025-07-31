<script lang="ts">
	import { formatDate } from 'date-fns';
	import type { Achievement } from '../../../app';
	import TimelineCategory from './TimelineCategory.svelte';

	interface Props {
		dates: Achievement[];
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
								</div>
							</div>
						</div>
						<div
							class="hover:bg-secondary/20 min-w-0 flex-1 rounded p-2 transition-colors duration-300"
						>
							<div>
								{#if day.startDate}
									<p class="text-lg text-gray-800">
										{formatDate(day.startDate, 'PPP')}
									</p>
								{/if}
								<div class="my-2 flex justify-start gap-1">
									{#if day.jobPosition}
										<TimelineCategory
											color="gray"
											text={day?.jobPosition?.name || ''}
											icon={buildingIcon}
										/>
									{/if}
									{#if day.education}
										<TimelineCategory
											color="gray"
											text={day?.education?.institution || ''}
											icon={schoolBuildingIcon}
										/>
									{/if}
									{#each day.tags as tag}
										<TimelineCategory color={tag.color} text={tag.name} />
									{/each}
								</div>
							</div>
							<div class="flex items-center">
								<svg
									viewBox="0 0 20 20"
									fill="currentColor"
									data-slot="icon"
									aria-hidden="true"
									class="size-5 text-green-500"
								>
									<path
										d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
										clip-rule="evenodd"
										fill-rule="evenodd"
									></path>
								</svg>
								<p class="ml-2 text-sm font-medium text-gray-500">
									{day.result}
								</p>
							</div>
							<div class="mt-2 flex items-center text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-5"
								>
									<path
										fill-rule="evenodd"
										d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
										clip-rule="evenodd"
									/>
								</svg>

								<p class="ml-2 text-sm font-medium text-gray-500">
									{day.description}
								</p>
							</div>
							<div class="mt-2 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-5"
								>
									<path
										d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z"
									/>
								</svg>

								<p class="ml-2 text-base font-medium text-gray-500">
									{day.myContribution}
								</p>
							</div>
						</div>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

{#snippet buildingIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-4"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
		/>
	</svg>
{/snippet}

{#snippet schoolBuildingIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-4"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
		/>
	</svg>
{/snippet}

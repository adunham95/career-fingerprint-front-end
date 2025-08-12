<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';
	import type { Meeting } from '../../app';
	import { format } from 'date-fns';

	interface Props {
		meetings: Meeting[];
	}

	const { meetings }: Props = $props();
</script>

<table class="min-w-full divide-y divide-gray-300">
	<thead>
		<tr>
			<th
				scope="col"
				class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
			>
				Name
			</th>
			<th
				scope="col"
				class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
				>Date</th
			>
			<th
				scope="col"
				class=" hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
				>Type</th
			>
			<th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
				<span class="sr-only">Select</span>
			</th>
		</tr>
	</thead>
	<tbody class="divide-y divide-gray-200 bg-white">
		{#each meetings as meeting}
			{@const date = new Date(meeting.time || '')}
			<tr>
				<td
					class="w-full max-w-0 py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0"
				>
					{meeting.title}
					<dl class="font-normal lg:hidden">
						<dt class="sr-only">Date</dt>
						<dd class="mt-1 truncate text-gray-700">
							{format(date, 'PPP p')}
						</dd>
						<dt class="sr-only sm:hidden">Type</dt>
						<dd class="mt-1 truncate text-gray-500 sm:hidden">{meeting.type}</dd>
					</dl>
				</td>

				<td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
					{format(date, 'PPP p')}
				</td>
				<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{meeting.type}</td>
				<td class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-0">
					<a
						href={`/meetings/${meeting.id}`}
						onclick={() => {
							trackingStore.trackAction('View Meeting Click');
						}}
						class="btn btn-text--primary"
					>
						View
					</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import { formatDate } from 'date-fns';

	const { data } = $props();

	console.log(data);
</script>

<PageContainer>
	<div class="mt-8 mb-12 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<table class="relative min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th
								scope="col"
								class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
								>Name</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Email</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Stripe Customer ID</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Created At</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.users || [] as user}
							<tr>
								<td
									class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0"
									>{user.firstName} {user.lastName}</td
								>
								<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{user.email}</td>
								<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
									>{user.stripeCustomerID}</td
								>
								<td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
									>{formatDate(user.createdAt, 'Pp')}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</PageContainer>

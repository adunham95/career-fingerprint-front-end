<script>
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
</script>

<PageContainer className="py-6">
	<h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
		John Smiths Career Fingerprint
	</h2>
	<dl class="grid grid-cols-1 sm:grid-cols-2">
		<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
			<dt class="text-sm/6 font-medium text-gray-900">Title</dt>
			<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">Job Title</dd>
		</div>
		<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
			<dt class="text-sm/6 font-medium text-gray-900">Company</dt>
			<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">Company Here</dd>
		</div>
		<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
			<dt class="text-sm/6 font-medium text-gray-900">Location</dt>
			<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">Location Here</dd>
		</div>
		<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
			<dt class="text-sm/6 font-medium text-gray-900">Date</dt>
			<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">Start - Current</dd>
		</div>
		<div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
			<dt class="text-sm/6 font-medium text-gray-900">Summary</dt>
			<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">
				Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
				consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in
				ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui
				eu.
			</dd>
		</div>
	</dl>
</PageContainer>

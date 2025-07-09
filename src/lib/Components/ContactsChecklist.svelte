<script lang="ts">
	interface Props {
		title: string;
		contacts: { id: string; name: string; email: string }[];
	}

	const { title }: Props = $props();
</script>

<fieldset>
	<legend class="text-base font-semibold text-gray-900">{title}</legend>
	<div class="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
		<div class="relative flex gap-3 py-4">
			<div class="min-w-0 flex-1 text-sm/6">
				<label for="person-1" class="font-medium text-gray-900 select-none">
					<p class="text-sm/6 font-semibold text-gray-900">Leslie Alexander</p>
					<p class="mt-1 truncate text-xs/5 text-gray-500">leslie.alexander@example.com</p>
				</label>
			</div>
			<div class="flex h-6 shrink-0 items-center">
				<div class="group grid size-4 grid-cols-1">
					<input
						id="person-1"
						name="person-1"
						type="checkbox"
						checked
						class="checked:border-primary-600 checked:bg-primary-600 indeterminate:border-primary-600 indeterminate:bg-primary-600 focus-visible:outline-primary-600 col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
					/>
					<svg
						class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
						viewBox="0 0 14 14"
						fill="none"
					>
						<path
							class="opacity-0 group-has-checked:opacity-100"
							d="M3 8L6 11L11 3.5"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							class="opacity-0 group-has-indeterminate:opacity-100"
							d="M3 7H11"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</fieldset>

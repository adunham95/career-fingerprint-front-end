<script lang="ts">
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/stores/toast';
	import Label, { type LabelProps } from './Label.svelte';

	let isLoading = $state(false);

	interface Props extends LabelProps {
		className?: string;
		value?: string | null;
	}

	let {
		id,
		label,
		hideLabel,
		className = '',
		labelClassName,
		value = $bindable()
	}: Props = $props();

	async function uploadImage(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		isLoading = true;
		let file = e?.currentTarget?.files?.[0];
		if (!file) {
			toastStore.show({ type: 'error', message: 'No File Selected' });
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			const data = await res.json();
			if (data.success) {
				toastStore.show({ type: 'success', message: 'Upload successful' });
				console.log(data);
				value = data.result.variants[0];
			} else {
				toastStore.show({ type: 'error', message: 'Upload failed' });
				console.error(data.errors);
			}
		} catch (err: unknown) {
			toastStore.show({ type: 'error', message: 'Upload failed' });
			console.log(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class={className}>
	<Label {id} {label} {hideLabel} {labelClassName} />
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<label
		for={id}
		class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 relative"
	>
		<input class="sr-only" {id} type="file" accept="image/*" onchange={uploadImage} />

		<div>
			<div class="flex justify-center items-center">
				{#if isLoading}
					<Loader />
				{:else if value}
					<img src={value} class="mx-auto size-12" alt="Uploaded" />
				{:else}
					<svg
						class="mx-auto size-12 text-gray-300"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							fill-rule="evenodd"
							d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</div>
			<div class="mt-4 flex text-sm/6 text-gray-600">
				<p class="text-xs text-gray-600">Click to upload a PNG, JPG, GIF up to 10MB</p>
			</div>
		</div>
	</label>
</div>

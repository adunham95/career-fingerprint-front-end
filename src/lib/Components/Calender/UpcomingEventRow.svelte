<script lang="ts">
	interface Props {
		imageURL?: string;
		type?: 'Interview' | 'Review' | '1:1';
		name: string;
		eventTime: Date;
	}

	const { imageURL, type = 'Interview', name, eventTime }: Props = $props();
</script>

<li class="relative flex gap-x-6 py-6 xl:static">
	{#if imageURL}
		<img src={imageURL} alt="" class="size-14 flex-none rounded-full" />
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="size-14 rounded-full border p-2"
		>
			<path
				fill-rule="evenodd"
				d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
	<div class="flex-auto">
		<div class="flex justify-start">
			<h3 class=" pr-10 font-semibold text-gray-900 xl:pr-0">{name}</h3>
		</div>
		<dl class="mt-2 flex flex-col text-gray-500 xl:flex-row">
			<div class="flex items-start gap-x-3">
				<dt class="mt-0.5">
					<span class="sr-only">Date</span>
					<svg
						class="size-5 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							fill-rule="evenodd"
							d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
							clip-rule="evenodd"
						/>
					</svg>
				</dt>
				<dd>
					<time datetime={eventTime.toString()}>{eventTime.toDateString()}</time>
				</dd>
			</div>
			<div
				class="mt-2 flex items-start gap-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400/50 xl:pl-3.5"
			>
				<dt class="mt-0.5">
					<span class="sr-only">Meeting Type</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						data-slot="icon"
						class="size-5 text-gray-400"
					>
						<path
							fill-rule="evenodd"
							d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
							clip-rule="evenodd"
						/>
					</svg>
				</dt>
				<dd>{type}</dd>
			</div>
		</dl>
	</div>
	<div class="flex flex-col justify-end">
		<button class="btn btn-text--primary btn-small">Prep</button>
		<a href="/cheatsheet" class="btn btn-text--secondary btn-small">Start</a>
	</div>
</li>

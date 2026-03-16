<script>
	import { PUBLIC_LINKEDIN_LOGIN_ENABLED } from '$env/static/public';
</script>

{#if PUBLIC_LINKEDIN_LOGIN_ENABLED === 'true'}
	<button
		type="button"
		class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:inset-ring-transparent"
	>
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
			<rect width="24" height="24" rx="4" fill="#0077b5" />
			<path
				d="M7.2 10H4.8v9.6h2.4V10zM6 8.8c-.8 0-1.4-.6-1.4-1.4S5.2 6 6 6s1.4.6 1.4 1.4S6.8 8.8 6 8.8zM19.2 14.4c0-2.4-1.2-4.4-3.6-4.4-1.2 0-2 .6-2.4 1.2V10H10.8v9.6h2.4v-4.8c0-1.2.4-2.4 1.6-2.4 1.2 0 1.6 1.2 1.6 2.4v4.8h2.4l.4-5.2z"
				fill="#fff"
			/>
		</svg>
		<span class="text-sm/6 font-semibold">Linkedin</span>
	</button>
{/if}

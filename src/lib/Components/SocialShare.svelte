<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';

	let {
		url = 'https://example.com',
		text = 'Check this out!',
		variant = 'inline' // 'inline' | 'floating'
	} = $props();

	const encUrl = $derived(encodeURIComponent(url));
	const encText = $derived(encodeURIComponent(text));

	const hasNativeShare = $derived(!!navigator?.share);

	type Link = { name: string; href: string; colorHex: string; icon: any };

	const links: Link[] = $derived([
		{
			name: 'Twitter',
			href: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encText}`,
			colorHex: '#000000',
			icon: IconTwitter
		},
		{
			name: 'Facebook',
			href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
			colorHex: '#0866FF',
			icon: IconFacebook
		},
		{
			name: 'LinkedIn',
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
			colorHex: '#007EBB',
			icon: IconLinkedIn
		},
		{
			name: 'WhatsApp',
			href: `https://api.whatsapp.com/send?text=${encText}%20${encUrl}`,
			colorHex: '#25D366',
			icon: IconWhatsApp
		},
		{
			name: 'Email',
			href: `mailto:?subject=${encText}&body=${encUrl}`,
			colorHex: '#4E5E6A',
			icon: IconMail
		}
	]);

	// WEB SHARE API (optional nicer UX on mobile)
	function nativeShare() {
		if (navigator.share) {
			navigator.share({ title: document.title, text, url }).catch(() => {});
		} else {
			// Fallback: copy URL
			navigator.clipboard?.writeText(url);
		}
	}

	// CONTAINER CLASSES (derived by variant)
	const containerClass = $derived(
		variant === 'floating'
			? 'fixed bottom-6 right-6 flex flex-col gap-3 z-40'
			: 'flex items-center gap-3'
	);
</script>

{#snippet IconTwitter()}
	<svg
		class="h-5 w-5"
		fill="currentColor"
		role="img"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>X</title>
		<path
			d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
		/>
	</svg>
{/snippet}
{#snippet IconFacebook()}
	<svg
		class="h-5 w-5"
		viewBox="0 0 24 24"
		aria-hidden="true"
		fill="currentColor"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		><title>Facebook</title><path
			d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
		/></svg
	>
{/snippet}
{#snippet IconLinkedIn()}
	<svg
		class="h-5 w-5"
		aria-hidden="true"
		fill="currentColor"
		height="72"
		viewBox="0 0 72 72"
		width="72"
		><path
			d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
		/>
	</svg>
{/snippet}
{#snippet IconWhatsApp()}
	<svg
		class="h-5 w-5"
		viewBox="0 0 24 24"
		aria-hidden="true"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>WhatsApp</title>
		<path
			d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
		/>
	</svg>
{/snippet}
{#snippet IconMail()}
	<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
		<path d="M2 4h20v16H2z" opacity=".2" /><path
			d="M2 6l10 7 10-7V4H2v2zM2 20h20V8l-10 7L2 8v12z"
		/>
	</svg>
{/snippet}
{#snippet IconShare()}
	<svg class="h-5 w-5" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
		/>
	</svg>
{/snippet}

<!-- Reusable BUTTON as a SNIPPET -->
{#snippet ShareButton(link: Link)}
	<a
		href={link.href}
		target="_blank"
		rel="noopener noreferrer"
		style={`background: ${link.colorHex}`}
		class={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition hover:opacity-85 active:opacity-75 `}
		aria-label={`Share on ${link.name}`}
		onclick={() => trackingStore.trackAction('Social Share', { type: link.name })}
	>
		{@render link.icon()}
		<span class="sr-only">Share to {link.name}</span>
	</a>
{/snippet}

<!-- Optional native share button -->
{#snippet NativeShareButton()}
	<button
		type="button"
		class="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition hover:opacity-85 active:opacity-75"
		onclick={() => {
			nativeShare();
			trackingStore.trackAction('Social Share', { type: 'Share Sheet' });
		}}
		aria-label="Share"
		title="Share"
	>
		{@render IconShare()}
	</button>
{/snippet}

<!-- RENDER -->
<div class={containerClass}>
	{#if hasNativeShare}
		{@render NativeShareButton()}
	{/if}

	{#each links as link}
		{@render ShareButton(link)}
	{/each}
</div>

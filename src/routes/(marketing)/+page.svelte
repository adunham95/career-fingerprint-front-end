<script>
	import Card from '$lib/Compoenents/Containers/Card.svelte';
</script>

<div class="relative">
	<div class="mx-auto max-w-7xl">
		<div class="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
			<svg
				class="fill-background absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform lg:block"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<polygon points="0,0 90,0 50,100 0,100" />
			</svg>

			<div class="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
				<div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
					<h1
						class="font-title text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl"
					>
						Build your custom career story
					</h1>
					<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
						Track your accomplishments, craft standout resumes, and prepare for every opportunity
						with confidence.
					</p>
					<div class="mt-10 flex items-center gap-x-6">
						<a href="/get-started" class="btn btn--primary">Build My Fingerprint</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class=" lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
		<img
			class="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
			src="https://images.unsplash.com/photo-1483389127117-b6a2102724ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"
			alt=""
		/>
	</div>
</div>

<div class="bg-background overflow-hidden py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div
			class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
		>
			<div class="lg:pt-4 lg:pr-8">
				<div class="lg:max-w-lg">
					<h2 class="text-primary text-base/7 font-semibold">How it works</h2>
					<p
						class="font-title mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
					>
						Capture your career
					</p>
					<p class="mt-6 text-lg/8 text-gray-600">
						Don’t let your achievements get lost in emails, docs, or memory. Career Fingerprint
						gives you one organized place to track wins, reflect on progress, and prep for your next
						move.
					</p>
					<dl class="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
						<div class="relative pl-9">
							<dt class="inline font-semibold text-gray-900">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="text-primary absolute top-1 left-1 size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
									/>
								</svg>
								Weekly Email Reminders
							</dt>
							<dd class="inline">Get a weekly reminder to fill out achievements</dd>
						</div>
						<div class="relative pl-9">
							<dt class="inline font-semibold text-gray-900">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="text-primary absolute top-1 left-1 size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
									/>
								</svg>

								Resumé Ready
							</dt>
							<dd class="inline">Easily transform entries into polished resume bullets.</dd>
						</div>
						<div class="relative pl-9">
							<dt class="inline font-semibold text-gray-900">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="text-primary absolute top-1 left-1 size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
									/>
								</svg>

								Interview prep
							</dt>
							<dd class="inline">
								Prep for an interview and get a detailed interview screen where you can view all
								your achievements, resume, job description and previous notes on a single screen
							</dd>
						</div>
					</dl>
				</div>
			</div>
			<img
				src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
				alt="Product screenshot"
				class="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0"
				width="2432"
				height="1442"
			/>
		</div>
	</div>
</div>

<div class="bg-secondary py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-primary text-base/7 font-semibold">Who its for</h2>
			<p
				class="font-title mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance"
			>
				Built for every stage of your journey
			</p>
			<p class="mt-6 text-lg/8 text-gray-100">
				Career Fingerprint adapts to your needs—whether you're thriving in your current role,
				exploring what's next, or just getting started.
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
			<dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="text-primary size-5 flex-none"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
							/>
						</svg>

						Current professionals
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base/7 text-gray-200">
						<p class="flex-auto">
							Track progress, prep for reviews, and refine your resume over time.
						</p>
					</dd>
				</div>
				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="text-primary size-5 flex-none"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
							/>
						</svg>

						Students & recent grads
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base/7 text-gray-200">
						<p class="flex-auto">
							Build confidence with a record of growth from internships to your first job.
						</p>
					</dd>
				</div>
				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="text-primary size-5 flex-none"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
							/>
						</svg>
						Career switchers
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base/7 text-gray-200">
						<p class="flex-auto">
							Reflect on your story and tailor it to new opportunities and industries.
						</p>
					</dd>
				</div>
			</dl>
		</div>
	</div>
</div>

<section class="bg-background px-6 py-24 sm:py-32 lg:px-8">
	<figure class="mx-auto max-w-2xl">
		<p class="sr-only">5 out of 5 stars</p>
		<div class="text-primary flex gap-x-1">
			<svg
				class="size-5 flex-none"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				class="size-5 flex-none"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				class="size-5 flex-none"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				class="size-5 flex-none"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
					clip-rule="evenodd"
				/>
			</svg>
			<svg
				class="size-5 flex-none"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				data-slot="icon"
			>
				<path
					fill-rule="evenodd"
					d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<blockquote class="mt-10 text-xl/8 font-semibold tracking-tight text-gray-900 sm:text-2xl/9">
			<p>
				“Career Fingerprint helped me realize just how much I’d achieved. I walked into my
				performance review fully prepared to got the promotion I wanted.”
			</p>
		</blockquote>
		<figcaption class="mt-10 flex items-center gap-x-6">
			<img
				class="size-12 rounded-full bg-gray-50"
				src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
				alt=""
			/>
			<div class="text-sm/6">
				<div class="font-semibold text-gray-900">Judith Black</div>
				<div class="mt-0.5 text-gray-600">CEO of Workcation</div>
			</div>
		</figcaption>
	</figure>
</section>

<div class="bg-secondary">
	<div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2
				class="font-title text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl"
			>
				Start building your fingerprint
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-100">
				Your career is unique your tools should be too. Begin capturing your journey and building
				your future with Career Fingerprint.
			</p>
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<a href="/get-started" class="btn">Get started with your own fingerprint</a>
			</div>
		</div>
	</div>
</div>

<div class=" py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-primary text-base/7 font-semibold">Pricing that works for you</h2>
			<p
				class="font-title mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl"
			>
				Plans that grow with your career
			</p>
		</div>
		<p
			class="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8"
		>
			Start free, and upgrade when you're ready to take your career story to the next level.
		</p>

		<div class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2">
			<Card headline="Free">
				<p class="text-sm/6 text-gray-600">Perfect for students and early professionals</p>
				<p class="mt-6 flex items-baseline gap-x-1">
					<span class="text-4xl font-semibold tracking-tight text-gray-900">Free</span>
				</p>
				<ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600">
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Basic Resume
					</li>
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Manual Achievement Entry
					</li>
				</ul>
			</Card>
			<Card headline="Elevate">
				<p class="text-sm/6 text-gray-600">For active professionals and job switchers</p>
				<p class="mt-6 flex items-baseline gap-x-1">
					<span class="text-4xl font-semibold tracking-tight text-gray-900">$9.99</span>
					<span class="text-sm/6 font-semibold text-gray-600">/month</span>
				</p>
				<ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600">
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Resume Editor
					</li>
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Weekly Achievement Reminders
					</li>
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Interview Prep Tools
					</li>
				</ul>
			</Card>
		</div>
	</div>
</div>

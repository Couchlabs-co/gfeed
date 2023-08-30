<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	const { Count, Items } = data;
</script>

<diV class="w-full rounded">
	{#if Items?.length}
		{#each Items as post}
			<div
				class="max-w-full p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<a
					href={post.link}
					target="_blank"
					class="flex lg:max-w-max items-center bg-white md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
				>
					<div class="flex flex-col justify-between p-4 leading-normal">
						<h5 class="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
							{post.title}
						</h5>
						<div class="flex-1 min-w-0">
							<p
								class="text-sm font-medium text-gray-900 truncate dark:text-white hover:text-gray-400"
							>
								By {post.author}, published on {post.pubDate},
								{post.publisher}
							</p>
						</div>
						<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
							{@html post.description}
						</p>
					</div>
				</a>
				<div class="grid grid-cols-2 gap-4">
					{#if post.category}
						{#each post.category.split(',') as category}
							<div class="badge badge-primary">
								{category}
							</div>
						{/each}
					{/if}
					<!-- <div class="flex space-x-2"> -->
					<a href="#!" role="button">
						<!-- Facebook -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							style="color: #1877f2"
							viewBox="0 0 24 24"
						>
							<path
								d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
							/>
						</svg>
					</a>

					<a href="#!" role="button">
						<!-- Instagram -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							style="color: #c13584"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
							/>
						</svg>
					</a>

					<!-- Linkedin -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="currentColor"
						style="color: #0077b5"
						viewBox="0 0 24 24"
					>
						<path
							d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
						/>
					</svg>

					<a href="#!" role="button">
						<!-- X -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="currentColor"
							style="color: #1da1f2"
							viewBox="0 0 24 24"
						>
							<path
								d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
							/>
						</svg>
					</a>
				</div>
				<ul class="menu menu-horizontal bg-base-200 rounded-box">
					<li>
						<a href="#!">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/></svg
							>
						</a>
					</li>
					<li>
						<a href="#!">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
						</a>
					</li>
					<li>
						<a href="#!">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/></svg
							>
						</a>
					</li>
				</ul>
			</div>
		{/each}
	{:else}
		<div role="status" class="max-w-sm animate-pulse">
			<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
			<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
			<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
			<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5" />
			<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5" />
			<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
			<span class="sr-only">Loading...</span>
		</div>
	{/if}
</diV>

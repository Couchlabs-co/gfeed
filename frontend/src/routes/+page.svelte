<script lang="ts">
	import { page } from "$app/stores";
</script>

<section class="bg-white">
	<div class="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
		<div class="place-self-center mr-auto lg:col-span-12">
			<h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl">Place to find what really matters to you</h1>
			<p class="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">GFeed changes the way you consume information. Your time is precious, and that's why GFeed puts you in control.</p>
			<a href="/api/auth/login?post_login_url={$page.url.origin}/discover" class="btn btn-neutral"> 
				Get Started
				<svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
			</a>
		</div>
	</div>
</section>

<section class="bg-gray-50 dark:bg-gray-800">
	<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
		<div class="mb-8 max-w-screen-lg lg:mb-16">
			<h2 class="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">Your Interests, Your Feed</h2>
			<p class="text-gray-500 sm:text-xl dark:text-gray-400">
				GFeed takes the complexity out and creates a simple personalized content stream tailored to your interests.
				Whether you're a tech enthusiast, a foodie, a sports fan, or have any other passion, we've got you covered.
			</p>
		</div>
		<div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
			<div>
				<div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hourglass"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Save Time</h3>
				<p class="text-gray-500 dark:text-gray-400">
					No more endless scrolling through irrelevant content. GFeed delivers what you want, when you want it.
				</p>
			</div>
			<div>
				<div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
					<svg class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg>
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Stay Informed</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Get the latest news, trends, and updates on topics that interest you the most.
				</p>
			</div>
			<div>
				<div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
					<svg class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path></svg>                    
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">User-Friendly</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Our intuitive interface makes it easy for anyone to get started, no tech-savvy skills required.
				</p>
			</div>
			<div>
				<div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Diverse Sources</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Access articles from well-established publishers to independent blogs, all in one place.
					Explore different perspectives without the hassle of opening multiple tabs.
				</p>
			</div>
			<div>
				<div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Interactions That Matter</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Our intelligent system learns from your interactions to provide a feed that's uniquely yours.
				</p>
			</div>
			<div>
				<div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-square"><path d="M12.4 2.7c.9-.9 2.5-.9 3.4 0l5.5 5.5c.9.9.9 2.5 0 3.4l-3.7 3.7c-.9.9-2.5.9-3.4 0L8.7 9.8c-.9-.9-.9-2.5 0-3.4Z"/><path d="m14 7 3 3"/><path d="M9.4 10.6 2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4"/></svg>
				</div>
				<h3 class="mb-2 text-xl font-bold dark:text-white">Privacy First</h3>
				<p class="text-gray-500 dark:text-gray-400">
					Your data is safe with us. We prioritize your privacy and ensure your information is protected. We only save your Name and preferences you select on GFeed.
				</p>
			</div>
		</div>
	</div>
  </section>

  <section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-sm text-center">
			<a type="button" class="btn" href="/api/auth/login?post_login_url={$page.url.origin}/discover">
				Start today
				<svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
			</a>
		</div>
	</div>
</section>

<style lang="postcss">
	:global(html) {
		scroll-behavior: smooth;
		align-items: center;
	}
</style>

<script lang="ts">

	import { page } from "$app/stores";
	import ProfilePic from '../components/ProfileHeader.svelte';

	const navLinks = [
		{ name: 'Discover', href: '/discover' },
		{ name: 'Features', href: '/features' },
		{ name: 'Sources', href: '/source' },
		{ name: 'Privacy', href: '/privacy' },
		{ name: 'Profile', href: '/profile' },
	];


</script>

<div>
	<div class="navbar bg-base-100">
		<div class="navbar-start">
		  <div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
			  <svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
				  stroke-linecap="round"
				  stroke-linejoin="round"
				  stroke-width="2"
				  d="M4 6h16M4 12h8m-8 6h16" />
			  </svg>
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul
			  tabindex="0"
			  class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
			  {#each navLinks as link}
				<li>
					<a
						href='{link.href}'
						class="text-sm font-semibold leading-6 text-gray-900 hover:bg-inherit"
						aria-current="page"
						data-sveltekit-preload-data="off">{link.name}</a>
				</li>
			{/each}
			</ul>
		  </div>
		  <a href="/" class="btn btn-ghost normal-case text-xl sm:text-2xl md:text-3xl hover:bg-inherit">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-tree"><path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/></svg>
			<span class="self-center text-2xl sm:text-3xl md:text-4xl font-semibold whitespace-nowrap">
				GFeed
			</span>
		</a>
		</div>
		<div class="navbar-center hidden lg:flex">
		  <ul class="menu menu-horizontal px-1">
			{#each navLinks as link}
				<li>
					<a
						href='{link.href}'
						class="text-sm font-semibold leading-6 text-gray-900 hover:bg-inherit"
						aria-current="page"
						data-sveltekit-preload-data="off">{link.name}</a>
				</li>
			{/each}
		  </ul>
		</div>
		<div class="navbar-end">
			<div class="m-2">
				{#if $page.data.user}
					<a href="/api/auth/logout" class="text-sm font-semibold leading-6 text-gray-900" aria-current="page" data-sveltekit-preload-data="off">Log Out</a>
				{:else}
					<a href='/api/auth/login' class="text-sm font-semibold leading-6 text-gray-900" aria-current="page" data-sveltekit-preload-data="off">Sign In</a>
				{/if}
			</div>
			{#if $page.data.user?.picture}
				<ProfilePic pic={$page.data.user?.picture ?? ''}/>
			{/if}
		</div>
	  </div>
	<!-- <header class="bg-white">
		<nav class="my-auto flex max-w-full items-center p-2 lg:px-8" aria-label="Global">
			<div class="flex lg:flex-1">
				<a href="/" class="btn btn-ghost normal-case text-xl sm:text-2xl md:text-3xl">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-tree"><path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/></svg>
					<span class="self-center text-2xl sm:text-3xl md:text-4xl font-semibold whitespace-nowrap">
						GFeed
					</span>
				</a>	
			</div>
			<div class="flex lg:hidden">
				<button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
				  <span class="sr-only">Open main menu</span>
				  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
				  </svg>
				</button>
			  </div>
			  <div class="hidden lg:flex lg:gap-x-12">
					{#each navLinks as link}
						<a
							href='{link.href}'
							class="text-sm font-semibold leading-6 text-gray-900"
							aria-current="page"
							data-sveltekit-preload-data="off">{link.name}</a>
					{/each}
			</div>
			<div class="hidden lg:flex lg:flex-1 lg:justify-end">
				<ul class="menu menu-horizontal px-1">
				{#if $page.data.user}
					<li>
						<a href="/api/auth/logout" class="text-sm font-semibold leading-6 text-gray-900" aria-current="page" data-sveltekit-preload-data="off">Log Out</a>
					</li>
				{:else}
					<li>
						<a href='/api/auth/login' class="text-sm font-semibold leading-6 text-gray-900" aria-current="page" data-sveltekit-preload-data="off">Sign In</a>
					</li>
				{/if}
				</ul>
				{#if $page.data.user?.picture}
					<ProfilePic pic={$page.data.user?.picture ?? ''}/>
				{/if}
			</div>
		</nav>
	</header> -->
</div>

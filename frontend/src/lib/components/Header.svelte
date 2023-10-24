<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from "$app/stores";
	import ProfilePic from '../components/ProfileHeader.svelte';
	import SearchBox from '../components/Search/SearchBox.svelte';

	const navLinks = [
		{ name: 'Feed', href: 'rcfeed' },
		{ name: 'Sources', href: 'source'},
		{ name: 'Profile', href: 'profile' },
	];

	const SignOut = () => {
		signOut({
			callbackUrl: `${$page.url.origin}`,
		});
	};

</script>

<div class="navbar mb-2 border-b-2 bg-white">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost normal-case text-xl">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-tree"><path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/></svg>
			<span class="self-center text-2xl font-semibold whitespace-nowrap">
				IntelliFeed
			</span>
		</a>
	</div>
	<div class="navbar-center lg:flex">
		<ul class="menu menu-horizontal px-1">
			{#each navLinks as link}
				<li>
					<a
						href='{link.href}'
						on:focus={() => console.log('focus')}
						class="text-sm font-semibold leading-6 text-gray-900"
						aria-current="page"
						data-sveltekit-preload-data="off">{link.name}</a>
				</li>
			{/each}
		</ul>
		<!-- </div> -->
	</div>
	<div class="navbar-end">
		<SearchBox />
		<ul class="menu menu-horizontal px-1">
		{#if Object.keys($page.data.session || {}).length}
			{#if $page.data.session?.user}
				<li>
					<button type="button" on:click={SignOut} class="text-sm font-semibold leading-6 text-gray-900">
						Log Out
					</button>
				</li>
			{/if}
		{:else}
			<li>
				<button type="button" on:click={() => signIn(
					'auth0', {
						redirect: false,
						callbackUrl: `${$page.url.origin}`,
					},
					{
						scope: 'api openid profile email offline_access'
					}
				)} class="text-sm font-semibold leading-6 text-gray-900">
					Log In
				</button>
			</li>
		{/if}
		</ul>
		{#if $page.data.session?.user?.name}
			<ProfilePic pic={$page.data.session?.user?.image ?? ''}/>
		{/if}
	</div>
</div>

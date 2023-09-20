<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from "$app/stores";
	import ProfilePic from '../components/ProfileHeader.svelte';

	const navLinks = [
		{ name: 'Feed', href: 'rcfeed' },
		{ name: 'Pricing', href: 'pricing' },
		{ name: 'Profile', href: 'profile' },
	];

	const SignOut = () => {
		signOut({
			callbackUrl: `${$page.url.origin}`,
		});
	};

</script>

<div class="navbar bg-white">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost normal-case text-xl">
			<img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="Flowbite Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap">
				Reading Corner
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

		<!-- </div> -->
	</div>
	<div class="navbar-end">
		{#if $page.data.session?.user?.name}
			<ProfilePic pic={$page.data.session?.user?.image ?? ''}/>
		{/if}
	</div>
</div>

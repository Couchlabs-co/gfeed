<script lang="ts">
	import { signIn } from "@auth/sveltekit/client";
    import { page } from "$app/stores";

</script>

<div class="max-h-full content-center my-40 mx-auto">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => signIn(
        'auth0', {
            redirect: false,
            callbackUrl: `${$page.url.origin}`,
        },
        {
            scope: 'api openid profile email offline_access'
        })}>
        Sign In
    </button>
</div>
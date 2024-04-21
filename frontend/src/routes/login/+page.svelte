<script lang="ts">
    import { page } from "$app/stores";

</script>

<div class="max-h-full content-center my-40 mx-auto">
    <a href="/api/auth/login?post_login_url={$page.url.origin}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button"> 
        Sign In
    </a>
</div>
<script lang="ts">
	import { userAction } from "$lib/userActions";
    import { Ban } from 'lucide-svelte';
    export let bookmarks: any[];
    export let userId: string;

</script>

<div>
    <div class="p-3 shadow-sm rounded-sm">
        <h2>Library</h2>
        <div class="mt-4">
        <table class="table">
            <thead>
                <tr>
                    <th class="text-lg text-black">My saved pieces</th>
                </tr>
            </thead>
                {#each bookmarks as bookmark }
                    <tr>
                        <td class="text-base text-black">
                            <article>
                                <a href="/" class="link link-hover" target="_blank">
                                    {bookmark.content}
                                </a>
                            </article>
                            <button class="btn btn-square btn-outline bg-danger" on:click={() => userAction(userId, bookmark.content, "delBookmark", "post", bookmark.contentLink, bookmark.contentId)}><Ban /></button>
                        </td>
                    </tr>
                {/each}
        </table>
    </div>
    </div>
</div>
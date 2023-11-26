<script lang="ts">
    import { Ban, Check } from 'lucide-svelte';
    import { userAction } from '$lib/userActions.js';
    export let userId: string;
    export let bookmarks: any[];
</script>

<div>
    <div class="p-3 shadow-sm rounded-sm">
        <h2>Procastinate I say..</h2>
        <table class="table">
            <thead>
                <tr>
                    <th class="text-lg text-black">Articles</th>
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
                            <button class="btn btn-square btn-outline bg-danger"><Ban /></button>
                        </td>
                    </tr>
                {/each}
        </table>
    </div>
</div>
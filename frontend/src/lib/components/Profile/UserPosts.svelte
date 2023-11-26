<script lang="ts">
    import { userAction } from '$lib/userActions.js';
    export let userPosts: any[];
    export let userId: string;

</script>

<div>
    <div class="p-3 shadow-sm rounded-sm">
        <h2>Worth Reading...</h2>
        <table class="table">
            <thead>
                <tr>
                    <th class="text-lg text-black">Articles</th>
                </tr>
            </thead>
                {#each userPosts as item}
                    <tr>
                        <td class="text-base text-black">
                            <article>
                                <a href={item.contentLink} class="link link-hover" target="_blank" on:click={()=> userAction(userId, item.title, "viewed", "post", item.link, item.id)}>
                                    {item.content}
                                </a>
                            </article>
                        </td>
                    </tr>
                {/each}
        </table>
    </div>
</div>
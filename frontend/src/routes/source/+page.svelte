<script lang="ts">
    import { Star, StarOff } from 'lucide-svelte';

    /** @type {import('./$types').PageData} */
	export let data;
    
    const { session } = data;


    const { Items } = data.data;

    async function userAction(title: string, action: string, type: string) {
        const res = await fetch("/api/engage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                action,
                type,
                userId: session.user.id,
            }),
        });
        const data = await res.json();
        console.log(data);
    }

</script>
<div>
    <h3 class="mt-2 mb-2">
        Some of the sources we pull data from to make sure you have latest content
    </h3>
    <div class="overflow-x-auto h-max w-9/12 items-center place-content-center m-auto">
        <table class="table">
        <thead>
          <tr>
            <th class="text-2xl">Publishers</th>
          </tr>
        </thead>
        <tbody>
            {#each Items as item}
                <tr>
                    <td class="w-60">
                        {#if item.logo}
                            <img src={item.logo} alt={item.name} width="32" height="32"/>
                        {:else}
                            <div class="avatar placeholder">
                                <div class="bg-neutral-focus text-neutral-content rounded w-10">
                                    <span>{item.name}</span>
                                </div>
                            </div> 
                        {/if}
                    </td>

                    <td class="w-96"><span class="text-xl font-semibold">{item.name}</span></td>
                    <td class="w-20">
                        <button class="btn btn-square btn-outline" on:click={() => userAction(item.name, "likes", "publisher")}>
                            <Star />
                        </button>
                    </td>
                    <td class="w-20">
                        <button class="btn btn-square btn-outline" on:click={() => userAction(item.name, "dislikes", "publisher")}>
                            <StarOff />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
        </table>
      </div>
</div>
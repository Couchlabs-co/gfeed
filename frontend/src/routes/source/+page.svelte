<script lang="ts">
    import { gFeedStore } from '../../store';
    import { Star, StarOff, ShieldCheck } from 'lucide-svelte';
    import { userAction } from '../../lib/userActions';

	export let data;
    
    const { session } = data;
    let likeIndex = -1;
    let dislikeIndex = -1;

    const { Items } = data.data;
        $gFeedStore.sources = Items.lenght? Items: [];
    let pageIndex = 0;
    let pageSize = 10;
    const totalPages = Math.ceil(Items.length / pageSize);
    let visibileRows = Items.slice(pageIndex, pageIndex + pageSize);

    async function changePage(index: number) {
        let pageIndex = index;
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        visibileRows = Items.slice(start, end);
    }

    async function handleClick(e: any, title: string, reaction: string, type: string, index: number, contentId: string, contentLink: string) {


        if (reaction === "likes") {
            likeIndex = index;
            dislikeIndex = -1;
        } else {
            dislikeIndex = index;
            likeIndex = -1;
        }

        const data = userAction(session?.user.id, title, reaction, type, contentLink, contentId)
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
            {#each visibileRows as item,  i (i)}
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
                        <button class={i === likeIndex ? "btn btn-square btn-outline bg-success": "btn btn-square btn-outline"}
                            on:click={(e) => handleClick(e, item.name, "likes", "publisher", i, item.publisherId, item.feedUrl)}>
                            <Star color={i === likeIndex ? "white": "black"} />
                        </button>
                    </td>
                    <td class="w-20">
                        <button class={i === dislikeIndex ? "btn btn-square btn-outline bg-danger": "btn btn-square btn-outline"}
                            on:click={(e) => handleClick(e, item.name, "dislikes", "publisher", i, item.publisherId, item.feedUrl)}>
                            <StarOff color={i === dislikeIndex ? "white": "black"}/>
                        </button>
                        {#if session?.user?.email === "jasdeepm@gmail.com"}
                            <button class="btn btn-square btn-outline">
                                <ShieldCheck />
                            </button>
                        {/if}
                    </td>
                </tr>
            {/each}
            <tr><td>&nbsp;</td></tr>
        </tbody>
        </table>
        <div class="mx-2 grid grid-cols-2 content-center">
            <div></div>
            <div class="join">
                {#each Array(totalPages) as _, i}
                    <button class="join-item btn" on:click={()=>changePage(i)}>{i+1}</button>
                {/each}
            </div>
        </div>
      </div>
</div>
<script lang="ts">
    // import Badges from "./BadgeList.svelte";
    import {Newspaper} from "lucide-svelte";


    // export let actionToast: any;
    export let userId: string;

    export let Item = {
        id: "Id",
        title: "Title",
        author: "Author",
        pubDate: "Pub Date",
        publisher: "Publisher",
        content: "Content",
        keywords: "Cat1, Cat2",
        primaryTag: "tag1",
        link: "",
        image: "https://picsum.photos/200/300"
    };

    async function userAction(title: string, reaction: string, type: string) {
        const res = await fetch("/api/engage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                reaction,
                type,
                userId,
            }),
        });
        const data = await res.json();
        console.log(data);
    }

</script>

<div class="max-w-sm rounded-lg overflow-hidden shadow-lg m-2 bg-slate-100">
    {#if Item.image}
        <img class="w-full h-56" src={Item.image} alt={Item.title}>
    {:else}
        <div class="w-full h-56 flex items-center justify-center">
            <Newspaper class="w-1/2 h-1/2 text-gray-400" />
        </div>
    {/if}
    <div class="px-6 py-4">
        <p class="text-gray-700 text-sm">
          {Item.author}, {Item.publisher} on {Item.pubDate}
        </p>
      <div class="font-bold text-m mb-2">
        <a href={Item.link} class="link link-hover" target="_blank" on:click={()=> userAction(Item.title, "viewed", "post")}>
            {@html Item.title}
        </a>
    </div>
    </div>
    {#if userId != "0"}
            <div class="flex flex-1 flex-row space-x-2 m-2">
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (Item.title, "likes", "post")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" {...$$props}><path fill="currentColor" fill-rule="evenodd" d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656L10 17.657l-6.828-6.829a4 4 0 0 1 0-5.656Z" clip-rule="evenodd"/></svg>
                </button>
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (Item.title, "dislikes", "post")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...$$props}><path fill="currentColor" d="m473.7 73.8l-2.4-2.5c-46-47-118-51.7-169.6-14.8L336 159.9l-96 64l48 128l-144-144l96-64l-28.6-86.5C159.7 19.6 87 24 40.7 71.4l-2.4 2.4C-10.4 123.6-12.5 202.9 31 256l212.1 218.6c7.1 7.3 18.6 7.3 25.7 0L481 255.9c43.5-53 41.4-132.3-7.3-182.1z"/></svg>
                </button>
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (Item.title, "bookmark", "post")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512" {...$$props}><path fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400L0 512z"/></svg>
                </button>
                
            </div>
    {/if}
    <!-- <div class="px-6 pt-4 pb-2">
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
    </div> -->
  </div>

<!-- <div class="card bg-base-100 shadow-xl m-2">
    <figure>
        <img src={Item.image} alt={Item.title} height="150" />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-sm">
        {@html Item.title}
      </h2>
      <div class="flex items-start"> -->
        <!-- <span class="text-md font-medium text-gray-600 truncate hover:text-amber-800"> -->
        <!-- <h2 class="font-medium w-auto mr-2 text-xs">{Item.author}, {Item.publisher} on {Item.pubDate}</h2> -->
        <!-- </span> -->
     <!-- </div> -->
     <!-- <p class="mb-3 font-normal text-black line-clamp-2">
        {@html Item.content}
     </p> -->
      <!-- <div class="card-actions justify-end"> -->
        <!-- {#each Item.keywords.split(",") as keyword}
            <Badges keyword={keyword} />
        {/each} -->
      <!-- </div>
    </div>
</div> -->

<!-- <div class="w-11/12 flex flex-col gap-x-2 border-b-2 border-black m-2">
    <div class="flex flex-col flex-wrap justify-between p-3 leading-normal">
        <h1 class="mb-2 text-xl font-bold tracking-tight">
            <a href={Item.link} class="link link-hover" target="_blank" on:click={()=> userAction(Item.title, "viewed", "post")}>
                {@html Item.title}
            </a>
        </h1>
        <div class="flex items-start">
            <h2 class="font-medium w-auto mr-2">{Item.author}, {Item.publisher} on {Item.pubDate}</h2>
        </div>
        <div class="flex-1">
            <p class="mb-3 font-normal text-black line-clamp-2">
                {@html Item.content}
            </p>
        </div>
        {#if Item.keywords}
            <div class="flex flex-wrap flex-row space-x-1 m-1">
                {#each Item.keywords.split(",") as keyword}
                    <Badges keyword={keyword} />
                {/each}
            </div>
        {/if}
        {#if userId != "0"}
            <div class="flex flex-1 flex-row space-x-2 m-2">
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (Item.title, "likes", "post")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" {...$$props}><path fill="currentColor" fill-rule="evenodd" d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656L10 17.657l-6.828-6.829a4 4 0 0 1 0-5.656Z" clip-rule="evenodd"/></svg>
                </button>
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (Item.title, "dislikes", "post")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...$$props}><path fill="currentColor" d="m473.7 73.8l-2.4-2.5c-46-47-118-51.7-169.6-14.8L336 159.9l-96 64l48 128l-144-144l96-64l-28.6-86.5C159.7 19.6 87 24 40.7 71.4l-2.4 2.4C-10.4 123.6-12.5 202.9 31 256l212.1 218.6c7.1 7.3 18.6 7.3 25.7 0L481 255.9c43.5-53 41.4-132.3-7.3-182.1z"/></svg>
                </button>
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (Item.title, "bookmark", "post")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512" {...$$props}><path fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400L0 512z"/></svg>
                </button>
                
            </div>
        {/if}
    </div>
    
</div> -->
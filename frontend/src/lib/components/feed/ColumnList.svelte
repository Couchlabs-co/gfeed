<script lang="ts">
    import { BookmarkPost, userAction } from "$lib/userActions";
    import { Share2 } from "lucide-svelte";
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

    function handleImgError(event: any) {
        event.target.src = "/imgs/default.avif";
    }


</script>

<div class="max-w-sm rounded-lg overflow-hidden shadow-lg m-2 bg-slate-100">
    {#if Item.image}
        <img class="w-full h-56" src={Item.image} alt={Item.title} on:error={handleImgError} />
    {:else}
        <img class="w-full h-56" src="/imgs/default.avif" alt={Item.title} />
    {/if}
    <div class="px-6 py-4">
      <div class="h-auto font-bold text-s mb-2">
        <p class="text-ellipsis">
            <a href={Item.link} class="link link-hover text-ellipsis" target="_blank" on:click={()=> userAction(userId, Item.title, "viewed", "post", Item.link, Item.id)}>
                    {@html Item.title}
            </a>
        </p>
    </div>
    <div>
        <p class="text-gray-500 text-sm">
            {Item.publisher}, {Item.pubDate}
        </p>
    </div>
    </div>
    <div class="flex flex-1 flex-row space-x-2 m-2">
        {#if userId != "0"}
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (userId, Item.title, "likes", "post", Item.link, Item.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" {...$$props}><path fill="currentColor" fill-rule="evenodd" d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656L10 17.657l-6.828-6.829a4 4 0 0 1 0-5.656Z" clip-rule="evenodd"/></svg>
                </button>
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => userAction
        (userId, Item.title, "dislikes", "post", Item.link, Item.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...$$props}><path fill="currentColor" d="m473.7 73.8l-2.4-2.5c-46-47-118-51.7-169.6-14.8L336 159.9l-96 64l48 128l-144-144l96-64l-28.6-86.5C159.7 19.6 87 24 40.7 71.4l-2.4 2.4C-10.4 123.6-12.5 202.9 31 256l212.1 218.6c7.1 7.3 18.6 7.3 25.7 0L481 255.9c43.5-53 41.4-132.3-7.3-182.1z"/></svg>
                </button>
                <button class="btn btn-xs bg-transparent border border-black" type="button" on:click={() => BookmarkPost
        (userId, Item.title, "post", Item.id, "save", Item.link)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512" {...$$props}><path fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400L0 512z"/></svg>
                </button>
                
        {/if}
    </div>
  </div>
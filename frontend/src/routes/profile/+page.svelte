<script lang="ts">
	import { userAction } from '$lib/userActions.js';
	import { Ban, Book, Check } from 'lucide-svelte';
    import UserInterests from '$lib/components/Profile/UserInterests.svelte';
    import Bookmarks from '$lib/components/Profile/UserBookmarks.svelte';
	import UserPosts from '$lib/components/Profile/UserPosts.svelte';
    import { DateTime } from 'luxon';

	export let data;
    let activeTab = 0;
    let tabs = [
        'Interests',
        'I like what I read',
        'Read later'
    ]

    function formatDate(date: string) {
        return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
    }

    const userId = data.user?.id ?? '';

    const { userInterests } = data;

    const userLikedPosts = userInterests.interestsByAction && userInterests.interestsByAction.likes ? userInterests.interestsByAction?.likes.filter((item: any) => {
        return item.contentType === 'post';
    }) : [];

    const userBookmarkedPosts = userInterests.interestsByAction && userInterests.interestsByAction.bookmarks ? userInterests.interestsByAction?.bookmarks.filter((item: any) => {
        return item.contentType === 'post';
    }) : [];

    const interestsUserFollow = userInterests.interestsByAction && userInterests.interestsByAction.follow ? userInterests.interestsByAction?.follow.filter((item: any) => {
        return item.contentType === 'interest';
    }) : [];

</script>
{#if !data.user?.id}
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl">You need to login to view this page</h1>
        <a href="/login" class="btn btn-primary">Login</a>
    </div>
{:else}
<div class="flex flex-cols gap-2">
    <div class="container w-1/4">
        <!-- <div class="bg-white p-3 "> -->
            <div class="image overflow-hidden rounded-md">
                <img class="h-auto w-full mx-auto"
                    src={data.user?.image}
                    alt={data.user?.name} />
            </div>
            <div>
                <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">{data.user?.name}</h1>
            <ul
                class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li class="flex items-center py-3">
                    <span>Status</span>
                    <span class="ml-auto"><span
                            class="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span></span>
                </li>
                <li class="flex items-center py-3">
                    <span>Member since</span>
                    <span class="ml-auto">{formatDate(data.user?.createdAt ?? '')}</span>
                </li>
            </ul>
            </div>
            
        <!-- </div> -->
    </div>
    <div class="content-center w-full">
        <div class="stats shadow">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <div class="stat-title">Total Likes</div>
              <div class="stat-value text-primary">
                {#if !data.userInterests.interestsByAction?.likes || data.userInterests.interestsByAction?.likes?.length === 0}
                    0
                {:else}
                    {data.userInterests.interestsByAction.likes.length}
                {/if}
              </div>
            </div>

            <div class="stat">
                <div class="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="stat-title">Total Disliked</div>
                <div class="stat-value text-secondary">
                  {#if !data.userInterests.interestsByAction?.dislikes || data.userInterests.interestsByAction?.dislikes.length === 0}
                      0
                  {:else}
                      {data.userInterests.interestsByAction.dislikes.length}
                  {/if}
                </div>
              </div>
            
            <div class="stat">
              <div class="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div class="stat-title">Total Views</div>
              <div class="stat-value text-secondary">
                {#if !data.userInterests.interestsByAction?.viewed || data.userInterests.interestsByAction?.viewed?.length === 0}
                    0
                {:else}
                    {data.userInterests.interestsByAction.viewed.length}
                {/if}
              </div>
            </div>
            
          </div>
        <div class="flex flex-col m-2">
            <div class="tabs">
                {#each tabs as tab, i}
                    <button class="tab tab-lg tab-lifted" class:tab-active={activeTab === i} on:click={()=> {activeTab = i}}>{tab}</button> 
                {/each}
            </div>
            {#if activeTab === 0}
                <UserInterests interests={data.interests.Items} userId={userId} interestsUserFollow={interestsUserFollow} />
            {/if}
            {#if activeTab === 1}
                <Bookmarks bookmarks={userBookmarkedPosts} userId={userId} />
            {/if}
            {#if activeTab === 2}
                <UserPosts userPosts={userLikedPosts} userId={userId} />
            {/if}
            
        </div>
    </div>
</div>
{/if}
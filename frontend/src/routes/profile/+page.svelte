<script lang="ts">
    import UserInterests from '../../lib/components/Profile/UserInterests.svelte';
    import Bookmarks from '../../lib/components/Profile/UserBookmarks.svelte';
	import UserPosts from '../../lib/components/Profile/UserPosts.svelte';
    import ProfileCard from '../../lib/components/Profile/ProfileCard.svelte'
    import UserStats from '../../lib/components/Profile/UserStats.svelte'
    import FeedAlgoOptions from '../../lib/components/Profile/FeedAlgoOptions.svelte';
    import Heading from '../../lib/components/Heading.svelte';

	export let data;
    let activeTab = 0;
    let tabs = [
        'Interests',
        'I like what I read',
        'Read later'
    ]

    const userId = data.user?.id ?? '';

    const { userInterests, userBookmarks } = data;

    const userLikedPosts = userInterests.interestsByAction && userInterests.interestsByAction.likes ? userInterests.interestsByAction?.likes.filter((item: any) => {
        return item.contentType === 'post';
    }) : [];

    const userBookmarkedPosts = userBookmarks.Items;

    const interestsUserFollow = userInterests.interestsByAction && userInterests.interestsByAction.follow ? userInterests.interestsByAction?.follow.filter((item: any) => {
        return item.contentType === 'interest';
    }) : [];

    const feedAlgoSelected = userInterests.interestsByAction && userInterests.interestsByAction.selected ? userInterests.interestsByAction?.selected.filter((item: any) => {
        return item.content === 'feedAlgorithm';
    }) : [];

</script>
{#if !data.user?.id}
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl">You need to login to view this page</h1>
        <a href="/login" class="btn btn-primary">Login</a>
    </div>
{:else}
    <!-- <div class="grid grid-col-2 gap-1 h-auto border border-black content-start">
        <div class="col-span-3 my-auto">
            <Heading heading={data.user?.name} />
        </div>
        <div class="row-span-2 my-auto">
            <ProfileCard userName={data.user?.name} userPic={data.user?.image} memberSince={data.user?.createdAt} />
        </div>
        <div class="col-span-2 my-auto place-items-start">
            <UserStats data={data} />
        </div>
        <div class="col-span-2 border border-black">
            <FeedAlgoOptions />
        </div> -->
        <div class="relative isolate overflow-hidden py-4 sm:py-4">
            <Heading heading={data.user?.name} />
            <div class="grid grid-flow-row-dense grid-cols-4 grid-rows-1 m-2">
                <div class="rounded-md w-auto">
                    <ProfileCard userName={data.user?.name} userPic={data.user?.image} memberSince={data.user?.createdAt} />
                </div>
                <div class="col-span-2 w-full rounded-md ">
                    <UserStats data={data} />
                    <FeedAlgoOptions selectedAlgo={feedAlgoSelected.length? feedAlgoSelected[0].contentType: ''} />
                    <div class="grid grid-cols-1 m-4 w-full">
                        <div class="tabs">
                            {#each tabs as tab, i}
                                <button class="tab tab-lg tab-lifted" class:tab-active={activeTab === i} on:click={()=> {activeTab = i}}>{tab}</button> 
                            {/each}
                        </div>
                        {#if activeTab === 0}
                            <UserInterests interests={data.interests.Items} userId={userId} interestsUserFollow={interestsUserFollow} />
                        {/if}
                        {#if activeTab === 1}
                            <UserPosts userPosts={userLikedPosts} userId={userId} />
                        {/if}
                        {#if activeTab === 2}
                            <Bookmarks bookmarks={userBookmarkedPosts} />
                        {/if}
                        
                    </div>
                </div>
            </div>
        </div>
    <!-- </div> -->
{/if}
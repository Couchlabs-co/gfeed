<script lang="ts">
    import UserInterests from '../../lib/components/Profile/UserInterests.svelte';
    import Bookmarks from '../../lib/components/Profile/UserBookmarks.svelte';
	import UserPosts from '../../lib/components/Profile/UserPosts.svelte';
    import ProfileCard from '../../lib/components/Profile/ProfileCard.svelte'
    import UserStats from '../../lib/components/Profile/UserStats.svelte'
    import FeedAlgoOptions from '../../lib/components/Profile/FeedAlgoOptions.svelte';
    import Heading from '../../lib/components/Heading.svelte';
    import toast, { Toaster } from 'svelte-french-toast';

	export let data;
    let activeTab = 0;
    let tabs = [
        'Interests',
        'I like what I read',
        'Read later'
    ]

    const userId = data.user?.id ?? '';

    const { userData } = data;

    const userLikedPosts = userData.interestsByAction && userData.interestsByAction.likes ? userData.interestsByAction?.likes.filter((item: any) => {
        return item.contentType === 'post';
    }) : [];

    const interestsUserFollow = userData.interestsByAction && userData.interestsByAction.follow ? userData.interestsByAction?.follow.filter((item: any) => {
        return item.contentType === 'interest';
    }) : [];

    const userBookmarks = userData.interestsByAction && userData.interestsByAction.bookmark ? userData.interestsByAction?.bookmark.filter((item: any) => {
        return item.contentType === 'post';
    }) : [];

    const feedAlgoSelected = userData.interestsByAction && userData.interestsByAction.selected ? userData.interestsByAction?.selected.filter((item: any) => {
        return item.contentType === 'feedAlgo';
    }) : [{content: 'timeBased'}];

    function handleAlgoChange(eventDetail: Record<string, string>) {
        toast.success('Feed algorithm saved successfully');
    }

    function handleInterestChange(eventDetail: Record<string, any>) {
        const { userInterest, action } = eventDetail.detail;
        if(action === 'follow') {
            toast.success(`${JSON.parse(userInterest).tagName} successfully added`);
        } else {
            toast.error(`${JSON.parse(userInterest).tagName} successfully removed`);
        }
    }

</script>
{#if !data.user?.id}
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl">You need to login to view this page</h1>
        <a href="/login" class="btn btn-primary">Login</a>
    </div>
{:else}
        <div class="relative isolate overflow-hidden py-4 sm:py-4">
            <Heading heading={data.user?.given_name} />
            <Toaster />
            <div class="grid grid-flow-row-dense grid-cols-4 grid-rows-1 m-2">
                <div class="rounded-md w-auto">
                    <ProfileCard userName={data.user?.given_name} userPic={data.user?.picture} />
                </div>
                <div class="col-span-2 w-full rounded-md ">
                    <UserStats data={data} />
                    <FeedAlgoOptions userId={userId} selectedAlgo={feedAlgoSelected.length? feedAlgoSelected[0].content: ''} on:feedAlgoChanged={handleAlgoChange}/>
                    <div class="grid grid-cols-1 m-4 w-full">
                        <div class="tabs">
                            {#each tabs as tab, i}
                                <button class="tab tab-lg tab-lifted" class:tab-active={activeTab === i} on:click={()=> {activeTab = i}}>{tab}</button> 
                            {/each}
                        </div>
                        {#if activeTab === 0}
                            <UserInterests interests={data.interests.Items} userId={userId} interestsUserFollow={interestsUserFollow} on:userInterestEvent={handleInterestChange}/>
                        {/if}
                        {#if activeTab === 1}
                            <UserPosts userPosts={userLikedPosts} userId={userId} />
                        {/if}
                        {#if activeTab === 2}
                            <Bookmarks bookmarks={userBookmarks} userId={userId}/>
                        {/if}
                        
                    </div>
                </div>
            </div>
        </div>
{/if}
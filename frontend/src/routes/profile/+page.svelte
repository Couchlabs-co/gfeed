<script lang="ts">
    import UserInterests from '../../lib/components/Profile/UserInterests.svelte';
    import Bookmarks from '../../lib/components/Profile/UserBookmarks.svelte';
	import UserPosts from '../../lib/components/Profile/UserPosts.svelte';
    import ProfileCard from '../../lib/components/Profile/ProfileCard.svelte'
    import UserStats from '../../lib/components/Profile/UserStats.svelte'
    import FeedAlgoOptions from '../../lib/components/Profile/FeedAlgoOptions.svelte';
    import Heading from '../../lib/components/Heading.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
	import LeftNavigation from '$lib/components/Profile/LeftNavigation.svelte';

	export let data;
    let activeTab = 0;
    let activeComponent = 'Interests';
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

    function handleAlgoChange(eventDetail: CustomEvent<any>) {
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

    function handleSideNavClick(item: string) {
        activeComponent = item;
    }

</script>
{#if !data.user?.id}
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl">You need to login to view this page</h1>
        <a href="/login" class="btn btn-primary">Login</a>
    </div>
{:else}
    <div class="flex flex-col w-full">
        <Heading heading={data.user?.given_name} />
        <Toaster />
        <div class="flex w-full">
            <div class="rounded-md w-1/3">
                <ProfileCard userName={data.user?.given_name} userPic={data.user?.picture} handleChange={handleSideNavClick}/>
                <LeftNavigation handleChange={handleSideNavClick}/>
            </div>
            <div class="rounded-md w-full">
                <UserStats data={data} />
                <FeedAlgoOptions userId={userId} selectedAlgo={feedAlgoSelected.length? feedAlgoSelected[0].content: ''} on:feedAlgoChanged={handleAlgoChange}/>
                <div class="w-full">
                    {#if activeComponent === 'Interests'}
                        <UserInterests interests={data.interests.Items} userId={userId} interestsUserFollow={interestsUserFollow} on:userInterestEvent={handleInterestChange}/>
                    {/if}
                    {#if activeComponent === 'LikeThese'}
                        <UserPosts userPosts={userLikedPosts} userId={userId} />
                    {/if}
                    {#if activeComponent === 'ReadLater'}
                        <Bookmarks bookmarks={userBookmarks} userId={userId}/>
                    {/if}
                    
                </div>
            </div>
        </div>
    </div>
{/if}
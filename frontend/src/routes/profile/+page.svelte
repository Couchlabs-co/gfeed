<script lang="ts">
    import { DateTime } from 'luxon';

	export let data;

    console.log(JSON.stringify(data));

    function formatDate(date: string) {
        return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
    }

</script>

<div class="max-h-screen">
    <div class="container mx-auto my-5 p-5">
        <div class="md:flex no-wrap md:-mx-2 ">
            <!-- Left Side -->
            <div class="w-full md:w-3/12 md:mx-2">
                <!-- Profile Card -->
                <div class="bg-white p-3 ">
                    <div class="image overflow-hidden">
                        <img class="h-auto w-full mx-auto"
                            src={data.user?.image}
                            alt={data.user?.name} />
                    </div>
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
                            <span class="ml-auto">{formatDate(data.user.createdAt)}</span>
                        </li>
                    </ul>
                </div>
                <!-- End of profile card -->
                <div class="my-4"></div>
            </div>
            <!-- Right Side -->
            <div class="w-full md:w-9/12 mx-2 h-64"> 

                <!-- Experience and education -->
                <div class="p-3 shadow-sm rounded-sm">

                    <div class="grid grid-cols-2">
                        <div>
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
                                      {#if !data.userInterests.interestsByAction?.viewed || data.userInterests.interestsByAction?.viewed.length === 0}
                                          0
                                      {:else}
                                          {data.userInterests.interestsByAction.viewed.length}
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
                        </div>
                        
                    </div>
                    <!-- End of Experience and education grid -->
                </div>
                <!-- End of profile tab -->
                <div class="my-4"></div>
                <div class="tabs">
                    <button class="tab tab-lifted tab-active">Interests</button> 
                    <button class="tab tab-lifted">I like what I read</button> 
                    <button class="tab tab-lifted">Read later</button>
                </div>
                <div class="p-3 shadow-sm rounded-sm">
                    What interests you
                    <div class="columns-2">
                        <div>column 1</div>
                        <div>column 2</div>
                    </div>
                </div>
                
                <div class="my-4"></div>
                <div class="p-3 shadow-sm rounded-sm">
                    Subscription
                </div>

                <div class="my-4"></div>
                <div class="p-3 shadow-sm rounded-sm">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Delete Profile
                    </button>

                </div>
            </div>
        </div>
    </div>
</div>
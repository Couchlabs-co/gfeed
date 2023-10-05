<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	/** @type {import('./$types').PageData} */
	export let data: PageData;

</script>

<!-- component -->
<!-- <style>
    :root {
        --main-color: #4a76a8;
    }

    .bg-main-color {
        background-color: var(--main-color);
    }

    .text-main-color {
        color: var(--main-color);
    }

    .border-main-color {
        border-color: var(--main-color);
    }
</style> -->
<!-- <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script> -->



<div class="max-h-screen">
    <div class="container mx-auto my-5 p-5">
        <div class="md:flex no-wrap md:-mx-2 ">
            <!-- Left Side -->
            <div class="w-full md:w-3/12 md:mx-2">
                <!-- Profile Card -->
                <div class="bg-white p-3 ">
                    <div class="image overflow-hidden">
                        <img class="h-auto w-full mx-auto"
                            src={$page.data.session?.user?.image}
                            alt={$page.data.session?.user?.name} />
                    </div>
                    <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">{$page.data.session?.user?.name}</h1>
                    <ul
                        class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                        <li class="flex items-center py-3">
                            <span>Status</span>
                            <span class="ml-auto"><span
                                    class="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span></span>
                        </li>
                        <li class="flex items-center py-3">
                            <span>Member since</span>
                            <span class="ml-auto">Nov 07, 2016</span>
                        </li>
                    </ul>
                </div>
                <!-- End of profile card -->
                <div class="my-4"></div>
            </div>
            <!-- Right Side -->
            <div class="w-full md:w-9/12 mx-2 h-64">
                <!-- Profile tab -->
                <!-- About Section -->
                <!-- <div class="bg-white p-3 shadow-sm rounded-sm">
                    <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                        <span class="text-green-500">
                            <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <span class="tracking-wide">About</span>
                    </div>
                    <div class="text-gray-700">
                        <div class="grid md:grid-cols-2 text-sm">
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">First Name</div>
                                <div class="px-4 py-2">Jane</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Last Name</div>
                                <div class="px-4 py-2">Doe</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Gender</div>
                                <div class="px-4 py-2">Female</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Contact No.</div>
                                <div class="px-4 py-2">+11 998001001</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Current Address</div>
                                <div class="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Permanant Address</div>
                                <div class="px-4 py-2">Arlington Heights, IL, Illinois</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Email.</div>
                                <div class="px-4 py-2">
                                    <a class="text-blue-800" href="mailto:jane@example.com">jane@example.com</a>
                                </div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Birthday</div>
                                <div class="px-4 py-2">Feb 06, 1998</div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                End of about section -->

                <!-- <div class="my-4"></div> -->

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
                                    {#if !data.interestsByAction?.likes || data.interestsByAction?.likes?.length === 0}
                                        0
                                    {:else}
                                        {data.interestsByAction.likes.length}
                                    {/if}
                                  </div>
								</div>
								
								<div class="stat">
								  <div class="stat-figure text-secondary">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
								  </div>
								  <div class="stat-title">Total Views</div>
								  <div class="stat-value text-secondary">4</div>
								</div>
								
								<div class="stat">
								  <div class="stat-figure text-secondary">
									<div class="avatar online">
									  <div class="w-16 rounded-full">
										<img alt="" src="" />
									  </div>
									</div>
								  </div>
								  <div class="stat-value">86%</div>
								  <div class="stat-title">Tasks done</div>
								  <div class="stat-desc text-secondary">31 tasks remaining</div>
								</div>
								
							  </div>
                        </div>
                        
                    </div>
                    <!-- End of Experience and education grid -->
                </div>
                <!-- End of profile tab -->
                <div class="my-4"></div>
                <div class="p-3 shadow-sm rounded-sm">
                    Publishers you read
                </div>

                <div class="my-4"></div>
                <div class="p-3 shadow-sm rounded-sm">
                    Authors you read
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
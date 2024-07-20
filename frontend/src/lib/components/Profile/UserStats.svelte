<script lang="ts">

    export let data;

</script>

<section class="bg-white dark:bg-gray-900">
  <div class="max-w-screen-xl px-4 py-4 mx-auto text-center lg:py-6 lg:px-6">
      <dl class="grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
          <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl md:text-4xl font-extrabold">
                {#if !data.userData.interestsByAction?.likes || data.userData.interestsByAction?.likes?.length === 0}
                    0
                {:else}
                    {data.userData.interestsByAction.likes.length}
                {/if}
              </dt>
              <dd class="font-light text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                Total Likes
              </dd>
          </div>
          <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl md:text-4xl font-extrabold">
                {#if !data.userData.interestsByAction?.dislikes || data.userData.interestsByAction?.dislikes.length === 0}
                    0
                {:else}
                    {data.userData.interestsByAction.dislikes.length}
                {/if}
              </dt>
              <dd class="font-light text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block lucide lucide-star-off"><path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43"/><path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                Total Disliked
              </dd>
          </div>
          <div class="flex flex-col items-center justify-center">
              <dt class="mb-2 text-3xl md:text-4xl font-extrabold">
                {#if !data.userData.interestsByAction?.viewed || data.userData.interestsByAction?.viewed?.length === 0}
                    0
                {:else}
                    {data.userData.interestsByAction.viewed.length}
                {/if}
              </dt>
              <dd class="font-light text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                Total Views</dd>
          </div>
      </dl>
  </div>
</section>
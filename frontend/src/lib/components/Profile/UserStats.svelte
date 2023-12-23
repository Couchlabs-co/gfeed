<script lang="ts">

    export let data;

</script>

<div class="justify-left h-auto">
  <div class="stats shadow bg-slate-100 p-3 rounded-xl">
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
</div>
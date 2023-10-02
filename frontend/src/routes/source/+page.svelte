<script lang="ts">
    /** @type {import('./$types').PageData} */
	export let data;

    const { Items } = data.data;

</script>
<div>
    <h3 class="mt-2 mb-2">
        Some of the sources we crawl to make sure you have latest content
    </h3>
    <div class="h-max w-9/12 items-center place-content-center m-auto">
        <table class="table table-pin-rows">
        <thead>
          <tr>
            <th>Publishers</th>
          </tr>
        </thead>
        <tbody>
            {#each Items as item}
                <tr>
                    <td>{item.publisher}</td>
                    <td><img src={item.logo} alt={item.publisher} /></td>
                </tr>
            {/each}
        </tbody>
        </table>
      </div>
</div>
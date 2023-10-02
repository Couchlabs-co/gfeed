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
        <table class="table table-pin-rows w-auto">
        <thead>
          <tr>
            <th>Publishers</th>
          </tr>
        </thead>
        <tbody>
            {#each Items as item}
                <tr>
                    <td><img src={item.logo} alt={item.name} width="32" height="32"/></td>
                    <td>{item.name}</td>
                </tr>
            {/each}
        </tbody>
        </table>
      </div>
</div>
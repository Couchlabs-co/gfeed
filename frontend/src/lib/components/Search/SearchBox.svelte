<script lang="ts">
  async function search() {
    const search = document.querySelector('.input').value;
    const res = await fetch(`http://localhost:3000/api/search?search=${search}`);
    const data = await res.json();
    console.log(data);
  }
</script>

<div class="form-control">
    <div class="join">
      <input type="text" placeholder="Search…" class="input input-bordered join-item" />
      <button class="btn btn-square join-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </div>
</div>
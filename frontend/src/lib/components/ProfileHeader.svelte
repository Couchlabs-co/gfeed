<script lang="ts">
    export let pic = '';
</script>

<label for="profile_pic" class="btn btn-ghost btn-circle avatar">
    <div class="w-10 rounded-full">
      <img id="profile_pic" alt="profilepic" src={pic} />
    </div>
</label>
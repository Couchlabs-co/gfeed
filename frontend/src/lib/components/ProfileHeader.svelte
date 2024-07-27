<script lang="ts">
    export let pic = '';
    export let name = '';
</script>

<label for="profile_pic" class="btn btn-ghost btn-circle avatar">
    <div class="w-10 rounded-full" data-testid="userPicture">
      <img id="profile_pic" alt={name} src={pic} />
    </div>
</label>
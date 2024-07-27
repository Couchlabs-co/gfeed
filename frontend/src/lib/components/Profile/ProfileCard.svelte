<script lang="ts">
    import { format } from 'date-fns';

    export let userPic: string | null;
    export let userName: string;

</script>
<div class="container w-4/5 rounded-md">
        <div class="image overflow-hidden rounded-md">
            <img class="h-auto w-full mx-auto"
                src={userPic}
                alt={userName} />
        </div>
        <div>
        </div>
        
</div>
<script lang="ts">
	import type { PageProps } from "../$types";
	const { data }: PageProps = $props();
</script>

<div>
	hi {console.log(data.websocket)}
</div>

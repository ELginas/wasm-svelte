<script>
  import { unified } from "unified";
  import remarkParse from "remark-parse";
  import remarkRehype from "remark-rehype";
  import rehypeStringify from "rehype-stringify";

  let text = $state("# Title\nthis is the text");
  let file = $state(null);

  $effect(() => {
    (async () => {
      file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(text);
    })();
  });
</script>

<div class="h-full flex flex-col items-center justify-center">
  <div class="flex gap-2 h-full my-5">
    <textarea class="" bind:value={text}></textarea>
    <div class="flex flex-col gap-2">
      {#if file}
        <pre>{file.value}</pre>
      {/if}
    </div>
    {#if file}
      <div class="">{@html file.value}</div>
    {/if}
  </div>
</div>

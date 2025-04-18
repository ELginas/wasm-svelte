<script>
  import { unified } from "unified";
  import remarkParse from "remark-parse";
  import rehypeParse from "rehype-parse";
  import remarkRehype from "remark-rehype";
  import rehypeStringify from "rehype-stringify";
  import rehypeHighlight from "rehype-highlight";
  import hljs from "highlight.js";
  import "highlight.js/styles/github.css";
  import { read, write } from "$lib/storage";
  import {
    onbeforeinput,
    onselectionchange,
    setSelectionRange,
  } from "$lib/input";
  import { tick } from "svelte";

  let text = $state(read("text", "# Title\nthis is the text"));
  let file = $state(null);
  let highlightedHtml = $derived.by(() => {
    if (!file) {
      return null;
    }

    return hljs.highlight(file.value, { language: "html" });
  });
  let highlightedMarkdown = $derived.by(() => {
    return hljs.highlight(text, { language: "markdown" });
  });
  $inspect(highlightedHtml);

  let element;

  $effect(() => {
    (async () => {
      file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(text);
    })();
  });

  $effect(() => {
    write("text", text);
  });
</script>

<svelte:document onselectionchange={(e) => onselectionchange(e, element)} />

<div class="h-full flex flex-col items-center justify-center">
  <div class="flex gap-2 h-full my-5">
    <textarea class="" bind:value={text}></textarea>
    <div class="flex flex-col gap-2">
      {#if highlightedHtml}
        <pre>{@html highlightedHtml.value}</pre>
      {/if}
    </div>
    {#if file}
      <div class="">{@html file.value}</div>
    {/if}
    {#if highlightedMarkdown}
      <p
        class="whitespace-pre-line"
        contenteditable
        bind:this={element}
        onbeforeinput={async (e) => {
          const { text: newText, offset } = onbeforeinput(e, element, text);
          text = newText;
          console.log("set pos", offset);
          await tick();
          setSelectionRange(
            {
              offset,
              length: 0,
            },
            element
          );
        }}
      >
        {@html highlightedMarkdown.value}
      </p>
    {/if}
  </div>
</div>

<script>
  import { unified } from "unified";
  import remarkParse from "remark-parse";
  import remarkRehype from "remark-rehype";
  import rehypeStringify from "rehype-stringify";
  import rehypeHighlight from "rehype-highlight";
  import hljs from "highlight.js";
  import "highlight.js/styles/github.css";
  import { read, write } from "$lib/storage";
  import { onbeforeinput, setSelectionRange } from "$lib/input";
  import { tick } from "svelte";
  import MdastRenderer from "./MdastRenderer.svelte";

  let text = $state(read("text", "# Title\nthis is the text"));
  let file = $state(null);
  // let highlightedHtml = $derived.by(() => {
  //   if (!file) {
  //     return null;
  //   }

  //   return hljs.highlight(file.value, { language: "html" });
  // });

  let highlightedMarkdown = $derived.by(() => {
    const result = hljs.highlight(text, { language: "markdown" });
    console.log("md", result);
    let html = result.value;

    // Prevent last newline from being ignored by adding <br/> to the end. This is default behavior
    // for Firefox contenteditable edits and Chromium prevents this by having each line wrapped in <div>.
    // Read more about this issue here: https://stackoverflow.com/a/62523690
    if (text.endsWith("\n")) {
      html += "<br/>";
    }
    return html;
  });
  $inspect(highlightedMarkdown);

  let element;

  let markdownTree = $derived.by(() => unified().use(remarkParse).parse(text));
  $inspect(markdownTree);

  $effect(() => {
    (async () => {
      // file = await unified()
      //   .use(remarkParse)
      //   .use(remarkRehype)
      //   .use(rehypeHighlight)
      //   .use(rehypeStringify)
      //   .process(text);
    })();
  });

  $effect(() => {
    write("text", text);
  });

  let exampleText = $state("t\n\n  ");
</script>

<!-- <svelte:document onselectionchange={(e) => onselectionchange(e, element)} /> -->

<div class="h-full flex flex-col items-center justify-center">
  <div class="flex gap-2 h-full my-5">
    <textarea class="outline-0" bind:value={text}></textarea>
    <!-- <div class="flex flex-col gap-2">
      {#if highlightedHtml}
        <pre>{@html highlightedHtml.value}</pre>
      {/if}
    </div>
    {#if file}
      <div class="">{@html file.value}</div>
    {/if} -->

    <!-- contenteditable input box which changes text instead of DOM on change. This is needed because normal contexteditable text change is only received on input event and the DOM has already changed and new text otherwise should be derived from modified DOM -->
    {#if highlightedMarkdown}
      <div
        contenteditable
        class="outline-0 whitespace-pre-wrap"
        bind:this={element}
        onbeforeinput={async (e) => {
          const { text: newText, offset } = onbeforeinput(e, element, text);
          console.log("newtext", newText);
          text = newText;
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
        {@html highlightedMarkdown}
      </div>
    {/if}
    {#if text}
      <div class="outline-0 whitespace-pre-wrap">
        <MdastRenderer {text} />
      </div>
    {/if}
  </div>
</div>

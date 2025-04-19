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
    getTrailingNewlineCount,
    onbeforeinput,
    setSelectionRange,
  } from "$lib/input";
  import { tick } from "svelte";
  import { rehypeInsertBr } from "$lib/rehype";

  let text = $state(read("text", "# Title\nthis is the text"));
  let file = $state(null);
  // let highlightedHtml = $derived.by(() => {
  //   if (!file) {
  //     return null;
  //   }

  //   return hljs.highlight(file.value, { language: "html" });
  // });

  // let highlightedMarkdown = $derived.by(() => {
  //   const result = hljs.highlight(text, { language: "markdown" });
  //   console.log("md", result);
  //   const value = result.value;

  //   // Prevent last newline from being ignored by converting them to <br/> and wrapping in divs.
  //   // Chromium does this when newline is entered in contenteditable elements. Well actually Chromium
  //   // splits every line into separate <div>s
  //   // Firefox adds <br/> to the end if before it there is newline.

  //   // Doesn't account for newlines in <span>s
  //   // return value;
  //   return 'a\n\nsdsdd\n\nsda\n\nasdasdasdasd\n\n<span class="hljs-section"># Title</span>\n\n[asdasd]<span class="hljs-emphasis">*as\n<br/></span>';
  //   // const trailingNewlineCount = getTrailingNewlineCount(value);
  //   // if (trailingNewlineCount > 0) {
  //   //   return (
  //   //     value.substring(0, value.length - trailingNewlineCount) +
  //   //     "<div>\n</div>".repeat(trailingNewlineCount)
  //   //   );
  //   // }
  //   // return value;
  // });
  let highlightedMarkdown = $state(null);

  $effect(() => {
    (async () => {
      const result = hljs.highlight(text, { language: "markdown" });
      let html = result.value;

      if (text.endsWith("\n")) {
        html += "<br/>";
      }
      highlightedMarkdown = html;

      // const file = await unified()
      //   .use(rehypeParse, { fragment: true })
      //   .use(rehypeInsertBr)
      //   .use(rehypeStringify)
      //   .process(html);
      // highlightedMarkdown = file.value;
    })();
  });
  $inspect(highlightedMarkdown);

  // console.log(String(file))

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
  </div>
  <!-- <br/> or \n without any character followed afterwards is discarded, space works tho. empty span doesn't work but if it is deleted when it has any character, it works -->
  <pre class="bg-black text-white p-1" contenteditable>t

 </pre>
  <pre class="bg-black text-white p-1" contenteditable>t</pre>
  <!-- <pre class="bg-black text-white p-1">{@html exampleText}</pre> -->
</div>

<script>
  import { unified } from "unified";
  import remarkParse from "remark-parse";
  import HighlightedCode from "./HighlightedCode.svelte";

  const { text } = $props();
  let tree = $derived.by(() => {
    let tree = unified().use(remarkParse).parse(text);
    console.log(text, tree);
    fillGaps(tree);
    return tree;
  });

  const fillGaps = (tree) => {
    console.log("tree", tree, tree.children);
    let length = tree.children.length;
    let i = 0;
    while (i < length - 1) {
      const firstNode = tree.children[i];
      const secondNode = tree.children[i + 1];
      const firstEnd = firstNode.position.end;
      const secondStart = secondNode.position.start;
      const gap = secondStart.line - firstEnd.line - 1;

      console.log("gap", gap);
      const gapNode = {
        type: "gap",
        // value: "\n".repeat(gap + 1),
        value: text.substring(firstEnd.offset, secondStart.offset),
        position: {
          start: {
            line: firstEnd.line + 1,
            column: 1,
            offset: firstEnd.offset + 1,
          },
          end: {
            line: secondStart.line - 1,
            column: 1,
            offset: secondStart.offset,
          },
        },
      };
      tree.children.splice(i + 1, 0, gapNode);
      i += 2;
      length++;
    }
  };
</script>

{#snippet element(tree)}
  {#each tree.children as node}
    {#if node.type == "paragraph"}
      {@render element(node)}
    {:else if node.type == "heading"}
      <span class="hljs-section">
        {text.substring(
          node.position.start.offset,
          node.children[0].position.start.offset
        )}{@render element(node)}
      </span>
    {:else if node.type == "emphasis"}
      <span class="hljs-emphasis">
        {text.substring(node.position.start.offset, node.position.end.offset)}
      </span>
    {:else if node.type == "break"}
      {text.substring(node.position.start.offset, node.position.end.offset)}
    {:else if node.type == "link"}
      {"["}<span class="hljs-string">{@render element(node)}</span
      >{"]"}{#if node.url}{"("}<span class="hljs-link">{node.url}</span
        >{")"}{/if}
    {:else if node.type == "list"}
      {@render element(node)}
    {:else if node.type == "listItem"}
      <span class="hljs-bullet">-</span>{" "}{@render element(node)}
    {:else if node.type == "code"}
      <span class="hljs-code">
        {"```"}{node.lang}{"\n"}{#if node.lang}<HighlightedCode
            text={node.value}
            language={node.lang}
          />{:else}<span class="hljs-code">{node.value}</span>{/if}{"\n"}{"```"}
      </span>
    {:else if node.type == "text"}
      {node.value}
    {:else if node.type == "gap"}
      {node.value}
    {:else}
      <span>unkn0wn</span>
    {/if}
  {/each}
{/snippet}

{@render element(tree)}

<script>
  import hljs from "highlight.js";
  import "highlight.js/styles/github.css";

  let { text, language } = $props();
  const html = $derived.by(() => {
    const result = hljs.highlight(text, { language });
    return result.value;
  });
</script>

{@html html}

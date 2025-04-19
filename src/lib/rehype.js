import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export const rehypeInsertBr = () => {
  return (tree) => {
    visit(tree, "element", function (node) {
      console.log("visit node", node);
      if (["h1", "h2", "h3", "h4", "h5"].includes(node.tagName)) {
        node.tagName = "h" + (Number(node.tagName.charAt(1)) + 1);
      }
    });
  };
};

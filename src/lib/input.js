const getRangeInfo = (range, element) => {
  const rangeLength = range.toString().length;
  range.setStart(element, 0);
  const copiedRangeLength = range.toString().length;
  const offset = copiedRangeLength - rangeLength;
  // console.log("range", range, rangeLength, copiedRangeLength, offset);
  return {
    offset,
    length: rangeLength,
  };
};

const dynamicRangeFromStatic = (range) => {
  const newRange = new Range();
  newRange.setStart(range.startContainer, range.startOffset);
  newRange.setEnd(range.endContainer, range.endOffset);
  return newRange;
};

const getSelectionPoint = (offset, parent) => {
  // DFS
  const queue = [parent];
  let currentTextLength = 0;
  while (queue.length > 0) {
    const element = queue.pop();
    // console.log("iter", element, queue, currentTextLength);
    const children = element.childNodes;
    if (children.length > 0) {
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        // console.log("iteradd", child.textContent);
        queue.push(child);
      }
      continue;
    }
    const textLength = element.textContent.length;
    const newTextLength = currentTextLength + textLength;
    if (newTextLength >= offset) {
      // console.log(
      //   "iterprefinish",
      //   currentTextLength,
      //   textLength,
      //   newTextLength,
      //   offset
      // );
      return {
        container: element,
        offset: offset - currentTextLength,
      };
    }
    currentTextLength = newTextLength;
  }
  return null;
};

export const setSelectionRange = (rangeInfo, element) => {
  // console.log("itergoal", rangeInfo.offset, element);
  const { container, offset } = getSelectionPoint(rangeInfo.offset, element);
  // console.log("iterfinish", container, offset);
  const selection = document.getSelection();
  const range = selection.getRangeAt(0);
  range.setStart(container, offset);
  range.setEnd(container, offset);
};

const getDocumentSelectionRangeInfo = (element) => {
  const selection = document.getSelection();
  const range = selection.getRangeAt(0);
  const copiedRange = range.cloneRange();
  return getRangeInfo(copiedRange, element);
};

// export const onselectionchange = (e, element) => {
//   const selection = document.getSelection();
//   const inElement =
//     element.contains(selection?.anchorNode) &&
//     element.contains(selection?.focusNode);
//   if (inElement) {
//     // Firefox Android: Have to unfocus before focusing to open virtual keyboard on selection
//     element.blur();
//     element.focus();
//   }

//   console.log("[document] selectionchange", e, selection, inElement);
//   if (!inElement) {
//     return;
//   }
//   const range = selection.getRangeAt(0);
//   const copiedRange = range.cloneRange();
//   console.log("rangeinfo", getRangeInfo(copiedRange, element));
// };

const getText = (e) => {
  if (e.inputType === "insertParagraph") {
    return "\n";
  } else if (e.data) {
    return e.data;
  } else {
    return e.dataTransfer?.getData("text/plain");
  }
};

const strRemoveRange = (str, rangeInfo) =>
  str.substring(0, rangeInfo.offset) +
  str.substring(rangeInfo.offset + rangeInfo.length);

const strAddRange = (str, rangeInfo, newStr) =>
  str.substring(0, rangeInfo.offset) + newStr + str.substring(rangeInfo.offset);

const strModifyRange = (str, rangeInfo, text) => {
  if (text) {
    return {
      text: strAddRange(str, rangeInfo, text),
      offset: rangeInfo.offset + text.length,
    };
  } else {
    return {
      text: strRemoveRange(str, rangeInfo),
      offset: rangeInfo.offset,
    };
  }
};

export const onbeforeinput = (e, element, value) => {
  const documentRangeInfo = getDocumentSelectionRangeInfo(element);
  const text = getText(e);
  const range = e.getTargetRanges()[0];
  // Can't modify static range directly to get range info
  const dynamicRange = dynamicRangeFromStatic(range);
  const rangeInfo = getRangeInfo(dynamicRange, element);
  console.log("range", rangeInfo);
  console.log(
    "beforeinput",
    documentRangeInfo
    // e,
    // text,
    // e.target.textContent,
    // e.getTargetRanges(),
    // getRangeInfo(dynamicRange, element)
  );
  e.preventDefault();
  let newValue = value;
  if (documentRangeInfo.length > 0 && text) {
    newValue = strRemoveRange(newValue, documentRangeInfo);
    console.log("purgedval", newValue);
  }
  return strModifyRange(newValue, rangeInfo, text);
};

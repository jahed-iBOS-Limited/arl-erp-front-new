// match text with commands
export const matchText = (transcript, menuList) => {
  // exact match first
  const exactmatchedObject = menuList.find((item) => {
    // command space removed
    const commandWithoutSpace = item.label.replace(/\s/g, "");
    // transcript space removed
    const transcriptWithoutSpace = transcript.replace(/\s/g, "");
    return (
      commandWithoutSpace.toLowerCase() === transcriptWithoutSpace.toLowerCase()
    );
  });

  if (exactmatchedObject) {
    return exactmatchedObject?.to;
  }

  // partial match
  const matchedObject = menuList.find((item) => {
    // command space removed
    const commandWithoutSpace = item.label.replace(/\s/g, "");
    // transcript space removed
    const transcriptWithoutSpace = transcript.replace(/\s/g, "");

    return commandWithoutSpace
      .toLowerCase()
      .includes(transcriptWithoutSpace.toLowerCase());
  });
  if (matchedObject) {
    return matchedObject?.to;
  }

  // best match
  const bestMatchObject = bestMatch(menuList, transcript);
  if (bestMatchObject) {
    return bestMatchObject?.to;
  }

  return false;
};

const bestMatch = (menuList, transcript) => {
  // Function to split a sentence into words and remove duplicates
  function splitAndRemoveDuplicates(sentence) {
    return [...new Set(sentence.toLowerCase().split(" "))];
  }

  // Find the menu item with the best word match
  let bestMatch;
  let maxMatchedWords = 0;

  const voiceTestWords = splitAndRemoveDuplicates(transcript);
  for (const item of menuList) {
    const menuItemWords = splitAndRemoveDuplicates(item.label);
    const matchedWords = menuItemWords.filter((word) =>
      voiceTestWords.includes(word)
    );
    if (matchedWords.length > maxMatchedWords) {
      maxMatchedWords = matchedWords.length;
      bestMatch = item;
    }
  }

  return bestMatch;
};

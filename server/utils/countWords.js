module.exports.countWordsLength = (text) => {
  // split the texts into words
  const words = text.split(/\s+/);
  // Initialize a variable to store the total length
  let totalLength = 0;
  //    Iterate throufg each word and add its length to the total
  words.forEach((word) => {
    // Remove punctuation marks to get actual word length
    const wordLength = word.replace(/[^\w\s]/g, "").length;
    totalLength += wordLength;
  });

  return totalLength;
};

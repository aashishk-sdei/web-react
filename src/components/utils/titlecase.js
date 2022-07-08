export const titleCase = (str) =>{
  if(str === "" || str === undefined || str === null) return ""
  //Skip below list of articels/prepostions/conjunctions/conjugations from TitleCase
  const articles = ['an', 'the','a'];
  const conjunctions = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so','if'];
  const prepositions = ['with', 'at', 'from', 'into','upon', 'of', 'to', 'in', 'for', 'it', 
  'as', 'my', 'on', 'by', 'like', 'over', 'plus', 'but', 'up', 'down', 'off', 'near', 
  'van', 'den', 'von', 'und', 'der', 'de', 'da'];
  const conjugations = ['is', 'am', 'are', 'was', 'were', 'being', 'been']
  //Always capitalize below list of uppercase_exceptions
  const uppercase_exceptions =['usa', 'uk', 'ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix']

  // Replace other characters with space
  const replaceCharsWithSpace = (newstr) => newstr.replace(/[^0-9?a-z(),.;'/\-&\\ÀÁÂÄàáâäÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÖòóôöÙÚÛÜùúûüƒÿÜŸçÇßÐÑ×ÝÞßðñýæåœøÆÅŒØ€þ∙]/gi, ' ').replace(/(\s\s\s)/gi, ' ');
  const capitalizeFirstLetter = (newstr) => newstr.charAt(0).toUpperCase() + newstr.substr(1);
  const shouldCapitalize = (word, posWithinStr) => {
    if (word.toLowerCase().includes("l'") && word.length >2 && word.toLowerCase().indexOf("l'") === 0){
      words[posWithinStr] = "l'" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.toLowerCase().includes("o'") && word.length >2 && word.toLowerCase().indexOf("o'") === 0){
      words[posWithinStr] = "O'" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.toLowerCase().includes("d'") && word.length >2 && word.toLowerCase().indexOf("d'") === 0){
      words[posWithinStr] = "d'" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.toLowerCase().includes("mc") && word.length >2 && word.toLowerCase().indexOf("mc") === 0){
      words[posWithinStr] = "Mc" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.toLowerCase().includes("st.") && word.length >3 && word.toLowerCase().indexOf("st.") === 0){
      words[posWithinStr] = "St." + word.charAt(3).toUpperCase() + word.slice(4)
      return false
    }
    else if(posWithinStr > 0 && (articles.includes(word.toLowerCase()) || conjunctions.includes(word.toLowerCase()) || conjugations.includes(word.toLowerCase()) || prepositions.includes(word.toLowerCase())))
    {
      words[posWithinStr] = words[posWithinStr].toLowerCase()
      return false
    }
    else if ((words[posWithinStr] === words[posWithinStr].toUpperCase)) {
      return true;
    }
    else return true;
  }
  //convert character after '-' to uppercase
  const transformToUpperCase = (convertstr, separators) => {
    separators = separators || [ ' ' ];
    const regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    return convertstr.replace(regex, function(x) { return x.toUpperCase(); });
  }

  str = replaceCharsWithSpace(str);
  let words = str.split(' ')
  let prevword
  for (let i = 0; i < words.length; i++) {
    if(words[0].length > 1)
      prevword = words[i].slice(0,-1)
    else
      prevword = words[i]
    if(uppercase_exceptions.indexOf(words[i].toLowerCase()) !== -1){
      words[i] = words[i].toUpperCase()
    }
    else if(uppercase_exceptions.includes(prevword.toLowerCase()) && uppercase_exceptions.indexOf(words[i].toLowerCase()) === -1){
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase()
    }
    if(words[i].includes('-'))
      words[i] = transformToUpperCase(words[i], ['-'])
    else 
      words[i] = (shouldCapitalize(words[i], i) ? capitalizeFirstLetter(words[i]) : words[i]); 
  }
  return  words.join(' ');
}
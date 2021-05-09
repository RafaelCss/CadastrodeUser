const readLine = require('readline-sync') //biblioteca de pegar dados do input pelo cmd ..
const state =require('./state.js')

async function robot(){
    const content = {
    maximumSentences: 7,           
  }
  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  state.save(content)
  
  function askAndReturnSearchTerm(){
    return readLine.question('Type a Wikipedia search terms: ')
    }
  
  function askAndReturnPrefix(){
      const prefixes = ['Who is', 'What is', 'The history of']
      const selectedPrefixIndex =  readLine.keyInSelect(prefixes)
      const selectedPrefixText = prefixes[selectedPrefixIndex]
  
      return selectedPrefixText
   }
    console.log(JSON.stringify(content, null, 4))
  }
  


module.exports = robot
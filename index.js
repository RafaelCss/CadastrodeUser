const readLine = require('readline-sync') //biblioteca de pegar dados do input pelo cmd ..

function start(){
const content = {}

content.searchTerm = askAndReturnSearchTerm()
content.prefix = askAndReturnPrefix()

function askAndReturnSearchTerm(){

    return readLine.question('Type a Wikipedia search terms: ')
  }

function askAndReturnPrefix(){
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex =  readLine.keyInSelect(prefixes)
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText

 }


console.log(content)
}

start()
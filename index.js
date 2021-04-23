const readLine = require('readline-sync') //biblioteca de pegar dados do input pelo cmd ..
const robots ={
      text : require('./robots/text.js')


}





function start(){
const content = {}

content.searchTerm = askAndReturnSearchTerm()
content.prefix = askAndReturnPrefix()

robots.text(content)

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
const algorithmia = require("algorithmia")
const algorithmiaApiKey = require('../credenciais/algorithmia.json').apikey
const sentenceBoundaryDetection =  require('sbd')



const watsonApiKey = require('../credenciais/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

 
var nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey : watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});


 

 async function robot (content){
      await fetchContentFromWikipedia(content)
      sanitizeContent(content)
      breakContentIntoSentences(content)
      limitMaximumSentence(content)
      await fetchKeyWordsOfSentences(content)

 async function fetchContentFromWikipedia(content){
      const algorithmiaAuthenticated= algorithmia(algorithmiaApiKey)
      const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2")
      const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
      const wikipediaContent = wikipediaResponse.get()
    
      content.sourceContentOriginal = wikipediaContent.content

  }

  function sanitizeContent(content){
    const withoutBlankLinesAndMArkDown =  removeBlankLinesAndMArkDown(content.sourceContentOriginal)
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMArkDown)
  
    content.sourceContentSanitized = withoutDatesInParentheses

    function removeBlankLinesAndMArkDown(text){

        const allLines = text.split("\n")
        const withoutBlankLinesAndMArkDown = allLines.filter((line) =>{


            if(line.trim().length === 0 || line.trim().startsWith('=')){

                return false
            }

            return true
        })

        return withoutBlankLinesAndMArkDown.join(' ')
    }
  }

  function removeDatesInParentheses(text){

    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/ /g,' ')

  }


  function breakContentIntoSentences(content){
    content.sentences = []
    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
    sentences.forEach((sentence) =>{
      content.sentences.push({
        text : sentence,
        keywords: [],
        images: []

      })

    })


  }
      function limitMaximumSentence(content){
        content.sentences = content.sentences.slice(0,content.maximumSentences)

      }


     async function fetchKeyWordsOfSentences(content) {

    for(const sentence of content.sentences ){

      content.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
    }

   }

  async function fetchWatsonAndReturnKeywords(sentence){

    return new Promise((resolve, reject) =>{
    
      nlu.analyze({
        text: sentence,
        features:{
          keywords:{}
        } 
        
      },(error, response)=>{
        if(error) {
          throw error
        }
      
         const keywords =response.keywords.map((keyword)=>{ 
           
           return keyword.text
          
         })
        
         resolve(keywords)
        })
      })
    }
 
}

module.exports = robot
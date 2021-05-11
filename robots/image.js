const imageDownload = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1') 
const state = require('./state')
const googleSearchCredentials = require('../credenciais/google.search.json')


async function robot(){

const content = state.load()

//await fetchImagenOfAllSentences(content)
 await downloadAllImages(content)   
//state.save(content)

async function fetchImagenOfAllSentences(content){
    for(const sentence of content.sentences){
        const query = `${content.searchTerm} ${sentence.keywords[0]}`
        sentence.images = await fetchGoogleAndReturnImagensLinks(query)

        sentence.googleSearchQuery = query
    }

}


async function fetchGoogleAndReturnImagensLinks(query){
    const response  = await customSearch.cse.list({
    auth : googleSearchCredentials.apiKey,
    cx : googleSearchCredentials.searchEngineId,
    q:query,
    searchType:'image',
    num: 2
    })
        const imageUrl = response.data.items.map((item) =>{ 
            return item.link
        })

   return imageUrl     

}

async function downloadAllImages(content){

    content.downloadImages = []
    
    for(let sentenceIndex = 0  ; sentenceIndex < content.sentences.length; sentenceIndex++){

        const images = content.sentences[sentenceIndex].images

        for(let imageIndex = 0 ;imageIndex < images.length; imageIndex++){

            const imageUrl = images[imageIndex]

            try{
                if(images.downloadImages.includes(imageUrl)){
                    throw new Error('imagem já foi baixada')
                }
                 await downloadAndSave(imageUrl,`${sentenceIndex}-original.png`)
                content.downloadImages.push(imageUrl)
                console.log(`|${sentenceIndex}||${imageIndex}|Baixou imagen com sucesso ${imageUrl}`)
                break
            }catch(error){
                console.log(`>|${sentenceIndex}||${imageIndex}| Erro ao Baixar ${imageUrl}: ${error} `)

          }
       }
    }

  }

  async function downloadAndSave(url, filename){
    return imageDownload.image({
        url:url,
        dest: `./content/${filename}`,
    })

  }

}

module.exports = robot
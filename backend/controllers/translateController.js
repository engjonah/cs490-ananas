const axios = require('axios')

let cache = []

const clearCache = () => {
    cache = []
}

const getTranslation = async (req, res) => {
        const { inputLang, outputLang, inputCode } = req.body
        // check cache for same input code, input language, and output language
        console.time('apiCall');
        for (let i = 0; i < cache.length; i++) {
            let entry = cache[i]
            if (entry.inputCode === inputCode && entry.inputLang === inputLang && entry.outputLang === outputLang) {
                res.status(200).json({translation: entry.outputCode})
                console.log("Saved API Call With Cache")
                console.timeEnd('apiCall')
                return
            }
        }
        const message = `Translate the following code without adding additional functions, imports, examples, or wrappers from ${inputLang} to ${outputLang}. For packages/libraries, find the equivalent libraries in the output languages.
        If equivalent packages/libraries do not exist in the output langauge, then make sure to write a comment stating they do not exist. For methods/functions used in the input code, find the equivalent methods for the output code. If none exist, make sure to write a comment
        indicating so. Here is the code: ${inputCode}`

        const requestData = {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": message }],  
        }
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
            'Content-Type': 'application/json',
        }
        await axios.post('https://api.openai.com/v1/chat/completions', requestData, {headers: headers})
        .then(async (response) => {
            const outputCode = response.data.choices[0].message.content
            // add successful translation to cache
            cache.unshift({inputLang, outputLang, inputCode, outputCode})
            if (cache.length > 3) cache.pop()
            // console.log("Cached Translation")
            res.status(200).json({translation: outputCode})
        }).catch(error => {
            const status = error.response.status
            if (status === 429) {
                res.status(429).json({error: 'Rate Limit Exceeded'})
            } else if (status === 503) {
                res.status(503).json({error: 'API Connection Error'})
            } else {
                res.status(500).json({error: 'Unknown Error Occurred'})
            }
            console.log(`error occurred: ${error.message}`)
        })
        console.timeEnd('apiCall')
}

module.exports = {
    getTranslation,
    clearCache,
    cache
}

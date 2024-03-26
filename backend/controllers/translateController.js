const axios = require('axios')

const getTranslation = async (req, res) => {
        const { inputLang, outputLang, inputCode } = req.body
        const message = `Translate the following code exactly 1:1 without adding anything (such as additional functions, main functions, imports, examples, new comments, or wrappers) from ${inputLang} to ${outputLang}: ${inputCode}`
        const requestData = {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": message }],  
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
            'Content-Type': 'application/json',
        }
        await axios.post('https://api.openai.com/v1/chat/completions', requestData, {headers: headers})
        .then(async (response) => {
            const outputCode = response.data.choices[0].message.content
            console.log(outputCode)
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
}

module.exports = {
    getTranslation,
}

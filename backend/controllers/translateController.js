let Translation = require('../models/Translation.model');

const OpenAI = require('openai')

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY})

const getTranslation = async (req, res) => {
    try {
        const { uid, inputLang, outputLang, inputCode, translatedAt } = req.body
        const message = `Translate the following code exactly 1:1 without adding anything (such as additional functions, main functions, examples, new comments, or wrappers) from ${inputLang} to ${outputLang}: ${inputCode}`
        const requestData = {
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": message }],  
        }
        const outputCode = completion.choices[0].message.content;
        console.log(outputCode)

        // add to translationHistory
        const newTranslation = new Translation({
            uid,
            inputLang,
            outputLang,
            inputCode,
            outputCode,
            translatedAt,
        })
        await newTranslation.save();
        res.status(200).json({translation: outputCode})

    } catch (error) {
        if (error.status === 429) {
            res.status(429).json({error: 'Rate Limit Exceeded'})
        } else if (error.status === 503) {
            res.status(503).json({error: 'API Connection Error'})
        } else {
            res.status(500).json({error: 'Unknown Error'})
        }
        console.log(`error occurred: ${error.message}`)
    }
}

module.exports = {
    getTranslation,
}

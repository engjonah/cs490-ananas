let Translation = require('../models/Translation.model');

const OpenAI = require('openai')

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY})

const getTranslation = async (req, res) => {
    try {
        const { uid, inputLang, outputLang, inputCode, translatedAt } = req.body
        const message = `Convert the following code from ${inputLang} to ${outputLang}: ${inputCode}`
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": message }],  
        })
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
        console.log(`error occurred: ${error.message}`)
    }
}

module.exports = {
    getTranslation,
}
const OpenAI = require('openai')

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY})

const getTranslation = async (req, res) => {
    try {
        const { inputLang, outputLang, code } = req.body
        const message = `Convert the following code from ${inputLang} to ${outputLang}: ${code}`
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": message }],  
        })
        console.log(completion.choices[0].message.content)
        res.status(200).json({translation: completion.choices[0].message.content})
    } catch (error) {
        console.log(`error occurred: ${error.message}`)
    }
}

module.exports = {
    getTranslation
}
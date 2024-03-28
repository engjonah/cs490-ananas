let Translation = require('../models/Translation.model');

const createTranslation = async (req, res) => {
    try {
        const { uid, inputLang, outputLang, inputCode, outputCode, status, translatedAt } = req.body
        // add to translationHistory
        const newTranslation = new Translation({
            uid,
            inputLang,
            outputLang,
            inputCode,
            outputCode,
            status,
            translatedAt,
        })
        const obj = await newTranslation.save();
        res.status(200).json({Message: "Translation saved!", translationId:obj.id})
    } catch (error) {
        console.log(`error occurred: ${error.message}`)
        res.status(500).json({ error: error.message });
    }
}

// get translations by uid
const readTranslationsByUid = async (req, res) => {
    try {
        const { uid } = req.params;
        const translations = await Translation.find({ uid });

        // check translations exist
        if (!translations || translations.length === 0) {
            return res.status(404).json({ error: `No translations found for uid ${uid}` });
        }

        res.status(200).json({ Translations: translations });
    } catch (error) {
        console.log(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

const updateTranslationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { inputLang, outputLang, inputCode, outputCode, status, translatedAt } = req.body;

        const updatedTranslation = await Translation.findByIdAndUpdate(id, {
            inputLang,
            outputLang,
            inputCode,
            outputCode,
            status,
            translatedAt,
        }, { new: true });

        // check translation exists
        if (!updatedTranslation) {
            return res.status(404).json({ error: "Translation not found." });
        }

        res.status(200).json({ UpdatedTranslation: updatedTranslation });
    } catch (error) {
        console.log(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

const deleteTranslationById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTranslation = await Translation.findByIdAndDelete(id);

        // check translation exists
        if (!deletedTranslation) {
            return res.status(404).json({ Message: "Translation not found" });
        }

        res.status(200).json({ Message: "Translation deleted successfully" });
    } catch (error) {
        console.log(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    createTranslation,
    readTranslationsByUid,
    updateTranslationById,
    deleteTranslationById
}
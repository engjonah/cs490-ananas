const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TranslationSchema = new Schema({
    uid:{
        type: String,
        required: true,
    },
    inputLang:{
        type: String,
        required: true,
    },
    outputLang:{
        type: String,
        required: true,
    },
    inputCode:{
        type: String,
        required: true,
    },
    outputCode:{
        type: String,
        required: true,
    },
    status:{
        type: Number,
        required: true,
    },
    translatedAt:{
        type: Date,
        required: true,
    },
    
})

const Translation = mongoose.model('Translation', TranslationSchema);

module.exports = Translation;
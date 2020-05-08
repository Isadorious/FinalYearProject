const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName: {
        type: `String`,
        required: true,
        trim: true,
    },
});

module.exports = mongoose.model(`Category`, categorySchema);
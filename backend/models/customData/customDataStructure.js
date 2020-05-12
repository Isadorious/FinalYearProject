const mongoose = require(`mongoose`);

const customDataPairs = require(`./customDataPairs`);

const Schema = mongoose.Schema;

const structureSchema = new Schema({
	customDataName: {
		type: `String`,
		required: true,
		trim: true
	},
	DisplayKeyPairs: {
		type: [customDataPairs.schema]
	},
});

module.exports = mongoose.model(`customDataStructure`, structureSchema);
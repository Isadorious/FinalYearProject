const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const customDataPairsSchema = new Schema({
	displayName: {
		type: `String`,
		required: true,
		trim: true,
	},
	key: {
		type: `String`,
		required: true,
		trim: true,
	},
	dataType: {
		type: `String`,
		required: true,
		trim: true,
	}
});

module.exports = mongoose.model(`customDataPairs`, customDataPairsSchema);
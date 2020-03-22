const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const customSchema = new Schema({
	authorID: {
		type: [`String`],
		required: true,
	},
});

module.exports = mongoose.model(`CustomData`, customSchema);
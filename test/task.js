process.env.NODE_ENV = `test`;

const mongoose = require(`mongoose`);
const Task = require(`../backend/models/task`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Task`, () => {
	beforeEach((done) => {
		Task.deleteMany({}, (err) => {
			done();
		});
	});
});
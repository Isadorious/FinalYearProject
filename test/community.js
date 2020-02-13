process.env.NODE_ENV = `test`;

const mongoose = require(`mongoose`);
const Community = require(`../backend/models/community`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Community`, () => {
	beforeEach((done) => {
		Community.deleteMany({}, (err) => {
			done();
		});
	});
});
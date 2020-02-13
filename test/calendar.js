process.env.NODE_ENV = `test`;

const mongoose = require(`mongoose`);
const Calendar = require(`../backend/models/calendar`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Calendar`, () => {
	beforeEach((done) => {
		Calendar.deleteMany({}, (err) => {
			done();
		});
	});
});
process.env.NODE_ENV = `test`;

const mongoose = require(`mongoose`);
const Calendar = require(`../backend/models/calendar`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Task`, () => {
	beforeEach((done) => {
		Calendar.deleteMany({}, (err) => {
			done();
		});
	});

	/*
	*	Test the GET route
	*/
	describe(`/GET task`, () => {
		it(`it should get all tasks`, (done) => {
			chai.request(app)
			.get(`/api/tasks`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a(`array`);
				res.body.length.should.be.eql(0);
				done();
			});
		})
	});
});
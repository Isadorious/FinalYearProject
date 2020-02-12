process.env.NODE_ENV = `test`;

const mongoose = require(`mongoose`);
const User = require(`../backend/models/user`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Users`, () => {
	beforeEach((done) => {
		User.deleteMany({}, (err) => {
			done();
		});
	});

	/*
	*	Test the GET user route
	*/
	describe(`/GET user`, () => {
		it(`it should get all users`, (done) => {
			chai.request(app)
			.get(`/api/users`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a(`array`);
				res.body.should.be.eql(0);
			});
		});
	});
});
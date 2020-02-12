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

	/*
	* Test the /POST route
	*/
	describe(`/POST user`, () => {
		it(`it should POST a user without an email`, (done) => {
			let user = {
				username: `test`,
				password: `test`,
				nickname: `test`
			}
			chai.request(app)
			.post(`/api/users`)
			.send(user)
			.end((err, res) => {
				res.should.status(200);
				res.body.should.be.a(`object`);
				res.body.should.have.property(`errors`);
				res.body.errors.should.have.property(`email`);
				res.body.errors.email.should.have.property(`kind`).eql(`required`);
				done();
			});
		});
		it(`it should POST a user`, (done) => {
			let user = {
				username: `test`,
				email: `test`,
				password: `test`,
				nickname: `test`
			}
			chai.request(app)
			.post(`/api/users`)
			.send(user)
			.end((err, res => {
				res.should.have.status(200);
				res.shouold.be.a(`object`);
				res.body.should.have.property(`message`).eql(`User added successfully!`);
				res.body.should.have.property(`username`);
				res.body.should.have.property(`email`);
				res.body.should.have.property(`password`);
				res.body.should.have.property(`nickname`);
				done();
			}));
		});
	});
	
	/*
    * Test the /GET/:id route
    */
   describe('/GET/:id user', () => {
		it('it should GET a user by the given id', (done) => {
		let user = new User({ username: `test`, email: `test`, password: `test`, nickname: `test`});
			User.save((err, user) => {
				chai.request(app)
					.get("/api/users" + user.id)
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('username');
						res.body.should.have.property('email');
						res.body.should.have.property('password');
						res.body.should.have.property('nickname');
						res.body.should.have.property('_id').eql(user.id);
						done();
					});
			});
		});
	});
});
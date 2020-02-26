process.env.NODE_ENV = `test`;

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
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe(`/POST user`, () => {
		it(`it should POST a user without a password`, (done) => {
			const user = {
				username: `test`,
			};
			chai.request(app)
				.post(`/api/users`)
				.send(user)
				.end((err, res) => {
					res.should.status(200);
					console.log(res.body);
					res.body.should.be.a(`object`);
					res.body.should.have.property(`message`);
					res.body.message.should.eql(`Missing credentials`);
					done();
				});
		});
		it(`it should POST a user`, (done) => {
			const user = {
				username: `test`,
				email: `test`,
				password: `test`,
				nickname: `test`
			};
			chai.request(app)
				.post(`/api/users`)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.a(`object`);
					res.body.should.have.property(`message`).eql(`User added successfully!`);
					res.body.user.should.have.property(`username`);
					res.body.user.should.have.property(`email`);
					res.body.user.should.have.property(`password`);
					res.body.user.should.have.property(`nickname`);
					done();
				});
		});
	});

	/*
    * Test the /GET/:id route
    */
	describe(`/GET/:id user`, () => {
		it(`it should GET a user by the given id`, (done) => {
			const user = new User({ username: `test`, email: `test`, password: `test`, nickname: `test` });
			user.save((err, user) => {
				chai.request(app)
					.get(`/api/users/` + user.id)
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`username`);
						res.body.should.have.property(`email`);
						res.body.should.have.property(`password`);
						res.body.should.have.property(`nickname`);
						res.body.should.have.property(`_id`).eql(user.id);
						done();
					});
			});
		});
	});


	/*
    * Test the /PUT/:id route
    */
	describe(`/PUT/:id user`, () => {
		it(`it should UPDATE a user given the id`, (done) => {
			const user = new User({ username: `test`, email: `test`, password: `test`, nickname: `test` });
			user.save((err, user) => {
				chai.request(app)
					.put(`/api/users/` + user.id)
					.send({ username: `test`, email: `test`, password: `test`, nickname: `nickname` })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`User updated!`);
						res.body.user.should.have.property(`nickname`).eql(`nickname`);
						done();
					});
			});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe(`/DELETE/:id user`, () => {
		it(`it should DELETE a user given the id`, (done) => {
			const user = new User({ username: `test`, email: `test`, password: `test`, nickname: `test` });
			user.save((err, user) => {
				chai.request(app)
					.delete(`/api/users/` + user.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`User successfully deleted!`);
						res.body.result.should.have.property(`ok`).eql(1);
						res.body.result.should.have.property(`n`).eql(1);
						done();
					});
			});
		});
	});

	/*
	* Test the GET LOGIN route
	*/
	describe(`/LOGIN user`, () => {
		it(`it should LOGIN a user`, (done) => {
			const user = new User({username: `test`, password: `test`, email:`test@test.com`});
			user.save((err, user) => {
				chai.request(app)
					.get(`/api/users/login`)
					.send({username: `test`, password: `test`})
					.end((err, res)=> {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`auth`);
						res.body.auth.should.be.eql(true);
						res.body.should.have.property(`token`);
						res.body.should.have.property(`message`);
						res.body.message.should.be.eql(`User logged in successfully!`);
						done();
					});
			});
		});
	});
});
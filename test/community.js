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

	/*
	*	Test the GET community route
	*/
	describe(`/GET community`, () => {
		it(`it should get all communities`, (done) => {
			chai.request(app)
				.get(`/api/communities`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a(`array`);
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	/*
	*	Test the GET/:id community route
	*/
	describe(`/GET/:id community`, () => {
		it(`it should GET a community by the given id`, (done) => {
			let community = new Community({ communityName: `Test Community`, ownerID: `1` });
			community.save((err, community) => {
				chai.request(app)
					.get(`/api/communities/` + community.id)
					.send(community)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('communityName');
						res.body.should.have.property('ownerID');
						done();
					});
			});
		});
	});
});
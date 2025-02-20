process.env.NODE_ENV = `test`;

const Community = require(`../models/community`);
const CustomData = require(`../models/customData`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Custom Data`, () => {
	beforeEach((done) => {
		Community.deleteMany({}, (err) => {
			CustomData.deleteMany({}, (err) => {
				done();
			});
		});
	});

	/*
	*	Test the GET custom data route
	*/
	describe(`/GET custom data`, () => {
		it(`it should get all custom data for the specified community and data structure`, (done) => {
			const community = new Community({ communityName: `Test Community`, ownerID: `1`});
			community.dataStores.push({customDataTitle: `Custom Data Test`});
			community.save((err, community) => {
				chai.request(app)
				.get(`/api/customData/` + community.id + `/structure/` + community.dataStores[0].id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a(`array`);
					res.body.length.should.be.eql(0);
					done();
				});
			});
		});
	});

	/*
	*	Test the GET/:id custom data route
	*/
	describe(`/GET/:id custom data`, () => {
		it(`it should GET a piece custom data by the given id`, (done) => {
			const community = new Community({ communityName: `Test Community`, ownerID: `1`});
			community.dataStores.push({customDataTitle: `Custom Data Test`});
			community.save((err, community) => {
				const customData = new CustomData({authorID: `1`, communityID: community.id, structureID: community.dataStores[0].id});
				customData.save((err, customData) => {
					chai.request(app)
					.get(`/api/customData/` + community.id + `/structure/` + community.dataStores[0].id + `/data/` + customData.id)
					.send(customData)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`authorID`);
						done();
					});
				});
			});
		});
	});

	/*
	*	Test the POST route
	*/
	describe(`/POST customData`, () => {
		it(`it should POST a customData without an author`, (done) => {
			const community = new Community({ communityName: `Test Community`, ownerID: `1`});
			community.dataStores.push({customDataTitle: `Custom Data Test`});
			community.save((err, community) => {
				const customData = {communityID : community.id, structureID: community.dataStores[0].id};
				chai.request(app)
				.post(`/api/customData`)
				.send(customData)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a(`object`);
					res.body.should.have.property(`errors`);
					res.body.errors.should.have.property(`authorID`);
					res.body.errors.authorID.should.have.property(`kind`).eql(`required`);
					done();
				});
			});
		});
		it(`it should POST a customData`, (done) => {
			const community = new Community({ communityName: `Test Community`, ownerID: `1`});
			community.dataStores.push({customDataTitle: `Custom Data Test`});
			community.save((err, community) => {
				const customData = {authorID: `1`, communityID : community.id, structureID: community.dataStores[0].id};
				chai.request(app)
				.post(`/api/customData`)
				.send(customData)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a(`object`);
					res.body.should.have.property(`message`).eql(`CustomData added successfully!`);
					res.body.should.have.property(`customData`);
					done();
				});
			});
		});
	});

	/*
	*	Test the PUT/:id route
	*/
	describe(`PUT/:id customData`, () => {
		it(`it should update a customData with the given id`, (done) => {
			const community = new Community({ communityName: `Test Community`, ownerID: `1`});
			community.dataStores.push({customDataTitle: `Custom Data Test`});
			community.dataStores[0].DisplayKeyPairs.push({displayName: `Name`, key: `name`, dataType: `String`});
			community.save((err, community) => {
				const customData = new CustomData({authorID: `1`, communityID : community.id, structureID: community.dataStores[0].id});
				customData.content.push({name: `test`});
				customData.save((err, customData) => {
					chai.request(app)
						.put(`/api/customData/` +community.id + `/structure/` + community.dataStores[0].id + `/data/` + customData.id)
						.send({content: {name: `PUT Test`}})
						.end((err, res) => {
							console.log(res.body);
							console.log(res.body.customData.content);
							res.should.have.status(200);
							res.body.should.be.a(`object`);
							res.body.should.have.property(`message`).eql(`customData updated successfully!`);
							res.body.customData.should.have.property(`content`);
							res.body.customData.content.should.be.a(`array`);
							res.body.customData.content[0].should.have.property(`name`).eql(`PUT Test`);
							done();
						});
				});
			});
		});
	});

	/*
	* Test the DELETE/:id route
	*/
	describe(`DELETE/:id customData`, () => {
		it(`it should DELETE a customData given the id`, (done) => {
			const customData = new CustomData({ authorID: `1`, structureID: `1`, communityID: `1` });
			customData.save((err, customData) => {
				chai.request(app)
					.delete(`/api/customData/` + customData.communityID + `/structure/` + customData.structureID + `/data/` + customData.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`customData successfully deleted!`);
						res.body.result.should.have.property(`ok`).eql(1);
						res.body.result.should.have.property(`n`).eql(1);
						done();
					});
			});
		});
	});
});
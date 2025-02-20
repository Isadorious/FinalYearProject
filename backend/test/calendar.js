process.env.NODE_ENV = `test`;

const Calendar = require(`../models/calendar`);

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

	/*
	*	Test the GET calendar route
	*/
	describe(`/GET calendar`, () => {
		it(`it should get all calendars`, (done) => {
			chai.request(app)
				.get(`/api/calendars`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a(`array`);
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	/*
	*	Test the GET/:id calendar route
	*/
	describe(`/GET/:id calendar`, () => {
		it(`it should GET a calendar by the given id`, (done) => {
			const calendar = new Calendar({ calendarName: `Test calendar` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id)
					.send(calendar)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`calendarName`);
						done();
					});
			});
		});
	});

	/*
	*	Test the POST route
	*/
	describe(`/POST calendar`, () => {
		it(`it should POST a calendar without a calendar name`, (done) => {
			const calendar = {};
			chai.request(app)
				.post(`/api/calendars`)
				.send(calendar)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a(`object`);
					res.body.should.have.property(`errors`);
					res.body.errors.should.have.property(`calendarName`);
					res.body.errors.calendarName.should.have.property(`kind`).eql(`required`);
					done();
				});
		});
		it(`it should POST a calendar`, (done) => {
			const calendar = { calendarName: `Test calendar` };
			chai.request(app)
				.post(`/api/calendars`)
				.send(calendar)
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.a(`object`);
					res.body.should.have.property(`message`).eql(`Calendar added successfully!`);
					res.body.calendar.should.have.property(`calendarName`);
					done();
				});
		});
	});

	/*
	*	Test the PUT/:id route
	*/
	describe(`PUT/:id calendar`, () => {
		it(`it should update a calendar with the given id`, (done) => {
			const calendar = new Calendar({ calendarName: `Test calendar` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.put(`/api/calendars/` + calendar.id)
					.send({ calendarName: `GC Org Calendar` })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Calendar updated!`);
						res.body.calendar.should.have.property(`calendarName`).eql(`GC Org Calendar`);
						done();
					});
			});
		});
	});

	/*
	* Test the DELETE/:id route
	*/
	describe(`DELETE/:id calendar`, () => {
		it(`it should DELETE a calendar given the id`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.delete(`/api/calendars/` + calendar.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Calendar successfully deleted!`);
						res.body.result.should.have.property(`ok`).eql(1);
						res.body.result.should.have.property(`n`).eql(1);
						done();
					});
			});
		});
	});
});
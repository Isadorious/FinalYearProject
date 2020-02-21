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
	describe(`/GET all tasks for one calendar`, () => {
		it(`it should GET all tasks for the calendar with the given id`, (done) => {
			let calendar = new Calendar({ calendarName: `Test calendar` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id + `/tasks`)
					.send(calendar)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0);
						done();
					});
			});
		});
	});

	/*
	* Test the GET /:id route
	*/
	describe(`/GET/:id task`, () => {
		it(`it should GET a specfic tasks from a calendar`, (done) => {
			let calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example Task`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id + `/tasks/` +calendar.tasks[0].id)
					.send(calendar)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`taskName`);
						done();
					});
			});	
		});
	});
});
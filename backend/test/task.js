process.env.NODE_ENV = `test`;

const Calendar = require(`../models/calendar`);

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
			const calendar = new Calendar({ calendarName: `Test calendar` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id + `/tasks`)
					.send(calendar)
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
	* Test the GET /:id route
	*/
	describe(`/GET/:id task`, () => {
		it(`it should GET a specfic tasks from a calendar`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
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

	/*
	*	Test the POSt route
	*/
	describe(`/POST task`, () => {
		it(`it should POSt a task without a task name`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			const task = {};
			calendar.save((err, calendar) => {
				chai.request(app)
					.post(`/api/calendars/` +calendar.id + `/tasks`)
					.send(task)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`errors`);
						res.body.errors.should.be.a(`object`);
						res.body.errors.should.have.property(`tasks.0.taskName`);
						const errorBody = res.body.errors[`tasks.0.taskName`];
						errorBody.should.have.property(`kind`).eql(`required`);
						done();
					});
			});
		});
		it(`it should POST a task`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			const task = {taskName: `Example task`};
			calendar.save((err, calendar) => {
				chai.request(app)
					.post(`/api/calendars/` +calendar.id + `/tasks`)
					.send(task)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Task added successfully!`);
						res.body.task.should.have.property(`taskName`);
						done();
					});
			});
		});	
	});

	/*
	*	Test the PUT/:id route
	*/
	describe(`/PUT/:id Task`, () => {
		it(`It should update a task with the given ID`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example task`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.put(`/api/calendars/` +calendar.id + `/tasks/` +calendar.tasks[0].id)
					.send({taskName: `New Task Name`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Task updated successfully!`);
						res.body.task.should.have.property(`taskName`).eql(`New Task Name`);
						done();
					});
			});
		});
	});

	/*
	* Test the DELETE/:id route
	*/
	describe(`DELETE/:id task`, () => {
		it(`it should DELETE a task with the given id`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example task`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.delete(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Task successfully deleted!`);
						done();
					});
			});
		});
	});
});
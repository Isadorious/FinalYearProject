process.env.NODE_ENV = `test`;

const Calendar = require(`../backend/models/calendar`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Subtask`, () => {
	beforeEach((done) => {
		Calendar.deleteMany({}, (err) => {
			done();
		});
	});

	/*
    * Test the GET route
    */
	describe(`/GET all subtasks for one task`, () => {
		it(`it should GET all subtasks for the task with the given id`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.tasks.push({ taskName: `Example task` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/subtasks`)
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
    * Test the GET/:id route
    */
	describe(`/GET/:id subtask`, () => {
		it(`it should GET a specfic subtask from a task`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.tasks.push({ taskName: `Example task` });
			calendar.tasks[0].subTasks.push({ subTaskName: `This is a test subtask` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/subtasks/` + calendar.tasks[0].subTasks[0].id)
					.send(calendar)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`subTaskName`);
						done();
					});
			});
		});
	});

	/*
    * Test the POST route
    */
	describe(`/POST task`, () => {
		it(`it should POST a subtask without a name`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.tasks.push({ taskName: `Example task` });
			const subTask = {};
			calendar.save((err, calendar) => {
				chai.request(app)
					.post(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/subtasks`)
					.send(subTask)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`errors`);
						res.body.errors.should.be.a(`object`);
						res.body.errors.should.have.property(`tasks.0.subTasks.0.subTaskName`);
						const errorBody = res.body.errors[`tasks.0.subTasks.0.subTaskName`];
						errorBody.should.have.property(`kind`).eql(`required`);
						done();
					});
			});
		});
		it(`it should POST a subtask`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.tasks.push({ taskName: `Example task` });
			const subTask = { subTaskName: `This is a test subtask` };
			calendar.save((err, calendar) => {
				chai.request(app)
					.post(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/subtasks`)
					.send(subTask)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`SubTask added successfully!`);
						res.body.subTask.should.have.property(`subTaskName`);
						done();
					});
			});
		});
	});

	/*
    * Test the PUT/:id route
    */
	describe(`/PUT/:id Subtask`, () => {
		it(`It should update a subtask with the given id`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.tasks.push({ taskName: `Example task` });
			calendar.tasks[0].subTasks.push({ subTaskName: `This is a test subtask` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.put(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/subtasks/` + calendar.tasks[0].subTasks[0].id)
					.send({ subTaskName: `This is an updated subtask!` })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Subtask updated successfully!`);
						res.body.subTask.should.have.property(`subTaskName`).eql(`This is an updated subtask!`);
						done();
					});
			});
		});
	});

	/*
    * Test the DELETE/:id route
    */
	describe(`DELETE/:id subtask`, () => {
		it(`It should delete a subtask with the given ID`, (done) => {
			const calendar = new Calendar({ calendarName: `Test Calendar` });
			calendar.tasks.push({ taskName: `Example task` });
			calendar.tasks[0].subTasks.push({ subTaskName: `This is a test subtask` });
			calendar.save((err, calendar) => {
				chai.request(app)
					.delete(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/subtasks/` + calendar.tasks[0].subTasks[0].id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Subtask successfully deleted!`);
						done();
					});
			});
		});
	});
});
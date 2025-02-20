process.env.NODE_ENV = `test`;

const Calendar = require(`../models/calendar`);

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const app = require(`../app`);
const should = chai.should();

chai.use(chaiHttp);

describe(`Comment`, () => {
	beforeEach((done) => {
		Calendar.deleteMany({}, (err) => {
			done();
		});
	});

	/*
    * Test the GET route
    */
	describe(`/GET all comments for one task`, () => {
		it(`it should GET all comments for the task with the given id`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example task`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` +calendar.id + `/tasks/` + calendar.tasks[0].id + `/comments`)
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
	describe(`/GET/:id comment`, () => {
		it(`it should GET a specfic comment from a task`, (done) => {
			const calendar = new Calendar({calendarName: `Test Clendar`});
			calendar.tasks.push({taskName: `Example task`});
			calendar.tasks[0].taskComments.push({commentUserID: 1, commentContent: `This is a test comment`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.get(`/api/calendars/` + calendar.id + `/tasks/` +calendar.tasks[0].id + `/comments/` + calendar.tasks[0].taskComments[0].id)
					.send(calendar)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`commentContent`);
						done();
					});
			});
		});
	});

	/*
  * Test the POST route
  */
	describe(`/POST task`, () => {
		it(`it should POST a comment without any content`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example task`});
			const comment = {commentUserID: 1};
			calendar.save((err, calendar) => {
				chai.request(app)
					.post(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/comments`)
					.send(comment)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`errors`);
						res.body.errors.should.be.a(`object`);
						res.body.errors.should.have.property(`tasks.0.taskComments.0.commentContent`);
						const errorBody = res.body.errors[`tasks.0.taskComments.0.commentContent`];
						errorBody.should.have.property(`kind`).eql(`required`);
						done();
					});
			});
		});
		it(`it should POST a comment`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example task`});
			const comment = {commentUserID: 1, commentContent: `This is a test comment`};
			calendar.save((err, calendar) => {
				chai.request(app)
					.post(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/comments`)
					.send(comment)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Comment added successfully!`);
						res.body.comment.should.have.property(`commentContent`);
						done();
					});
			});     
		});
	});

	/*
    * Test the PUT/:id route
    */
	describe(`/PUT/:id Comment`, () => {
		it(`It should update a comment with the given id`, (done) => {
			const calendar = new Calendar({calendarName: `Test Clendar`});
			calendar.tasks.push({taskName: `Example task`});
			calendar.tasks[0].taskComments.push({commentUserID: 1, commentContent: `This is a test comment`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.put(`/api/calendars/` + calendar.id + `/tasks/` +calendar.tasks[0].id + `/comments/` + calendar.tasks[0].taskComments[0].id)
					.send({commentContent: `This is an updated comment!`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Comment updated successfully!`);
						res.body.comment.should.have.property(`commentContent`).eql(`This is an updated comment!`);
						done();
					});
			});
		});
	});

	/*
    * Test the DELETE/:id route
    */
	describe(`DELETE/:id comment`, () => {
		it(`It should delete a comment with the given ID`, (done) => {
			const calendar = new Calendar({calendarName: `Test Calendar`});
			calendar.tasks.push({taskName: `Example task`});
			calendar.tasks[0].taskComments.push({commentUserID: 1, commentContent: `This is a test comment`});
			calendar.save((err, calendar) => {
				chai.request(app)
					.delete(`/api/calendars/` + calendar.id + `/tasks/` + calendar.tasks[0].id + `/comments/` + calendar.tasks[0].taskComments[0].id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a(`object`);
						res.body.should.have.property(`message`).eql(`Comment successfully deleted!`);
						done();
					});
			});
		});
	});
});
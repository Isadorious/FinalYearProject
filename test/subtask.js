process.env.NODE_ENV = `test`;

const mongoose = require(`mongoose`);
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
            let calendar = new Calendar({ calendarName: `Test Calendar` });
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
            let calendar = new Calendar({ calendarName: `Test Calendar` });
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
});
// tests/users_api.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const db = require('../models');
const { performance } = require('perf_hooks');

let adminToken;
let idEmployeeToUpdate;
let idEmployeeToDelete;

describe('User API', () => {
    before(async ()=> {
        // Reset the database before running tests
        await db.sequelize.sync({ force: true });

        // Create a new admin 
        await request(app)
            .post('/register')
            .send({
                email: "example@example.com",
                password: "superPassword123",
                firstName: "Jane",
                lastName: "Doe",
                middleName: "Ginny",
                birthDate: "1995-01-09",
                phone: "+380663569955",
                programmingLanguage: "N/A",
                role: "admin",
                secretWord: process.env.SECRET_WORD,
                englishLevel: 'Advanced',
                salary: 3000
            });
        
        // Login as new admin
        const loginAdminResponse = await request(app)
            .post('/login')
            .send({
                email: "example@example.com",
                password: "superPassword123"
            });
        
        adminToken = loginAdminResponse.body.token;
        
        // Create a new employee to make get and put requests
        const firstEmplyeeResponse = await request(app)
            .post('/register')
            .send({
                email: "exampleEmployee@example.com",
                password: "superPassword123",
                firstName: "John",
                lastName: "Smith",
                middleName: "Tom",
                birthDate: "2000-08-11",
                phone: "+380663569933",
                programmingLanguage: "Java",
                country: 'France',
                mentorName: 'Jane Doe',
                englishLevel: 'Intermediate',
                salary: 1500
            });
        idEmployeeToUpdate = firstEmplyeeResponse.body.userId;

        // Create a new employee to make delete request
        const secondEmplyeeResponse = await request(app)
            .post('/register')
            .send({
                email: "exampleEmployee2@example.com",
                password: "superPassword123",
                firstName: "JohnToDelete",
                lastName: "Smith",
                middleName: "Tom",
                birthDate: "2000-08-11",
                phone: "+380663569911",
                programmingLanguage: "JavaScript",
                country: 'USA',
                mentorName: 'Jane Doe',
                englishLevel: 'Pre-Intermediate',
                salary: 1700
            });
        idEmployeeToDelete = secondEmplyeeResponse.body.userId;
    });

    describe('GET /users', () => {
        it('should get all emplyees with pagination', async ()=> {
            const pageParam = 1
            const limitParam = 3

            const start = performance.now();
            const result = await request(app)
                .get(`/users?page=${pageParam}&limit=${limitParam}`)
                .set('Authorization', `Bearer ${adminToken}`);
            const end = performance.now();
    
            expect(end - start).to.be.lessThan(200);
            expect(result.status).to.equal(200);
            expect(result.headers['content-type']).to.include('application/json');
            expect(result.body).to.have.property('total');
            expect(result.body).to.have.property('totalPages');
            expect(result.body.users).to.be.an('array').that.has.lengthOf(limitParam)
            expect(result.body).to.have.property('page', pageParam);
            const expectedStartIndex = (pageParam - 1) * limitParam; 
            for (let i = 0; i < result.body.users.length; i++) {
                expect(result.body.users[i].id).to.eql(expectedStartIndex + 1 + i);
            }
        });

        it('should get all emplyees sorted by salary DESC', async ()=> {
            const sortOrderParam = 'DESC';
            const sortKeyParam = 'salary';

            const start = performance.now();
            const result = await request(app)
                .get(`/users?sortOrder=${sortOrderParam}&sortKey=${sortKeyParam}`)
                .set('Authorization', `Bearer ${adminToken}`);
            const end = performance.now();
    
            expect(end - start).to.be.lessThan(200);
            expect(result.status).to.equal(200)
            expect(result.headers['content-type']).to.include('application/json');
            expect(result.body).to.have.property('total');
            expect(result.body).to.have.property('totalPages');
            expect(sortOrderParam).to.equal(sortOrderParam)
            for(let i = 0; i++; i < result.body.users.length - 1){
                expect(result.body.users[i][sortKeyParam]).to.be.greaterThan(result.body.users[i + 1][sortKeyParam])
            }
        });
    });

    describe('PUT /users/:id', () => {
        it('should update employee`s salary', async () => {
            const start = performance.now();
            const result = await request(app)
                .put(`/users/${idEmployeeToUpdate}`)
                .send({
                    email: "exampleEmployee@example.com",
                    password: "superPassword123",
                    firstName: "John",
                    lastName: "Smith",
                    middleName: "Tom",
                    birthDate: "2000-08-11",
                    phone: "+380663569933",
                    programmingLanguage: "Java",
                    country: 'France',
                    mentorName: 'Jane Doe',
                    englishLevel: 'Intermediate',
                    salary: 2000
                })
                .set('Authorization', `Bearer ${adminToken}`);
            const end = performance.now();
    
            expect(end - start).to.be.lessThan(200);
            expect(result.status).to.equal(200);
            expect(result.headers['content-type']).to.include('application/json');
            expect(result.body).to.deep.include({
                message: 'Данные обновлены'
            });
            expect(result.body.user).to.include({
                id: idEmployeeToUpdate,
                email: "exampleEmployee@example.com",
                password: "superPassword123",
                firstName: "John",
                lastName: "Smith",
                middleName: "Tom",
                birthDate: "2000-08-11",
                phone: "+380663569933",
                programmingLanguage: "Java",
                country: 'France',
                mentorName: 'Jane Doe',
                englishLevel: 'Intermediate',
                salary: 2000
            });
        });
    });

    describe('GET /users/:id', () => {
        it('should get employee by invalid id', async () => {
            const idInvalidEmployeeToGet = 2000;

            const start = performance.now();
            const result = await request(app)
                .get(`/users/${idInvalidEmployeeToGet}`)
                .set('Authorization', `Bearer ${adminToken}`);
            const end = performance.now();
    
            expect(end - start).to.be.lessThan(200);
            expect(result.status).to.equal(404);
            expect(result.headers['content-type']).to.include('application/json');
            expect(result.body).to.deep.include({
                message: 'Пользователь не найден'
            });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete employee by id', async () => {
            const start = performance.now();
            const result = await request(app)
                .delete(`/users/${idEmployeeToDelete}`)
                .set('Authorization', `Bearer ${adminToken}`);
            const end = performance.now();
    
            expect(end - start).to.be.lessThan(200);
            expect(result.status).to.equal(200);
            expect(result.headers['content-type']).to.include('application/json');
            expect(result.body).to.deep.include({
                message: 'Сотрудник успешно удален'
            });
        });
    });
})
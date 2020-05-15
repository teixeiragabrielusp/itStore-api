const app = require('../src/app');
const supertest = require('supertest');

beforeAll(() => {
    process.env.NODE_ENV = 'test';
});

const equipmentOneId = 1;
const equipmentOne = {
    id: equipmentOneId,
    model: 'Epson WorkForce',
    category: 'cartridge',
    ppm: 421,
    wifi: 1,
    consumption: 1620.04
}

test('Should create a new equipment', async () => {
    const response = await supertest(app)
        .post('/equipments')
        .send({
            model: 'Epson WorkForce',
            category: 'cartridge',
            ppm: 421,
            wifi: true,
            consumption: 1620.04
        })
        .expect(201);

    //Assertations about the response
    expect(response.body).toMatchObject(
        {
            model: 'Epson WorkForce',
            category: 'cartridge',
            ppm: 421,
            wifi: true,
            consumption: 1620.04
        }
    );
});

test('Should get an equipment', async () => {
    const res = await supertest(app)
        .get(`/equipment/${equipmentOneId}`)
        .send()
        .expect(200);

    const response = equipmentOne;
    expect(res.body).toEqual(response);
});

test('Should update an equipment', async () => {
    const res = await supertest(app)
        .patch(`/equipment/${equipmentOneId}`)
        .send({
            model: 'XEROX OfficeEconomic'
        })
        .expect(200);

    expect(res.body.changes.model).toEqual('XEROX OfficeEconomic');
});

test('Should delete an equipment', async () => {
    const res = await supertest(app)
        .delete(`/equipment/${equipmentOneId}`)
        .send()
        .expect(200);

    const response = {};
    expect(res.body).toEqual(response);
});

test('Should return a validation error', async () => {
    const response = await supertest(app)
        .post('/equipments')
        .send({
            category: 'toner',
            ppm: 300,
            wifi: false,
            consumption: 555.42
        })
        .expect(400);

    // //Assertations about the response
    expect(response.body.details[0].message).toMatch(
        "\"model\" is required"
    );
});
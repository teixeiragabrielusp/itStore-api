const express = require('express');
const Equipment = require('../models/equipments');
const db = require('../../src/db/database');
const router = new express.Router();

//CREATE EQUIPMENT
router.post('/equipments', async (req, res) => {
    const equipment = req.body;
    const validation = await Equipment.validate(equipment);

    let sql = 'INSERT INTO equipments(model, category, ppm, wifi, consumption) VALUES (?,?,?,?,?)';
    let params = [equipment.model, equipment.category, equipment.ppm, equipment.wifi, equipment.consumption];

    db.run(sql, params, async (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }
        else if (!validation.error) {
            return await res.status(201).send(equipment);
        }
        await res.status(400).send(validation.error);

    });
});

//GET EQUIPMENTS
router.get('/equipments', async (req, res) => {
    let sql = 'select * from equipments';
    let params = [];

    db.all(sql, params, async (err, rows) => {
        if (err) {
            return res.status(400).send(err);
        }

        return await res.status(200).send(rows);

    });
});

//GET EQUIPMENT
router.get('/equipment/:id', async (req, res) => {
    let sql = 'select * from equipments where id = ?';
    let params = [req.params.id];

    db.get(sql, params, async (err, row) => {
        if (err) {
            return res.status(400).send(err);
        }
        else if (!row) {
            return res.status(404).send(`Equipment ${params} not found`);
        }

        return await res.status(200).send(row);
    });
});

//UPDATE EQUIPMENT
router.patch('/equipment/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['model', 'category', 'ppm', 'wifi', 'consumption'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    let equipment = req.body;
    let sql = `UPDATE equipments set 
        model = COALESCE(?,model), 
        category = COALESCE(?,category), 
        ppm = COALESCE(?,ppm),
        wifi = COALESCE(?,wifi), 
        consumption = COALESCE(?,consumption)
        WHERE id = ?`;
    let params = [equipment.model, equipment.category, equipment.ppm, equipment.wifi, equipment.consumption, req.params.id];

    db.get('select * from equipments where id = ?', req.params.id, async (err, row) => {
        if (err) {
            return res.status(400).send(err);
        }
        else if (!row) {
            return res.status(404).send(`Equipment ${req.params.id} not found`);
        }

        db.run(sql, params, async (err, result) => {
            if (err) {
                return res.status(400).send(err);
            }
    
            return await res.status(200).send({ changes: equipment });
        });
    });
});

//DELETE EQUIPMENT
router.delete('/equipment/:id', async (req, res) => {

    let sql = 'DELETE FROM equipments WHERE id = ?';
    let params = [req.params.id];

    db.get('select * from equipments where id = ?', req.params.id, async (err, row) => {
        if (err) {
            return res.status(400).send(err);
        }
        else if (!row) {
            return res.status(404).send(`Equipment ${req.params.id} not found`);
        }

        db.run(sql, params, async (err, result) => {
            if (err) {
                return res.status(400).send(err);
            }
    
            return await res.status(200).send(`Equipment ${params} deleted!`);
        });
    });
});

//DELETE ALL EQUIPMENTS
router.delete('/equipments', async (req, res) => {
    
    let sql = 'DELETE FROM equipments';
    let params = [];

    db.run(sql, params, async (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }

        return await res.status(200).send(`All equipments deleted!`);
    });
});

module.exports = router;
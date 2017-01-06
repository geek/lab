'use strict';

// Load modules

const Http = require('http');
const Coverage = require('./coverage');


// Declare internals

const internals = {};


internals.main = function () {

    process[Symbol.for('lab')] = process[Symbol.for('lab')] || {};

    let finished = false;
    process[Symbol.for('lab')].cov = function (callback) {

        const finish = function () {

            if (finished) {
                return;
            }

            finished = true;
            callback && callback();
        };

        if (!global.__$$labCov) {
            return finish();
        }

        let stringified = JSON.stringify(global.__$$labCov);
        if (process.env.ROOT_SPAWN) {
            stringified = stringified.replace(/\/test_runner\//g, '/lib/');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(stringified)
        };

        const req = Http.request({ host: '127.0.0.1', port: 42424, method: 'POST', headers }, (res) => {

            res.on('data', () => {});

            res.once('end', () => finish());
        });

        req.once('error', (err) => {

            console.error(err);
            finish();
        });

        req.write(stringified);
        req.end();
    };

    internals.setupCoverage();
};


internals.setupCoverage = function () {

    const req = Http.request({ host: '127.0.0.1', port: 42424, method: 'GET', path: '/settings' }, (res) => {

        let result = '';
        res.on('data', (data) => {

            result += data.toString();
        });

        res.on('error', (err) => {

            console.error(err);
        });

        res.once('end', () => {

            let settings = {};
            try {
                settings = JSON.parse(result);
            }
            catch (e) {
                console.error(e);
            }

            Coverage.instrument(settings);
        });
    });

    req.on('error', (err) => {

        console.error(err);
    });

    req.end();
};


internals.main();

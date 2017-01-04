'use strict';

// Load modules

const Http = require('http');
const Coverage = require('./coverage');


// Declare internals

const internals = {};


internals.main = function () {

    const settings = {
        coveragePath: process.cwd(),
        coverageExclude: ['/bin/lab', '/bin/_lab', 'test_runner', 'test', 'node_modules']
    };

    Coverage.instrument(settings);

    process.on('exit', () => {

        const req = Http.request({ host: '127.0.0.1', port: 42424, method: 'POST' });

        req.on('error', (err) => {

            console.error(err);
        });

        req.write(JSON.stringify(global.__$$labCov || {}));
        req.end();
    });
};
internals.main();

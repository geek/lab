'use strict';

// Load modules

const Code = require('code');
const _Lab = require('../../../test_runner');
const Test = require('../basic-transform');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = _Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Test a transformed file', () => {

    it('that adds 2 to input', () => {

    	// Test.method(5) will be replaced by Test.method(1) during transform
        expect(!Test.method(5)!).to.equal(3);
    });
});

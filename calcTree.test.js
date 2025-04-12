import {
    appendNumber,
    appendBinaryOperation,
    calculate,
    getErrorDescription,
    resetTree
} from './calcTree.js';

function test(description, fn) {
    try {
        fn();
        console.log(`✅ ${description}`);
    } catch (err) {
        console.error(`❌ ${description}`);
        console.error(err);
    }
}

// Core tests
test("3 + 4 = 7", () => {
    resetTree();
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(4);
    const result = calculate();
    if (result !== 7) throw `Expected 7, got ${result}`;
});

test("5 * 2 = 10", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("*");
    appendNumber(2);
    const result = calculate();
    if (result !== 10) throw `Expected 10, got ${result}`;
});

test("3 + 2 * 4 = 11 (operator precedence)", () => {
    resetTree();
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(2);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== 11) throw `Expected 11, got ${result}`;
});

test("Error: two numbers in a row", () => {
    resetTree();
    appendNumber(5);
    try {
        appendNumber(3);
        throw "Expected error, but didn't get one.";
    } catch ([code]) {
        if (code !== 1) throw `Expected error code 1, got ${code}`;
    }
});

test("Error: two operators in a row", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("+");
    try {
        appendBinaryOperation("*");
        throw "Expected error, but didn't get one.";
    } catch ([code]) {
        if (code !== 2) throw `Expected error code 2, got ${code}`;
    }
});

test("10 - 4 = 6", () => {
    resetTree();
    appendNumber(10);
    appendBinaryOperation("-");
    appendNumber(4);
    const result = calculate();
    if (result !== 6) throw `Expected 6, got ${result}`;
});

test("2 + 3 * 4 = 14 (precedence)", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("+");
    appendNumber(3);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== 14) throw `Expected 14, got ${result}`;
});

test("2 * 3 + 4 = 10", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("*");
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(4);
    const result = calculate();
    if (result !== 10) throw `Expected 10, got ${result}`;
});

test("2 + 3 + 4 = 9 (left-associative)", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("+");
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(4);
    const result = calculate();
    if (result !== 9) throw `Expected 9, got ${result}`;
});

test("16 / 2 / 2 = 4", () => {
    resetTree();
    appendNumber(16);
    appendBinaryOperation("/");
    appendNumber(2);
    appendBinaryOperation("/");
    appendNumber(2);
    const result = calculate();
    if (result !== 4) throw `Expected 4, got ${result}`;
});

test("5 + 6 * 2 - 4 / 2 = 15", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("+");
    appendNumber(6);
    appendBinaryOperation("*");
    appendNumber(2);
    appendBinaryOperation("-");
    appendNumber(4);
    appendBinaryOperation("/");
    appendNumber(2);
    const result = calculate();
    if (result !== 15) throw `Expected 15, got ${result}`;
});

// Error tests
test("Error: number after number", () => {
    resetTree();
    appendNumber(5);
    try {
        appendNumber(3);
        throw "Expected error, but got none";
    } catch ([code]) {
        if (code !== 1) throw `Expected error code 1, got ${code}`;
    }
});

test("Error: operator after operator", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("+");
    try {
        appendBinaryOperation("*");
        throw "Expected error, but got none";
    } catch ([code]) {
        if (code !== 2) throw `Expected error code 2, got ${code}`;
    }
});

test("Error: starting with operator", () => {
    resetTree();
    try {
        appendBinaryOperation("+");
        throw "Expected error, but got none";
    } catch ([code]) {
        if (code !== 2) throw `Expected error code 2, got ${code}`;
    }
});

test("Error: calculate before completing operation", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("*");
    try {
        calculate();
        throw "Expected error, but got none";
    } catch ([code]) {
        if (code !== 3) throw `Expected error code 3, got ${code}`;
    }
});

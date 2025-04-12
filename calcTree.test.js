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

test("33 - 21 = 12", () => {
    resetTree();
    appendNumber(33);
    appendBinaryOperation("-");
    appendNumber(21);
    const result = calculate();
    if (result !== 12) throw `Expected 12, got ${result}`;
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

test("Error: two operators in a row", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("+");
    try {
        appendBinaryOperation("*");
        throw "Expected error, but didn't get one.";
    } catch (err) {
        if (!(err instanceof Error)) throw `Unexpected error: ${err}`;
        if (err.code !== 2) throw `Expected error code 2, got ${err.code}`;
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
test("Error: operator after operator", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("+");
    try {
        appendBinaryOperation("*");
        throw "Expected error, but got none";
    } catch (err) {
        if (!(err instanceof Error)) throw `Unexpected error: ${err}`;
        if (err.code !== 2) throw `Expected error code 2, got ${err.code}`;
    }
});

test("Error: starting with operator", () => {
    resetTree();
    try {
        appendBinaryOperation("+");
        throw "Expected error, but got none";
    } catch (err) {
        if (!(err instanceof Error)) throw `Unexpected error: ${err}`;
        if (err.code !== 2) throw `Expected error code 2, got ${err.code}`;
    }
});

test("Error: calculate before completing operation", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("*");
    try {
        calculate();
        throw "Expected error, but got none";
    } catch (err) {
        if (!(err instanceof Error)) throw `Unexpected error: ${err}`;
        if (err.code !== 3) throw `Expected error code 3, got ${err.code}`;
    }
});

test("Error: division by zero", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("/");
    appendNumber(0);
    try {
        calculate();
        throw "Expected error, but got none";
    } catch (err) {
        if (!(err instanceof Error)) throw `Unexpected error: ${err}`;
        if (err.code !== 4) throw `Expected code 4, got ${err.code}`;
    }
});

test("12 + 34 = 46", () => {
    resetTree();
    appendNumber(12);
    appendBinaryOperation("+");
    appendNumber(34);
    const result = calculate();
    if (result !== 46) throw `Expected 46, got ${result}`;
});

test("1000 - 999 = 1", () => {
    resetTree();
    appendNumber(1000);
    appendBinaryOperation("-");
    appendNumber(999);
    const result = calculate();
    if (result !== 1) throw `Expected 1, got ${result}`;
});

test("25 * 4 = 100", () => {
    resetTree();
    appendNumber(25);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== 100) throw `Expected 100, got ${result}`;
});

test("500 / 25 = 20", () => {
    resetTree();
    appendNumber(500);
    appendBinaryOperation("/");
    appendNumber(25);
    const result = calculate();
    if (result !== 20) throw `Expected 20, got ${result}`;
});

test("100 + 20 * 3 = 160", () => {
    resetTree();
    appendNumber(100);
    appendBinaryOperation("+");
    appendNumber(20);
    appendBinaryOperation("*");
    appendNumber(3);
    const result = calculate();
    if (result !== 160) throw `Expected 160, got ${result}`;
});

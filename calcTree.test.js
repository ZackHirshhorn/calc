import {
    appendNumber,
    appendBinaryOperation,
    calculate,
    getErrorDescription,
    resetTree,
    appendUnaryOperator,
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
test("1. 3 + 4 = 7", () => {
    resetTree();
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(4);
    const result = calculate();
    if (result !== 7) throw `Expected 7, got ${result}`;
});

test("2. 33 - 21 = 12", () => {
    resetTree();
    appendNumber(33);
    appendBinaryOperation("-");
    appendNumber(21);
    const result = calculate();
    if (result !== 12) throw `Expected 12, got ${result}`;
});

test("3. 5 * 2 = 10", () => {
    resetTree();
    appendNumber(5);
    appendBinaryOperation("*");
    appendNumber(2);
    const result = calculate();
    if (result !== 10) throw `Expected 10, got ${result}`;
});

test("4. 3 + 2 * 4 = 11 (operator precedence)", () => {
    resetTree();
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(2);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== 11) throw `Expected 11, got ${result}`;
});

test("5. Error: two operators in a row", () => {
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

test("6. 10 - 4 = 6", () => {
    resetTree();
    appendNumber(10);
    appendBinaryOperation("-");
    appendNumber(4);
    const result = calculate();
    if (result !== 6) throw `Expected 6, got ${result}`;
});

test("7. 2 + 3 * 4 = 14 (precedence)", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("+");
    appendNumber(3);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== 14) throw `Expected 14, got ${result}`;
});

test("8. 2 * 3 + 4 = 10", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("*");
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(4);
    const result = calculate();
    if (result !== 10) throw `Expected 10, got ${result}`;
});

test("9. 2 + 3 + 4 = 9 (left-associative)", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("+");
    appendNumber(3);
    appendBinaryOperation("+");
    appendNumber(4);
    const result = calculate();
    if (result !== 9) throw `Expected 9, got ${result}`;
});

test("10. 16 / 2 / 2 = 4", () => {
    resetTree();
    appendNumber(16);
    appendBinaryOperation("/");
    appendNumber(2);
    appendBinaryOperation("/");
    appendNumber(2);
    const result = calculate();
    if (result !== 4) throw `Expected 4, got ${result}`;
});

test("11. 5 + 6 * 2 - 4 / 2 = 15", () => {
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
test("12. Error: operator after operator", () => {
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

test("13. Error: starting with operator", () => {
    resetTree();
    try {
        appendBinaryOperation("+");
        throw "Expected error, but got none";
    } catch (err) {
        if (!(err instanceof Error)) throw `Unexpected error: ${err}`;
        if (err.code !== 2) throw `Expected error code 2, got ${err.code}`;
    }
});

test("14. Error: calculate before completing operation", () => {
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

test("15. Error: division by zero", () => {
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

test("16. 12 + 34 = 46", () => {
    resetTree();
    appendNumber(12);
    appendBinaryOperation("+");
    appendNumber(34);
    const result = calculate();
    if (result !== 46) throw `Expected 46, got ${result}`;
});

test("17. 1000 - 999 = 1", () => {
    resetTree();
    appendNumber(1000);
    appendBinaryOperation("-");
    appendNumber(999);
    const result = calculate();
    if (result !== 1) throw `Expected 1, got ${result}`;
});

test("18. 25 * 4 = 100", () => {
    resetTree();
    appendNumber(25);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== 100) throw `Expected 100, got ${result}`;
});

test("19. 500 / 25 = 20", () => {
    resetTree();
    appendNumber(500);
    appendBinaryOperation("/");
    appendNumber(25);
    const result = calculate();
    if (result !== 20) throw `Expected 20, got ${result}`;
});

test("20. 100 + 20 * 3 = 160", () => {
    resetTree();
    appendNumber(100);
    appendBinaryOperation("+");
    appendNumber(20);
    appendBinaryOperation("*");
    appendNumber(3);
    const result = calculate();
    if (result !== 160) throw `Expected 160, got ${result}`;
});

test("21. Negative number: -5 + 10 = 5", () => {
    resetTree();
    appendUnaryOperator("-");
    appendNumber(5);
    appendBinaryOperation("+");
    appendNumber(10);
    const result = calculate();
    if (result !== 5) throw `Expected 5, got ${result}`;
});

test("22. Negative number as second operand: 10 + (-4) = 6", () => {
    resetTree();
    appendNumber(10);
    appendBinaryOperation("+");
    appendUnaryOperator("-");
    appendNumber(4);
    const result = calculate();
    if (result !== 6) throw `Expected 6, got ${result}`;
});

test("23. Negative number with multiplication: -3 * 4 = -12", () => {
    resetTree();
    appendUnaryOperator("-");
    appendNumber(3);
    appendBinaryOperation("*");
    appendNumber(4);
    const result = calculate();
    if (result !== -12) throw `Expected -12, got ${result}`;
});

test("24. Negative numbers on both sides: -3 * -3 = 9", () => {
    resetTree();
    appendUnaryOperator("-");
    appendNumber(3);
    appendBinaryOperation("*");
    appendUnaryOperator("-");
    appendNumber(3);
    const result = calculate();
    if (result !== 9) throw `Expected 9, got ${result}`;
});

test("25. -5 + 2 * 3 = 1", () => {
    resetTree();
    appendUnaryOperator("-");
    appendNumber(5);
    appendBinaryOperation("+");
    appendNumber(2);
    appendBinaryOperation("*");
    appendNumber(3);
    const result = calculate();
    if (result !== 1) throw `Expected 1, got ${result}`;
});

test("26. Error: unary minus after number (invalid position)", () => {
    resetTree();
    appendNumber(5);
    try {
        appendUnaryOperator("-");
        throw "Expected error, but got none";
    } catch (err) {
        if (err.code !== 2) throw `Expected error code 2, got ${err.code}`;
    }
});

test("27. √9 = 3", () => {
    resetTree();
    appendUnaryOperator("√");
    appendNumber(9);
    const result = calculate();
    if (result !== 3) throw `Expected 3, got ${result}`;
});

test("28. -√9 = -3", () => {
    resetTree();
    appendUnaryOperator("-");
    appendUnaryOperator("√");
    appendNumber(9);
    const result = calculate();
    if (result !== -3) throw `Expected -3, got ${result}`;
});

test("29. √-9 throws error", () => {
    resetTree();
    appendUnaryOperator("√");
    appendUnaryOperator("-");
    try {
        appendNumber(9);
        calculate();
        throw "Expected error, but got none";
    } catch (err) {
        if (err.code !== 5) throw `Expected error code 5, got ${err.code}`;
    }
});

test("30. Unknown unary operator throws error", () => {
    resetTree();
    try {
        appendUnaryOperator("!");
        throw "Expected error, but got none";
    } catch (err) {
        if (err.code !== 6) throw `Expected error code 6, got ${err.code}`;
    }
});

test("31. -(-5) = 5", () => {
    resetTree();
    appendUnaryOperator("-");
    appendUnaryOperator("-");
    appendNumber(5);
    const result = calculate();
    if (result !== 5) throw `Expected 5, got ${result}`;
});

test("32. -(-(-4)) = -4", () => {
    resetTree();
    appendUnaryOperator("-");
    appendUnaryOperator("-");
    appendUnaryOperator("-");
    appendNumber(4);
    const result = calculate();
    if (result !== -4) throw `Expected -4, got ${result}`;
});

test("33. -(-(-(-8))) = 8", () => {
    resetTree();
    appendUnaryOperator("-");
    appendUnaryOperator("-");
    appendUnaryOperator("-");
    appendUnaryOperator("-");
    appendNumber(8);
    const result = calculate();
    if (result !== 8) throw `Expected 8, got ${result}`;
});

test("34. √√16 = 2", () => {
    resetTree();
    appendUnaryOperator("√");
    appendUnaryOperator("√");
    appendNumber(16);
    const result = calculate();
    if (result !== 2) throw `Expected 2, got ${result}`;
});

test("35. √√√256 = 2", () => {
    resetTree();
    appendUnaryOperator("√");
    appendUnaryOperator("√");
    appendUnaryOperator("√");
    appendNumber(256);
    const result = calculate();
    if (result !== 2) throw `Expected 2, got ${result}`;
});

test("36. √√81 = 3", () => {
    resetTree();
    appendUnaryOperator("√");
    appendUnaryOperator("√");
    appendNumber(81);
    const result = calculate();
    if (result !== 3) throw `Expected 3, got ${result}`;
});

test("37. √√-81 throws error", () => {
    resetTree();
    appendUnaryOperator("√");
    appendUnaryOperator("√");
    appendUnaryOperator("-");
    try {
        appendNumber(81);
        calculate();
        throw "Expected error, but got none";
    } catch (err) {
        if (err.code !== 5) throw `Expected error code 5, got ${err.code}`;
    }
});

test("38. Error: cannot use unary operator after entering a number", () => {
    resetTree();
    appendNumber(5); // User has now entered a number
    try {
        appendUnaryOperator("-"); // ❌ should not be allowed
        throw "Expected error, but got none";
    } catch (err) {
        if (err.code !== 2) throw `Expected error code 2, got ${err.code}`;
    }
});

test("39. 2 * √16 + 3 = 11", () => {
    resetTree();
    appendNumber(2);
    appendBinaryOperation("*");
    appendUnaryOperator("√");
    appendNumber(16);
    appendBinaryOperation("+");
    appendNumber(3);
    const result = calculate();
    if (result !== 11) throw `Expected 11, got ${result}`;
});

test("40. -√9 * 2 = -6", () => {
    resetTree();
    appendUnaryOperator("-");
    appendUnaryOperator("√");
    appendNumber(9);
    appendBinaryOperation("*");
    appendNumber(2);
    const result = calculate();
    if (result !== -6) throw `Expected -6, got ${result}`;
});

test("41. √0 = 0", () => {
    resetTree();
    appendUnaryOperator("√");
    appendNumber(0);
    const result = calculate();
    if (result !== 0) throw `Expected 0, got ${result}`;
});

test("42. -0 = 0", () => {
    resetTree();
    appendUnaryOperator("-");
    appendNumber(0);
    const result = calculate();
    if (result !== 0) throw `Expected 0, got ${result}`;
});

test("43. 5.5 + 1.2 = 6.7", () => {
    resetTree();
    appendNumber(5.5);
    appendBinaryOperation("+");
    appendNumber(1.2);
    const result = calculate();
    if (Math.abs(result - 6.7) > 1e-10) throw `Expected 6.7, got ${result}`;
});

test("44. √2 ≈ 1.41421356", () => {
    resetTree();
    appendUnaryOperator("√");
    appendNumber(2);
    const result = calculate();
    if (Math.abs(result - 1.41421356) > 1e-7) throw `Expected approx 1.41421356, got ${result}`;
});

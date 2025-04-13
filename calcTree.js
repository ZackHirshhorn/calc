import makeError from "./calcError.js";

let innerTree = null;

let pendingUnaryOps = []; // stack of strings like ["-", "√"]

let expectingOperand = true;

/*
 * A future update may add unary operations, which should be added in a separate object/map,
 * since the logic for them in 'appendNumber' and 'appendOperator' should also be different.
 * I.E. there should be a separate else-if clause for binary ops and another separate clause
 * for unary ops.
 */
let binaryOperations = {
    "+": (op1, op2) => op1 + op2,
    "-": (op1, op2) => op1 - op2,
    "*": (op1, op2) => op1 * op2,
    "/": (op1, op2) => {
        if (op2 === 0) throw makeError(4, "Division by zero");
        return op1 / op2;
    },
};

let unaryOperations = {
    "-": x => -x,
    "√": x => {
        if (x < 0) throw makeError(5, "square root of negative number");
        return Math.sqrt(x);
    },
    // Add more ops here if needed
};

let orderOfOperations = {
    "*": 1, "/": 1, "+": 2, "-": 2,
};

function doesOp1Precede(op1, op2) {
    return orderOfOperations[op1] <= orderOfOperations[op2];
}

let errorCodes = {
    1: "expecting an operation, not a number",
    2: "expecting an operand (a number), not an operation",
    3: "expecting a second operand, can't perform calculation",
    4: "division by zero is not allowed",
    5: "cannot take square root of a negative number",
    6: "unknown unary operator",
};

function makeBinaryCalculate(tree) {
    return () => {
        let left = tree["left"].calculate();
        let right = tree["right"].calculate()
        
        return binaryOperations[tree.val](left, right);
    }
}

function appendRightRecursively(node, num) {
    if (node === null) {
        node = {val: num, calculate: () => num};
        return true;
    }

    else if (!("left" in node)) {
        // It's a leaf, need a "left" before appending a "right"
        return false;
    }

    else if (("left" in node) && !("right" in node)) {
        // This node has a "left" and is missing only a "right" - right place to append.
        node["right"] = {val: num, calculate: () => num};
        node["calculate"] = makeBinaryCalculate(node);
        return true;
    }

    else if ("right" in node) {
        return appendRightRecursively(node["left"], num) ||
                appendRightRecursively(node["right"], num);
    }
}

export function appendNumber(num) {
    num = Number(num);

    for (let i = pendingUnaryOps.length - 1; i >= 0; i--) {
        num = unaryOperations[pendingUnaryOps[i]](num);
    }
    pendingUnaryOps = [];

    if (innerTree === null) {
        innerTree = {val: num, calculate: () => num};
    } else {
        appendRightRecursively(innerTree, num);
    }

    expectingOperand = false;
}

export function appendBinaryOperation(op) {
    if (innerTree === null || (innerTree.val in binaryOperations && !("right" in innerTree))) {
        throw makeError(2, op);
    } else if (innerTree.val in binaryOperations && "right" in innerTree) {
        if (doesOp1Precede(innerTree.val, String(op))) {
            innerTree = {left: innerTree, val: String(op),
                         calculate: function() {throw makeError(3, op)}};
        } else {
            innerTree["right"] = {left: innerTree["right"], val: String(op),
                                  calculate: function() {throw makeError(3, op)}};
        }
    } else {
        innerTree = {left: innerTree, val: String(op),
                     calculate: function() {throw makeError(3, op)}};
    }

    expectingOperand = true;
}

export function appendUnaryOperator(op) {
    if (!(op in unaryOperations)) {
        throw makeError(6, `Unknown unary operator: ${op}`);
    }

    // Only allow unary ops at valid positions
    if (!expectingOperand) {
        throw makeError(2, op);
    }

    pendingUnaryOps.push(op);
}

export function calculate() {
    // console.log("tree state:", JSON.stringify(innerTree));
    return innerTree.calculate();
}

export function getErrorDescription(errorCode) {
    return errorCodes[errorCode];
}

export function resetTree() {
    innerTree = null;
    pendingUnaryOps = [];
    expectingOperand = true;
}

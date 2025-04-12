export default function makeError(code, data) {
    let e = new Error(`Error code: ${code}, ${data}`);
    e.code = code;
    e.data = data;
    return e;
}
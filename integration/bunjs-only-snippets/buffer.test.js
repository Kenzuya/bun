import { describe, it, expect } from "bun:test";

it("buffer", () => {
  var buf = new Buffer(20);
  // if this fails or infinitely loops, it means there is a memory issue with the JSC::Structure object
  expect(Object.keys(buf).length > 0).toBe(true);

  expect(buf.write("hello world ")).toBe(12);
  expect(buf.toString("utf8", 0, "hello world ".length)).toBe("hello world ");
  expect(buf.toString("base64url", 0, "hello world ".length)).toBe(
    btoa("hello world ")
  );

  expect(buf instanceof Uint8Array).toBe(true);
  expect(buf instanceof Buffer).toBe(true);
  expect(buf.slice() instanceof Uint8Array).toBe(true);
  expect(buf.slice(0, 1) instanceof Buffer).toBe(true);
  expect(buf.slice(0, 1) instanceof Uint8Array).toBe(true);
  expect(buf.slice(0, 1) instanceof Buffer).toBe(true);
});

it("Buffer", () => {
  var inputs = [
    "hello world",
    "hello world".repeat(100),
    `😋 Get Emoji — All Emojis to ✂️ Copy and 📋 Paste 👌`,
  ];
  var good = inputs.map((a) => new TextEncoder().encode(a));
  for (let i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    expect(new Buffer(input).toString("utf8")).toBe(inputs[i]);
    expect(Array.from(new Buffer(input)).join(",")).toBe(good[i].join(","));
  }
});

it("Buffer.toBuffer throws", () => {
  const checks = [
    [],
    {},
    "foo",
    new Uint16Array(),
    new DataView(new Uint8Array(14).buffer),
  ];
  for (let i = 0; i < checks.length; i++) {
    try {
      Buffer.toBuffer(checks[i]);
      expect(false).toBe(true);
    } catch (exception) {
      expect(exception.message).toBe("Expected Uint8Array");
    }
  }
  expect(true).toBe(true);
});

it("Buffer.toBuffer works", () => {
  var array = new Uint8Array(20);
  expect(array instanceof Buffer).toBe(false);
  var buf = Buffer.toBuffer(array);
  expect(array instanceof Buffer).toBe(true);
  // if this fails or infinitely loops, it means there is a memory issue with the JSC::Structure object
  expect(Object.keys(buf).length > 0).toBe(true);

  expect(buf.write("hello world ")).toBe(12);
  expect(buf.toString("utf8", 0, "hello world ".length)).toBe("hello world ");
  expect(buf.toString("base64url", 0, "hello world ".length)).toBe(
    btoa("hello world ")
  );

  expect(buf instanceof Uint8Array).toBe(true);
  expect(buf instanceof Buffer).toBe(true);
  expect(buf.slice() instanceof Uint8Array).toBe(true);
  expect(buf.slice(0, 1) instanceof Buffer).toBe(true);
  expect(buf.slice(0, 1) instanceof Uint8Array).toBe(true);
  expect(buf.slice(0, 1) instanceof Buffer).toBe(true);
  expect(new Buffer(buf) instanceof Buffer).toBe(true);
  expect(new Buffer(buf.buffer) instanceof Buffer).toBe(true);
});

it("writeInt", () => {
  var buf = new Buffer(1024);
  var data = new DataView(buf.buffer);
  buf.writeInt32BE(100);
  expect(data.getInt32(0, false)).toBe(100);
  buf.writeInt32BE(100);
  expect(data.getInt32(0, false)).toBe(100);
  var childBuf = buf.subarray(0, 4);
  expect(data.getInt32(0, false)).toBe(100);
  expect(childBuf.readInt32BE(0, false)).toBe(100);
});

it("read", () => {
  var buf = new Buffer(1024);
  var data = new DataView(buf.buffer);
  function reset() {
    new Uint8Array(buf.buffer).fill(0);
  }
  data.setBigInt64(0, BigInt(1000), false);
  expect(buf.readBigInt64BE(0)).toBe(BigInt(1000));
  reset();

  data.setBigInt64(0, BigInt(1000), false);
  expect(buf.readBigInt64LE(0)).toBe(BigInt(1000));
  reset();

  data.setBigUint64(0, BigInt(1000), false);
  expect(buf.readBigUInt64BE(0)).toBe(BigInt(1000));
  reset();

  data.setBigUint64(0, BigInt(1000), false);
  expect(buf.readBigUInt64LE(0)).toBe(BigInt(1000));
  reset();

  data.setFloat64(0, 1000, false);
  expect(buf.readDoubleBE(0)).toBe(1000);
  reset();

  data.setFloat64(0, 1000, true);
  expect(buf.readDoubleLE(0)).toBe(1000);
  reset();

  data.setFloat32(0, 1000, false);
  expect(buf.readFloatBE(0)).toBe(1000);
  reset();

  data.setFloat32(0, 1000, true);
  expect(buf.readFloatLE(0)).toBe(1000);
  reset();

  data.setInt16(0, 1000, false);
  expect(buf.readInt16BE(0)).toBe(1000);
  reset();

  data.setInt16(0, 1000, true);
  expect(buf.readInt16LE(0)).toBe(1000);
  reset();

  data.setInt32(0, 1000, false);
  expect(buf.readInt32BE(0)).toBe(1000);
  reset();

  data.setInt32(0, 1000, true);
  expect(buf.readInt32LE(0)).toBe(1000);
  reset();

  data.setInt8(0, 100, false);
  expect(buf.readInt8(0)).toBe(100);
  reset();

  data.setUint16(0, 1000, false);
  expect(buf.readUInt16BE(0)).toBe(1000);
  reset();

  data.setUint16(0, 1000, true);
  expect(buf.readUInt16LE(0)).toBe(1000);
  reset();

  data.setUint32(0, 1000, false);
  expect(buf.readUInt32BE(0)).toBe(1000);
  reset();

  data.setUint32(0, 1000, true);
  expect(buf.readUInt32LE(0)).toBe(1000);
  reset();

  data.setUint8(0, 255, false);
  expect(buf.readUInt8(0)).toBe(255);
  reset();

  data.setUint8(0, 255, false);
  expect(buf.readUInt8(0)).toBe(255);
  reset();
});
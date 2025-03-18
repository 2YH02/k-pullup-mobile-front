export const gid = (() => {
  const lut: string[] = [];
  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? "0" : "") + i.toString(16);
  }

  return function generate() {
    const now = performance.now() * 1000;
    const r = new Uint32Array(4);
    crypto.getRandomValues(r);

    return (
      lut[(now >> 24) & 0xff] +
      lut[(now >> 16) & 0xff] +
      lut[(now >> 8) & 0xff] +
      lut[now & 0xff] +
      "-" +
      lut[r[0] & 0xff] +
      lut[(r[0] >> 8) & 0xff] +
      "-" +
      lut[(r[1] & 0x0f) | 0x40] +
      lut[(r[1] >> 8) & 0xff] +
      "-" +
      lut[(r[2] & 0x3f) | 0x80] +
      lut[(r[2] >> 8) & 0xff] +
      "-" +
      lut[r[3] & 0xff] +
      lut[(r[3] >> 8) & 0xff] +
      lut[(r[3] >> 16) & 0xff] +
      lut[(r[3] >> 24) & 0xff]
    );
  };
})();

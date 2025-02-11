interface Matrix2D {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

interface Matrix3D {
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  tx: number;
  ty: number;
  tz: number;
  d: number;
}

export type TransformMatrix = Matrix2D | Matrix3D;

const parseMatrixTransform = (transform: string): TransformMatrix | null => {
  if (!transform || transform === "none") return null;

  const matrix2dMatch = transform.match(/^matrix\((.+)\)$/);

  if (matrix2dMatch) {
    const values = matrix2dMatch[1].split(", ").map(parseFloat);
    if (values.length === 6) {
      const [a, b, c, d, tx, ty] = values;
      return { a, b, c, d, tx, ty };
    }
  }

  const matrix3dMatch = transform.match(/^matrix3d\((.+)\)$/);
  if (matrix3dMatch) {
    const values = matrix3dMatch[1].split(", ").map(parseFloat);
    if (values.length === 16) {
      const [a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, tx, ty, tz, d] =
        values;
      return { a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, tx, ty, tz, d };
    }
  }

  return null;
};

export default parseMatrixTransform;

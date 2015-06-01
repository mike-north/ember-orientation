const degtorad = Math.PI / 180; // Degree-to-Radian conversion

export function transformationMatrix(alpha, beta, gamma) {

  const _x = beta  ? beta  * degtorad : 0; // beta value
  const _y = gamma ? gamma * degtorad : 0; // gamma value
  const _z = alpha ? alpha * degtorad : 0; // alpha value

  const cX = Math.cos(_x);
  const cY = Math.cos(_y);
  const cZ = Math.cos(_z);
  const sX = Math.sin(_x);
  const sY = Math.sin(_y);
  const sZ = Math.sin(_z);

  //
  // ZXY rotation matrix construction.
  //

  const m11 = cZ * cY - sZ * sX * sY;
  const m12 = -cX * sZ;
  const m13 = cY * sZ * sX + cZ * sY;

  const m21 = cY * sZ + cZ * sX * sY;
  const m22 = cZ * cX;
  const m23 = sZ * sY - cZ * cY * sX;

  const m31 = -cX * sY;
  const m32 = sX;
  const m33 = cX * cY;

  return [
    m11,    m12,    m13,
    m21,    m22,    m23,
    m31,    m32,    m33
  ];
}

export function transformVector(vector, alpha, beta, gamma) {
  const tm = transformationMatrix(alpha, beta, gamma);
  return [
    vector[0] * tm[0] + vector[1] * tm[3] + vector[2] * tm[6],
    vector[0] * tm[1] + vector[1] * tm[4] + vector[2] * tm[7],
    vector[0] * tm[2] + vector[1] * tm[5] + vector[2] * tm[8]
  ];
}


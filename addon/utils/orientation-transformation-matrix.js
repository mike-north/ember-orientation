let degtorad = Math.PI / 180; // Degree-to-Radian conversion

export function transformationMatrix(alpha, beta, gamma) {

  let _x = beta  ? beta  * degtorad : 0; // beta value
  let _y = gamma ? gamma * degtorad : 0; // gamma value
  let _z = alpha ? alpha * degtorad : 0; // alpha value

  let cX = Math.cos(_x);
  let cY = Math.cos(_y);
  let cZ = Math.cos(_z);
  let sX = Math.sin(_x);
  let sY = Math.sin(_y);
  let sZ = Math.sin(_z);

  //
  // ZXY rotation matrix letruction.
  //

  let m11 = cZ * cY - sZ * sX * sY;
  let m12 = -cX * sZ;
  let m13 = cY * sZ * sX + cZ * sY;

  let m21 = cY * sZ + cZ * sX * sY;
  let m22 = cZ * cX;
  let m23 = sZ * sY - cZ * cY * sX;

  let m31 = -cX * sY;
  let m32 = sX;
  let m33 = cX * cY;

  return [
    m11,    m12,    m13,
    m21,    m22,    m23,
    m31,    m32,    m33
  ];
}

export function transformVector(vector, alpha, beta, gamma) {
  let tm = transformationMatrix(alpha, beta, gamma);
  return [
    vector[0] * tm[0] + vector[1] * tm[3] + vector[2] * tm[6],
    vector[0] * tm[1] + vector[1] * tm[4] + vector[2] * tm[7],
    vector[0] * tm[2] + vector[1] * tm[5] + vector[2] * tm[8]
  ];
}


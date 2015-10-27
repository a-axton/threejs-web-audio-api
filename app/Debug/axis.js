import THREE from 'three';

export default function(length) {
  let axisLines = [
    { 
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(length, 0, 0), 
      ],
      material: new THREE.LineBasicMaterial({ 
        linewidth: 3, 
        color: 0xFF0000 
      }),
      type: THREE.LinePieces
    },
    { 
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-length, 0, 0),
      ],
      material: new THREE.LineDashedMaterial({ 
        linewidth: 3, 
        color: 0xFF0000, 
        dashSize: 7, 
        gapSize: 7 
      }),
      type: THREE.LinePieces
    },
    { 
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, length, 0), 
      ],
      material: new THREE.LineBasicMaterial({ 
        linewidth: 3, 
        color: 0x00FF00 
      }),
      type: THREE.LinePieces
    },
    { 
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -length, 0),
      ],
      material: new THREE.LineDashedMaterial({ 
        linewidth: 3, 
        color: 0x00FF00, 
        dashSize: 7, 
        gapSize: 7 
      }),
      type: THREE.LinePieces
    },
    { 
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, length), 
      ],
      material: new THREE.LineBasicMaterial({ 
        linewidth: 3, 
        color: 0x0000FF 
      }),
      type: THREE.LinePieces
    },
    { 
      vertices: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -length),
      ],
      material: new THREE.LineDashedMaterial({ 
        linewidth: 3, 
        color: 0x0000FF, 
        dashSize: 7, 
        gapSize: 7 
      }),
      type: THREE.LinePieces
    }
  ];

  let lines = axisLines.map((axi) => {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(axi.vertices[0]);
    geometry.vertices.push(axi.vertices[1]);
    geometry.computeLineDistances();
    return new THREE.Line(geometry, axi.material);
  });
  let axis = new THREE.Object3D;
  axis.children = lines;
  return axis;
}

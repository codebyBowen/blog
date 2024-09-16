import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SyntheticCoveredCall3DChart = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 600;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create chart axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create traditional strategy line
    const traditionalPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 2, 0),
    ];
    const traditionalGeometry = new THREE.BufferGeometry().setFromPoints(traditionalPoints);
    const traditionalMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const traditionalLine = new THREE.Line(traditionalGeometry, traditionalMaterial);
    scene.add(traditionalLine);

    // Create synthetic strategy line
    const syntheticPoints = [
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(5, 4, 0),
    ];
    const syntheticGeometry = new THREE.BufferGeometry().setFromPoints(syntheticPoints);
    const syntheticMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const syntheticLine = new THREE.Line(syntheticGeometry, syntheticMaterial);
    scene.add(syntheticLine);

    // Add text labels
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      
      const traditionalText = new THREE.Mesh(
        new THREE.TextGeometry('传统策略', { font: font, size: 0.3, height: 0.05 }),
        textMaterial
      );
      traditionalText.position.set(5.2, 2, 0);
      scene.add(traditionalText);

      const syntheticText = new THREE.Mesh(
        new THREE.TextGeometry('合成策略', { font: font, size: 0.3, height: 0.05 }),
        textMaterial
      );
      syntheticText.position.set(5.2, 4, 0);
      scene.add(syntheticText);
    });

    // Position camera
    camera.position.set(3, 3, 10);
    camera.lookAt(new THREE.Vector3(3, 3, 0));

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">3D合成覆盖式买权策略图表</h2>
      <div ref={mountRef}></div>
      <div className="mt-4 text-sm text-gray-600">
        <p>注意：这个3D图表展示了传统策略和合成策略的收益曲线。</p>
        <p>绿色线（斜率更陡）代表合成策略，蓝色线代表传统策略。</p>
        <p>您可以使用鼠标来旋转和缩放图表，以便从不同角度查看。</p>
      </div>
    </div>
  );
};

export default SyntheticCoveredCall3DChart;
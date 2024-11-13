import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';

const ThreeDModel = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);

  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Adjusted field of view

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Transparent background
    renderer.setSize(window.innerWidth, window.innerHeight); // Full window size
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Slightly dimmer ambient light
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 18); // Adjusted for balanced lighting
    scene.add(directionalLight);

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      new URL('../../../assets/login.glb', import.meta.url).href, // Use URL to resolve asset path
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(10, 10, 10);  // Adjusted size
        model.position.set(0, -7, 0);  // Center the model
        scene.add(model);

        // Setup animation mixer
        mixerRef.current = new AnimationMixer(model);

        // Add all animations from the loaded gltf to the mixer
        gltf.animations.forEach((clip) => {
          mixerRef.current.clipAction(clip).play();
        });
      },
      undefined,
      (error) => {
        console.error('An error happened loading the model:', error);
      }
    );

    // Adjust camera position and view
    camera.position.set(0, 0, 40); // Move the camera further away to accommodate the larger model
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the scene

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (mixerRef.current) {
        mixerRef.current.update(0.01); // Update animations
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight); // Full window size
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
};

export default ThreeDModel;

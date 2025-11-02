import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { useRef } from 'react';
import './SensorVisualization3D.css';

function Sensor3DModel({ temperature, humidity, motion }) {
  const tempBarRef = useRef();
  const humidityBarRef = useRef();
  
  // Normalize values for visualization
  const tempHeight = Math.min((temperature / 50) * 3, 3);
  const humidityHeight = Math.min((humidity / 100) * 3, 3);
  
  // Color based on temperature
  const tempColor = temperature > 30 ? '#ef4444' : temperature > 20 ? '#f59e0b' : '#3b82f6';
  const humidityColor = humidity > 70 ? '#3b82f6' : humidity > 40 ? '#10b981' : '#f59e0b';

  return (
    <>
      {/* Temperature Bar */}
      <group position={[-2, 0, 0]}>
        <mesh ref={tempBarRef} position={[0, tempHeight / 2, 0]}>
          <boxGeometry args={[0.8, tempHeight, 0.8]} />
          <meshStandardMaterial color={tempColor} />
        </mesh>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {temperature}°C
        </Text>
        <Text
          position={[0, -0.9, 0]}
          fontSize={0.2}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
        >
          Temperature
        </Text>
      </group>

      {/* Humidity Bar */}
      <group position={[0, 0, 0]}>
        <mesh ref={humidityBarRef} position={[0, humidityHeight / 2, 0]}>
          <boxGeometry args={[0.8, humidityHeight, 0.8]} />
          <meshStandardMaterial color={humidityColor} />
        </mesh>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {humidity}%
        </Text>
        <Text
          position={[0, -0.9, 0]}
          fontSize={0.2}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
        >
          Humidity
        </Text>
      </group>

      {/* Motion Indicator */}
      <group position={[2, 1, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={motion ? '#10b981' : '#6b7280'}
            emissive={motion ? '#10b981' : '#000000'}
            emissiveIntensity={motion ? 0.5 : 0}
          />
        </mesh>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {motion ? 'Motion' : 'No Motion'}
        </Text>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.2}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
        >
          PIR Sensor
        </Text>
      </group>

      {/* Base Platform */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[7, 0.1, 3]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Grid Lines */}
      <gridHelper args={[10, 10, '#4a5568', '#2d3748']} position={[0, -0.05, 0]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
    </>
  );
}

function SensorVisualization3D({ data }) {
  const temperature = data?.temperature || 25;
  const humidity = data?.humidity || 50;
  const motion = data?.motion || false;

  return (
    <div className="sensor-3d-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 3, 8]} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
        <Sensor3DModel
          temperature={temperature}
          humidity={humidity}
          motion={motion}
        />
      </Canvas>
      <div className="visualization-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ef4444' }}></div>
          <span>High Temperature</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#3b82f6' }}></div>
          <span>Normal/Low Temp</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#10b981' }}></div>
          <span>Motion Active</span>
        </div>
      </div>
    </div>
  );
}

export default SensorVisualization3D;

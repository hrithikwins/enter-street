import { useRef, useState } from 'react'
import { Color, AdditiveBlending } from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import classes from "./app.module.css"

export const App = ({ scale = Array.from({ length: 50 }, () => 0.2 + Math.random() * 4) }) => {
  const [cameraPositions, setCameraPositions] = useState([-4, 2, -4])
  // setTimeout(() => {

  //     setCameraPositions([-8,2,-4]);

  // }, 200);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center h-48 items-center">
        <h1 className={classes.heading}>Streetverse - The world of Streets</h1>
      </div>
      <div className="flex flex-col md:flex-row-reverse">
        <div className="h-96 md:w-1/2 md:h-full">
          <Canvas camera={{ fov: 45, position: cameraPositions }}>
            <Sparkles count={scale.length} size={scale} position={[0, 1, 0]} scale={[4, 1.5, 4]} speed={0.2} />
            <Model />
            <OrbitControls />
          </Canvas>
        </div>
        <div className="h-1/2 md:w-1/2">
          <div className=" grid grid-rows-4 md:grid-rows-1 grid-cols-1">
            <div className="flex justify-center items-center h-20 md:h-44 bg-purple-800 hover:bg-transparent hover:font-extrabold hover:scale-150 transition-all">
              <h1>Explore NFTs</h1>
            </div>
            <div className="flex justify-center items-center h-20 md:h-44 bg-pink-700 hover:bg-transparent hover:font-extrabold hover:scale-150 transition-all">
              <h1>Join Community</h1>
            </div>
            <div className="flex justify-center items-center h-20 md:h-44 bg-purple-800 hover:bg-transparent hover:font-extrabold hover:scale-150 transition-all">
              <h1> Enter Streetverse</h1>
            </div>
            <div className="flex justify-center items-center h-20 md:h-44 bg-pink-700 hover:bg-transparent hover:font-extrabold hover:scale-150 transition-all">
              <h1>Explore Roadmap</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Model(props) {
  const portalMaterial = useRef()
  const bakedTexture = useTexture('/baked-02.jpeg')
  const { nodes } = useGLTF('/portal-2.glb')
  useFrame((state, delta) => (portalMaterial.current.uTime += delta))
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.portalCircle.geometry} position={[0, 0.78, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <portalMaterial ref={portalMaterial} blending={AdditiveBlending} uColorStart="pink" uColorEnd="white" />
      </mesh>
      <mesh geometry={nodes.lampLightL.geometry} material-color="#f0bf94" position={[0.89, 1.07, -0.14]} scale={[0.07, 0.11, 0.07]} />
      <mesh geometry={nodes.lampLightR.geometry} material-color="#f0bf94" position={[-0.98, 1.07, -0.14]} scale={[-0.07, 0.11, 0.07]} />
      <mesh geometry={nodes.baked.geometry} position={[0.9, 0.34, -1.47]} rotation={[0, 0.14, 0]}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
    </group>
  )
}

extend({
  // shaderMaterial creates a THREE.ShaderMaterial, and auto-creates uniform setter/getters
  // extend makes it available in JSX, in this case <portalMaterial />
  PortalMaterial: shaderMaterial(
    { uTime: 0, uColorStart: new Color('hotpink'), uColorEnd: new Color('white') },
    glsl`
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
    glsl`
    #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    void main() {
      vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1));
      float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));
      float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
      strength += outerGlow;
      strength += step(-0.2, strength) * 0.8;
      strength = clamp(strength, 0.0, 1.0);
      vec3 color = mix(uColorStart, uColorEnd, strength);
      gl_FragColor = vec4(color, 1.0);
    }`,
  ),
})

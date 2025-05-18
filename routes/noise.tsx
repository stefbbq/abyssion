import { h } from "preact";
import { Head } from "$fresh/runtime.ts";
import NoiseVisualizer from "../islands/NoiseVisualizer.tsx";

export default function NoisePage() {
  return (
    <>
      <Head>
        <title>Noise Visualizer</title>
      </Head>
      <NoiseVisualizer />
    </>
  );
} 
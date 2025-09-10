<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { Polyline, Renderer, Transform, Vec3, Color } from "ogl";
  interface Props {
    colors?: Array<string>;
  }

  let { colors = ["#e18f39", "#c5c042", "#387f4d", "#1d4633"] } = $props();

  let canvas: undefined | HTMLCanvasElement = $state();
  const thickness: [number, number] = [14, 35];
  const spring: [number, number] = [0.02, 0.1];
  const friction: [number, number] = [0.7, 0.95];
  let animationId: null | number = null;
  let renderer: null | Renderer = null;
  let scene: Transform;
  let lines = [] as {
    points: Vec3[];
    polyline: Polyline;
    spring: number;
    friction: number;
    mouseVelocity: Vec3;
    mouseOffset: Vec3;
  }[];
  let mouse: Vec3;
  let tmp: Vec3;
  const vertex = `
		attribute vec3 position;
		attribute vec3 next;
		attribute vec3 prev;
		attribute vec2 uv;
		attribute float side;

		uniform vec2 uResolution;
		uniform float uDPR;
		uniform float uThickness;

		vec4 getPosition() {
			vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
			vec2 nextScreen = next.xy * aspect;
			vec2 prevScreen = prev.xy * aspect;

			vec2 tangent = normalize(nextScreen - prevScreen);
			vec2 normal = vec2(-tangent.y, tangent.x);
			normal /= aspect;
			normal *= 1.0 - pow(abs(uv.y - 0.5) * 1.9, 2.0);

			float pixelWidth = 1.0 / (uResolution.y / uDPR);
			normal *= pixelWidth * uThickness;

			float dist = length(nextScreen - prevScreen);
			normal *= smoothstep(0.0, 0.02, dist);

			vec4 current = vec4(position, 1);
			current.xy -= normal * side;
			return current;
		}

		void main() {
			gl_Position = getPosition();
		}
	`;
  const random = (array: [number, number]): number => {
    const alpha = Math.random();
    return array[0] * (1.0 - alpha) + array[1] * alpha;
  };
  function initializeCursorEffect() {
    renderer = new Renderer({
      dpr: 2,
      alpha: true,
      premultipliedAlpha: true,
      canvas,
    });
    if (!browser) return;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    scene = new Transform();
    mouse = new Vec3();
    tmp = new Vec3();
    colors.forEach((color) => {
      const count = 20;
      const points = [] as Vec3[];
      for (let i = 0; i < count; i++) {
        points.push(new Vec3());
      }
      const line = {
        points: points,
        polyline: new Polyline(gl, {
          points,
          vertex,
          uniforms: {
            uColor: { value: new Color(color) },
            uThickness: { value: random(thickness) },
          },
        }),
        spring: random(spring),
        friction: random(friction),
        mouseVelocity: new Vec3(),
        mouseOffset: new Vec3(random([-1, 1]) * 0.02),
      };
      line.polyline.mesh.setParent(scene);
      lines.push(line);
    });
    resize();
    startAnimation();
  }
  function resize() {
    renderer?.setSize(window.innerWidth, window.innerHeight);
    lines.forEach((line) => line.polyline.resize());
  }
  function updateMouse(e: MouseEvent) {
    if (!mouse) return;
    const x = e.pageX;
    const y = e.pageY;
    mouse.set(
      (x / (renderer?.gl.renderer.width ?? 1)) * 2 - 1,
      (y / (renderer?.gl.renderer.height ?? 1)) * -2 + 1,
      0,
    );
  }
  function update() {
    animationId = requestAnimationFrame(update);
    lines.forEach((line) => {
      for (let i = line.points.length - 1; i >= 0; i--) {
        if (!i) {
          tmp
            .copy(mouse)
            .add(line.mouseOffset)
            .sub(line.points[i])
            .multiply(line.spring);
          line.mouseVelocity.add(tmp).multiply(line.friction);
          line.points[i].add(line.mouseVelocity);
        } else {
          line.points[i].lerp(line.points[i - 1], 0.9);
        }
      }
      line.polyline.updateGeometry();
    });
    renderer?.render({ scene });
  }
  function startAnimation() {
    if (!animationId) {
      requestAnimationFrame(update);
    }
  }
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  onMount(() => {
    if (!browser) return;
    initializeCursorEffect();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", updateMouse);
  });
  onDestroy(() => {
    if (!browser) return;
    stopAnimation();
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", updateMouse);
  });
</script>

<canvas bind:this={canvas} id="cursor-canvas"></canvas>

<style>
  #cursor-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
    filter: blur(1rem);
  }
</style>

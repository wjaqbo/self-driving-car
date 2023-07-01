import './style.css';
import { Car, Road } from './lib/';

const myCanvas = document.querySelector<HTMLCanvasElement>('#my-canvas')!;

myCanvas.width = 800;
myCanvas.height = window.innerHeight;

const ctx = myCanvas.getContext('2d')!;
const road = new Road(myCanvas.width / 2, myCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(3), 350, 50, 100);

function animate() {
  myCanvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + myCanvas.height * 0.7);

  road.draw(ctx);
  car.draw(ctx);
  car.update();

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();

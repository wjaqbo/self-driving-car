import './style.css';
import { Car, Road } from './lib/';

const myCanvas = document.querySelector<HTMLCanvasElement>('#my-canvas')!;

myCanvas.width = 500;
myCanvas.height = window.innerHeight;

const ctx = myCanvas.getContext('2d')!;
const road = new Road(myCanvas.width / 2, myCanvas.width * 0.9, 5);
const car = new Car(road.getLaneCenter(3), 350, 50, 100, 'KEYS');
const traffic = [
  new Car(road.getLaneCenter(0), -100, 50, 100, 'DUMMY', 6.5),
  new Car(road.getLaneCenter(1), -300, 50, 100, 'DUMMY', 6.3),
  new Car(road.getLaneCenter(2), -500, 50, 100, 'DUMMY', 6),
];

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  myCanvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + myCanvas.height * 0.7);
  car.update(road.borders, traffic);

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, 'red');
  }
  car.draw(ctx, 'blue');

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();

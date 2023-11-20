import './style.css';
import { Car, NeuralNetwork, Road } from './lib/';

const carCanvas = document.querySelector<HTMLCanvasElement>('#car-canvas')!;
const networkCanvas =
  document.querySelector<HTMLCanvasElement>('#network-canvas')!;
const saveBtn = document.querySelector<HTMLButtonElement>('#save-btn');
const discardBtn = document.querySelector<HTMLButtonElement>('#discard-btn');

carCanvas.width = 300;
networkCanvas.width = 700;

carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;

const carCtx = carCanvas.getContext('2d')!;
const networkCtx = networkCanvas.getContext('2d')!;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem('bestBrain')) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain')!);
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain!, 0.26);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(0), -300, 50, 100, 'DUMMY', 5.5),
  new Car(road.getLaneCenter(1), -300, 50, 100, 'DUMMY', 6.3),
  new Car(road.getLaneCenter(2), -500, 50, 100, 'DUMMY', 5.1),
  new Car(road.getLaneCenter(1), -1000, 50, 100, 'DUMMY', 5.2),
  new Car(road.getLaneCenter(1), -1500, 50, 100, 'DUMMY', 5.2),
  new Car(road.getLaneCenter(2), -2000, 50, 100, 'DUMMY', 4.9),
  new Car(road.getLaneCenter(0), -2500, 50, 100, 'DUMMY', 4.9),
  new Car(road.getLaneCenter(1), -2500, 50, 100, 'DUMMY', 4.9),
  new Car(road.getLaneCenter(0), -3500, 50, 100, 'DUMMY', 4.7),
  new Car(road.getLaneCenter(1), -4000, 50, 100, 'DUMMY', 4.4),
  new Car(road.getLaneCenter(0), -4500, 50, 100, 'DUMMY', 4.4),
  new Car(road.getLaneCenter(2), -5500, 50, 100, 'DUMMY', 4.3),
  new Car(road.getLaneCenter(0), -6000, 50, 100, 'DUMMY', 4.4),
  new Car(road.getLaneCenter(1), -6000, 50, 100, 'DUMMY', 4.4),
  new Car(road.getLaneCenter(1), -6500, 50, 100, 'DUMMY', 4.4),
  new Car(road.getLaneCenter(2), -6500, 50, 100, 'DUMMY', 4.4),
];

saveBtn!.addEventListener('click', save);
discardBtn!.addEventListener('click', discard);

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem('bestBrain');
}

function generateCars(N: number) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 50, 100, 'AI', 7));
  }
  return cars;
}

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)))!;

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar!.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  bestCar!.draw(carCtx, 'blue', true);

  carCtx.restore();
  requestAnimationFrame(animate);
}

animate();

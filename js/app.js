// js/app.js
import { CircuitSimulator } from './core/simulator.js';
import { Breadboard } from './components/breadboard.js';
import { Toolbar } from './ui/toolbar.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const breadboard = new Breadboard(ctx);
    const simulator = new CircuitSimulator(canvas, breadboard); // Truyền breadboard vào simulator

    const toolbar = new Toolbar(simulator);
    toolbar.init(); // Khởi tạo các sự kiện và các thành phần trên thanh công cụ

    simulator.init(); // Khởi tạo các sự kiện và vẽ ban đầu

    // Bắt đầu mô phỏng
    simulator.redraw();
});
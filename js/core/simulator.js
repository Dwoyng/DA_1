// js/core/simulator.js
import { Component } from '../components/component.js';
import { Wire } from '../components/wire.js';

export class CircuitSimulator {
    constructor(canvas, breadboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.breadboard = breadboard;
        this.components = [];
        this.wires = [];
        this.selectedComponent = null;
        this.dragging = false;
        this.mode = 'select'; // Chế độ mặc định là chọn/di chuyển
        this.currentWireStart = null;
        this.isToolbarCollapsed = false;
        this.selectedConnectionPoint = null; // Lưu trữ điểm kết nối đã chọn

        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
    }

    init() {
        this.initEventListeners();
    }

    initEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        //Kiểm tra xem có click vào điểm kết nối linh kiện hay không
        for (const component of this.components) {
            for (const point of component.connectionPoints) {
                const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
                if (dist < 10) {  //Nếu khoảng cách từ điểm click đến điểm kết nối < 10 => click vào điểm kết nối
                    this.selectedConnectionPoint = point;  //gán điểm kết nối vào biến tạm
                    this.redraw();
                    return;
                }
            }
        }

        //Nếu không click vào điểm kết nối, thì tiếp tục di chuyển linh kiện
        this.selectedComponent = this.components.find(component => {
            const points = component.getConnectionPoints();
            return Math.abs(x - component.x) < 40 && Math.abs(y - component.y) < 40;
        });

        if (this.selectedComponent) {
            this.dragging = true;
            this.selectedComponent.isSelected = true;
            this.dragOffsetX = x - this.selectedComponent.x;
            this.dragOffsetY = y - this.selectedComponent.y;
            this.selectedComponent.setIsDragging(true);
            this.redraw();
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.dragging && this.selectedComponent) {  //Nếu đang di chuyển
            this.selectedComponent.updatePosition(x - this.dragOffsetX, y - this.dragOffsetY);
            this.redraw();
        }
    }

    handleMouseUp(e) {
        this.dragging = false; //Dừng kéo
        if (this.selectedComponent) {
            this.selectedComponent.isSelected = false;
            this.selectedComponent.setIsDragging(false); //Khi thả chuột, đặt trạng thái kéo linh kiện = false
            this.selectedComponent = null; //bỏ chọn linh kiện
            this.redraw();
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

         //Kiểm tra xem có thả chuột vào điểm kết nối hay không
        if (this.selectedConnectionPoint) {  //Nếu đã chọn điểm kết nối trước đó
            for (const component of this.components) {
                for (const point of component.connectionPoints) {
                    const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
                    if (dist < 10) {  //Nếu điểm thả gần điểm kết nối
                        //Tạo dây nối và lưu thông tin
                        this.wires.push(new Wire(
                            this.selectedConnectionPoint.component,
                            this.selectedConnectionPoint.index,
                            component,
                            point.index
                        ));
                        this.selectedConnectionPoint = null; //reset điểm kết nối
                        this.redraw();
                        return;
                    }
                }
            }
            this.selectedConnectionPoint = null; //Nếu không thả vào điểm kết nối nào thì reset
            this.redraw();
        }
    }

    addComponent(type) {
        const component = new Component(
            type,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.breadboard
        );
        this.components.push(component);
        this.redraw();
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.breadboard.draw();
        this.components.forEach(component => component.draw(this.ctx));
        this.wires.forEach(wire => wire.draw(this.ctx));
    }

   

    handleKeyDown(e) {
        if (this.selectedComponent) {
            switch (e.key) {
                case 'ArrowLeft':  // Mũi tên trái
                    this.selectedComponent.rotate(-15); // Xoay ngược chiều kim đồng hồ 15 độ
                    this.redraw();
                    break;
                case 'ArrowRight': // Mũi tên phải
                    this.selectedComponent.rotate(15);  // Xoay theo chiều kim đồng hồ 15 độ
                    this.redraw();
                    break;
                case 'ArrowUp':   //Mũi tên lên
                    this.selectedComponent.rotate(-45); //Xoay ngược chiều kim đồng hồ 45 độ
                    this.redraw();
                    break;
                case 'ArrowDown': //Mũi tên xuống
                    this.selectedComponent.rotate(45);  //Xoay theo chiều kim đồng hồ 45 độ
                    this.redraw();
                    break;
            }
        }
    }
}
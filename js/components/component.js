// js/components/component.js
import { Breadboard } from "./breadboard.js";

export class Component {
    constructor(type, x, y, breadboard) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.breadboard = breadboard;
        this.pins = [];
        this.rotation = 0;
        this.isSelected = false;
        this.isDragging = false;
        this.connectionPoints = [];  // Điểm kết nối

        this.image = new Image(); // Tạo đối tượng hình ảnh
        this.image.src = `assets/components/${type}.svg`; // Đường dẫn tới ảnh SVG

        this.initPins();
        this.initConnectionPoints();
    }

    initPins() {
        // Tìm các lỗ gần nhất và gán cho pins
        switch (this.type) {
            case 'resistor':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 40, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 40, this.y);
                break;
            case 'led':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 20, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 20, this.y);
                break;
            case 'voltage source':
                this.pins[0] = this.breadboard.getNearestHole(this.x, this.y - 40);
                this.pins[1] = this.breadboard.getNearestHole(this.x, this.y + 40);
                break;
            case 'capacitor':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 20, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 20, this.y);
                break;
            case 'current source':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 20, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 20, this.y);
                break;
            case 'inductor':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 20, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 20, this.y);
                break;
            case 'transistor':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 20, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 20, this.y);
                
                break;
            case 'diode':
                this.pins[0] = this.breadboard.getNearestHole(this.x - 20, this.y);
                this.pins[1] = this.breadboard.getNearestHole(this.x + 20, this.y);
                break;
            default:
                this.pins = [];
        }
    }

    initConnectionPoints() {  //Khởi tạo điểm kết nối
        let x1, y1, x2, y2;
        switch (this.type) {
            case 'resistor':
                x1 = this.x - 40;
                y1 = this.y;
                x2 = this.x + 40;
                y2 = this.y;
                break;
            case 'led':
                x1 = this.x - 11;
                y1 = this.y + 8;
                x2 = this.x + 11;
                y2 = this.y + 8;
                break;
            case 'voltage source':
                x1 = this.x - 28;
                y1 = this.y - 5;
                x2 = this.x + 28;
                y2 = this.y - 5;
                break;
            case 'capacitor':
                x1 = this.x - 27;
                y1 = this.y - 4;
                x2 = this.x + 27;
                y2 = this.y - 4;
                break;
            case 'diode':
                x1 = this.x - 40;
                y1 = this.y - 4;
                x2 = this.x + 40;
                y2 = this.y - 4;
                break;
            case 'transistor':
                x1 = this.x - 20;
                y1 = this.y;
                x2 = this.x + 20;
                y2 = this.y;
                break;
            case 'inductor':
                x1 = this.x - 36;
                y1 = this.y;
                x2 = this.x + 36;
                y2 = this.y;
                break;
            case 'current source':
                x1 = this.x - 30;
                y1 = this.y - 3;
                x2 = this.x + 30;
                y2 = this.y - 3;
                break;
            default:
                this.connectionPoints = [];
                return;
        }

        

        // Áp dụng xoay
        const angleRad = this.rotation * Math.PI / 180;
        const rotatedX1 = (x1 - this.x) * Math.cos(angleRad) - (y1 - this.y) * Math.sin(angleRad) + this.x;
        const rotatedY1 = (x1 - this.x) * Math.sin(angleRad) + (y1 - this.y) * Math.cos(angleRad) + this.y;
        const rotatedX2 = (x2 - this.x) * Math.cos(angleRad) - (y2 - this.y) * Math.sin(angleRad) + this.x;
        const rotatedY2 = (x2 - this.x) * Math.sin(angleRad) + (y2 - this.y) * Math.cos(angleRad) + this.y;

        this.connectionPoints = [
            { x: rotatedX1, y: rotatedY1, component: this, index: 0 },
            { x: rotatedX2, y: rotatedY2, component: this, index: 1 }
        ];
    }


    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        if (this.isSelected) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(-25, -15, 50, 30);
        }

        ctx.drawImage(this.image, -40, -20, 80, 40);


        ctx.restore();

        // Vẽ điểm kết nối
        this.connectionPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
        });
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.initPins();
        this.initConnectionPoints();
    }

    getConnectionPoints() {
        return this.connectionPoints;
    }

    setIsDragging(dragging) {
        this.isDragging = dragging;
    }

    getIsDragging() {
        return this.isDragging;
    }

    rotate(angle) {
        this.rotation += angle;
        // Đảm bảo góc xoay nằm trong khoảng 0-360 độ
        this.rotation %= 360;

       this.initConnectionPoints(); // Cập nhật lại vị trí điểm kết nối sau khi xoay

       
    }
}
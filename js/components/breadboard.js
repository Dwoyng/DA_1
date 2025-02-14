// js/components/breadboard.js
export class Breadboard {
    constructor(ctx) {
        this.ctx = ctx;
        this.gridSize = 20;
        this.rows = 30;
        this.cols = 40;
        this.holes = [];
        this.powerRailOffset = 100;
        this.init();
    }

    init() {
        // Pre-calculate holes and connections
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = this.powerRailOffset + 20 + col * this.gridSize;
                const y = 20 + row * this.gridSize;
                this.holes.push({
                    x: x,
                    y: y,
                    row: row,  // Lưu trữ hàng
                    col: col,  // Lưu trữ cột
                    connections: []
                });
            }
        }
    }

    draw() {
        this.ctx.fillStyle = "#e1d5c9";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.fillStyle = "#ff9999";
        this.ctx.fillRect(this.powerRailOffset, 0, 10, this.ctx.canvas.height);
        this.ctx.fillRect(this.ctx.canvas.width - this.powerRailOffset - 10, 0, 10, this.ctx.canvas.height);

        for (const hole of this.holes) {
            this.ctx.beginPath();
            this.ctx.arc(hole.x, hole.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "#ccc";
            this.ctx.fill();
        }
    }

    getNearestHole(x, y) {
        let minDist = Infinity;
        let nearest = null;

        for (const hole of this.holes) {
            const dist = Math.sqrt((x - hole.x) ** 2 + (y - hole.y) ** 2);
            if (dist < 15 && dist < minDist) {
                minDist = dist;
                nearest = hole;
            }
        }
        return nearest;
    }
}
import { Point } from './Point';

export class Polygon {
    public vertices: Point[] = [];
    public isFinished: boolean = false;
    
    addVertex(point: Point): void {
        this.vertices.push(point.clone());
    }
    
    finish(): void {
        this.isFinished = true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.vertices.length === 0) return;
        
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        
        for (let i = 1; i < this.vertices.length; ++i) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        
        if (this.isFinished && this.vertices.length > 2) {
            ctx.closePath();
            ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
            ctx.fill();
        }
        
        ctx.strokeStyle = '#007acc';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        this.vertices.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#007acc';
            ctx.fill();
        });
    }
    
    clone(): Polygon {
        const poly = new Polygon();
        poly.vertices = this.vertices.map(v => v.clone());
        poly.isFinished = this.isFinished;
        return poly;
    }
}

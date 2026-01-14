import { Point } from './Point';

/**
 * Represents a polygon with multiple vertices
 */
export class Polygon {
    public vertices: Point[] = [];
    public isFinished: boolean = false;
    
    /**
     * Add a vertex to the polygon
     */
    addVertex(point: Point): void {
        this.vertices.push(point.clone());
    }
    
    /**
     * Finish the polygon (close it)
     */
    finish(): void {
        this.isFinished = true;
    }
    
    /**
     * Draw the polygon on a canvas context
     */
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.vertices.length === 0) return;
        
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        
        for (let i = 1; i < this.vertices.length; i++) {
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
        
        // Draw vertices
        this.vertices.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#007acc';
            ctx.fill();
        });
    }
    
    /**
     * Create a copy of this polygon
     */
    clone(): Polygon {
        const poly = new Polygon();
        poly.vertices = this.vertices.map(v => v.clone());
        poly.isFinished = this.isFinished;
        return poly;
    }
}

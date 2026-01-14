/**
 * Represents a 2D point with x and y coordinates
 */
export class Point {
    constructor(
        public x: number,
        public y: number
    ) {}
    
    /**
     * Calculate distance to another point
     */
    distanceTo(other: Point): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Create a copy of this point
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }
}

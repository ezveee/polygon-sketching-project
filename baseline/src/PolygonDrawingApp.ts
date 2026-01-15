import { Point } from './Point';
import { Polygon } from './Polygon';

export class PolygonDrawingApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    // polygons
    private polygons: Polygon[] = [];
    private currentPolygon: Polygon | null = null;
    private previewPoint: Point | null = null;
    
    // history
    private history: { polygons: Polygon[], currentPolygon: Polygon | null }[] = [
        { polygons: [], currentPolygon: null }
    ];
    private historyIndex: number = 0;
    private currentPolygonStartIndex: number = 0;
    
    // UI
    private undoBtn: HTMLButtonElement;
    private redoBtn: HTMLButtonElement;
    private clearBtn: HTMLButtonElement;
    
    // init
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas with id '${canvasId}' not found`);
        }
        
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;
        
        this.undoBtn = document.getElementById('undoBtn') as HTMLButtonElement;
        this.redoBtn = document.getElementById('redoBtn') as HTMLButtonElement;
        this.clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
        
        this.setupEventListeners();
        
        this.updateUI();
        this.render();
    }
    
    // setup event listeners
    private setupEventListeners(): void {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());
        this.clearBtn.addEventListener('click', () => this.clear());
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    this.undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }
    
    private getMousePos(e: MouseEvent): Point {
        const rect = this.canvas.getBoundingClientRect();
        return new Point(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    }
    

    private handleClick(e: MouseEvent): void {
        const point = this.getMousePos(e);
        
        if (!this.currentPolygon) {
            this.currentPolygon = new Polygon();
            this.currentPolygonStartIndex = this.historyIndex;
        }
        
        this.currentPolygon.addVertex(point);
        
        this.saveToHistory();
        this.render();
    }
    
    /**
     * Handle double click - finish current polygon
     */
    private handleDoubleClick(e: MouseEvent): void {
        e.preventDefault();
        
        if (this.currentPolygon && this.currentPolygon.vertices.length >= 3) {
            this.currentPolygon.finish();
            this.polygons.push(this.currentPolygon);
            
            // Consolidate history: remove all vertex-building states and replace with single finished state
            this.history = this.history.slice(0, this.currentPolygonStartIndex + 1);
            this.historyIndex = this.currentPolygonStartIndex;
            
            this.currentPolygon = null;
            this.previewPoint = null;
            
            // Save final state to history (finished polygon)
            this.saveToHistory();
            this.render();
        }
    }
    
    /**
     * Handle mouse move - update preview line
     */
    private handleMouseMove(e: MouseEvent): void {
        if (this.currentPolygon && this.currentPolygon.vertices.length > 0) {
            this.previewPoint = this.getMousePos(e);
            this.render();
        }
    }
    
    private saveToHistory(): void {
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        const state = {
            polygons: this.polygons.map(p => p.clone()),
            currentPolygon: this.currentPolygon ? this.currentPolygon.clone() : null
        };
        this.history.push(state);
        this.historyIndex++;
        
        this.updateUI();
    }
    
    private undo(): void {
        if (this.historyIndex <= 0) {
            return;
        }
        this.historyIndex--;
        const state = this.history[this.historyIndex];
        this.polygons = state.polygons.map(p => p.clone());
        this.currentPolygon = state.currentPolygon ? state.currentPolygon.clone() : null;
        this.previewPoint = null;
        this.updateUI();
        this.render();
    }
    
    private redo(): void {
        if (this.historyIndex >= this.history.length - 1) {
            return;
        }
        this.historyIndex++;
        const state = this.history[this.historyIndex];
        this.polygons = state.polygons.map(p => p.clone());
        this.currentPolygon = state.currentPolygon ? state.currentPolygon.clone() : null;
        this.previewPoint = null;
        this.updateUI();
        this.render();
    }
    
    private clear(): void {
        this.polygons = [];
        this.currentPolygon = null;
        this.previewPoint = null;
        this.saveToHistory();
        this.render();
    }
    
    private updateUI(): void {
        this.undoBtn.disabled = this.historyIndex <= 0;
        this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    private render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.polygons.forEach(polygon => polygon.draw(this.ctx));
        
        if (!this.currentPolygon) {
            return;
        }
                this.currentPolygon.draw(this.ctx);
        
        if (!this.previewPoint || this.currentPolygon.vertices.length <= 0) {
            return;
        }
        const lastVertex = this.currentPolygon.vertices[this.currentPolygon.vertices.length - 1];
        this.ctx.beginPath();
        this.ctx.moveTo(lastVertex.x, lastVertex.y);
        this.ctx.lineTo(this.previewPoint.x, this.previewPoint.y);
        this.ctx.strokeStyle = 'rgba(0, 122, 204, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}

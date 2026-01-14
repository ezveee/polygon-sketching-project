import { Point } from './Point';
import { Polygon } from './Polygon';

/**
 * Main application class for polygon drawing
 * Manages state, history, and user interactions
 */
export class PolygonDrawingApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    // Application state (mutable)
    private polygons: Polygon[] = [];
    private currentPolygon: Polygon | null = null;
    private previewPoint: Point | null = null;
    
    // Undo/Redo history - stores both finished polygons and current polygon
    private history: { polygons: Polygon[], currentPolygon: Polygon | null }[] = [
        { polygons: [], currentPolygon: null }
    ];
    private historyIndex: number = 0;
    
    // Track where current polygon started in history (for consolidation on finish)
    private currentPolygonStartIndex: number = 0;
    
    // UI elements
    private undoBtn: HTMLButtonElement;
    private redoBtn: HTMLButtonElement;
    private clearBtn: HTMLButtonElement;
    
    constructor(canvasId: string) {
        // Get canvas and context
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas with id '${canvasId}' not found`);
        }
        
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;
        
        // Get UI buttons
        this.undoBtn = document.getElementById('undoBtn') as HTMLButtonElement;
        this.redoBtn = document.getElementById('redoBtn') as HTMLButtonElement;
        this.clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.updateUI();
        this.render();
    }
    
    /**
     * Setup all event listeners for user interactions
     */
    private setupEventListeners(): void {
        // Canvas events
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Button events
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());
        this.clearBtn.addEventListener('click', () => this.clear());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    this.undo();
                } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }
    
    /**
     * Get mouse position relative to canvas
     */
    private getMousePos(e: MouseEvent): Point {
        const rect = this.canvas.getBoundingClientRect();
        return new Point(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    }
    
    /**
     * Handle single click - add vertex to current polygon
     */
    private handleClick(e: MouseEvent): void {
        const point = this.getMousePos(e);
        
        if (!this.currentPolygon) {
            // Start new polygon - remember where we started in history
            this.currentPolygon = new Polygon();
            this.currentPolygonStartIndex = this.historyIndex;
        }
        
        this.currentPolygon.addVertex(point);
        
        // Save to history after each vertex
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
    
    /**
     * Save current state to history
     */
    private saveToHistory(): void {
        // Remove any future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Clone all polygons and current polygon for history
        const state = {
            polygons: this.polygons.map(p => p.clone()),
            currentPolygon: this.currentPolygon ? this.currentPolygon.clone() : null
        };
        this.history.push(state);
        this.historyIndex++;
        
        this.updateUI();
    }
    
    /**
     * Undo last action
     */
    private undo(): void {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            this.polygons = state.polygons.map(p => p.clone());
            this.currentPolygon = state.currentPolygon ? state.currentPolygon.clone() : null;
            this.previewPoint = null;
            this.updateUI();
            this.render();
        }
    }
    
    /**
     * Redo last undone action
     */
    private redo(): void {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            this.polygons = state.polygons.map(p => p.clone());
            this.currentPolygon = state.currentPolygon ? state.currentPolygon.clone() : null;
            this.previewPoint = null;
            this.updateUI();
            this.render();
        }
    }
    
    /**
     * Clear all polygons
     */
    private clear(): void {
        this.polygons = [];
        this.currentPolygon = null;
        this.previewPoint = null;
        this.saveToHistory();
        this.render();
    }
    
    /**
     * Update UI button states
     */
    private updateUI(): void {
        this.undoBtn.disabled = this.historyIndex <= 0;
        this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    /**
     * Render everything to canvas
     */
    private render(): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw finished polygons
        this.polygons.forEach(polygon => polygon.draw(this.ctx));
        
        // Draw current polygon being drawn
        if (this.currentPolygon) {
            this.currentPolygon.draw(this.ctx);
            
            // Draw preview line
            if (this.previewPoint && this.currentPolygon.vertices.length > 0) {
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
    }
}

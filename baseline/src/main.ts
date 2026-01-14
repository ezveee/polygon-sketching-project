import './style.css';
import { PolygonDrawingApp } from './PolygonDrawingApp';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PolygonDrawingApp('canvas');
});

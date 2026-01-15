import './style.css';
import { PolygonDrawingApp } from './PolygonDrawingApp';

// init application
document.addEventListener('DOMContentLoaded', () => {
    new PolygonDrawingApp('canvas');
});

// Functions.js

// Global variables
let undoStack = [];
let redoStack = [];
const canvas = document.getElementById('canvas');

// Drag-and-Drop Functionality
function enableDragAndDrop() {
    const toolbox = document.querySelectorAll('.tool');
    toolbox.forEach(tool => {
        tool.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('element', e.target.dataset.element);
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const element = e.dataTransfer.getData('element');
        createElement(element, e.clientX, e.clientY);
    });
}

// Create elements dynamically
function createElement(type, x, y) {
    let newElement;
    switch (type) {
        case 'text':
            newElement = document.createElement('div');
            newElement.textContent = 'New Text';
            break;
        case 'button':
            newElement = document.createElement('button');
            newElement.textContent = 'Click Me';
            break;
        case 'logo':
            newElement = document.createElement('img');
            newElement.src = 'https://via.placeholder.com/100';
            newElement.alt = 'Logo';
            break;
        case 'list':
            newElement = document.createElement('ul');
            newElement.innerHTML = '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';
            break;
        case 'section':
            newElement = document.createElement('div');
            newElement.style.border = '1px solid #000';
            newElement.style.padding = '10px';
            newElement.style.margin = '10px 0';
            newElement.textContent = 'Section';
            break;
        default:
            console.error('Unsupported element type:', type);
            return;
    }

    newElement.classList.add('draggable');
    newElement.style.position = 'absolute';
    newElement.style.top = `${y - canvas.offsetTop}px`;
    newElement.style.left = `${x - canvas.offsetLeft}px`;
    canvas.appendChild(newElement);
    makeDraggable(newElement);
    saveState();
}

// Make elements draggable within the canvas
function makeDraggable(element) {
    element.addEventListener('mousedown', (e) => {
        let offsetX = e.clientX - element.offsetLeft;
        let offsetY = e.clientY - element.offsetTop;

        function moveElement(e) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }

        function stopMoving() {
            document.removeEventListener('mousemove', moveElement);
            document.removeEventListener('mouseup', stopMoving);
        }

        document.addEventListener('mousemove', moveElement);
        document.addEventListener('mouseup', stopMoving);
    });
}

// Undo/Redo functionality
function saveState() {
    undoStack.push(canvas.innerHTML);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(canvas.innerHTML);
        canvas.innerHTML = undoStack.pop();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(canvas.innerHTML);
        canvas.innerHTML = redoStack.pop();
    }
}

// Inline Text Editing
function enableInlineEditing() {
    canvas.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('draggable')) {
            const text = prompt('Edit Text:', e.target.textContent);
            if (text !== null) {
                e.target.textContent = text;
                saveState();
            }
        }
    });
}

// Custom CSS Support
function applyCustomCSS(css) {
    const styleTag = document.getElementById('custom-css') || document.createElement('style');
    styleTag.id = 'custom-css';
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);
}

// Initialize Builder
function initializeBuilder() {
    enableDragAndDrop();
    enableInlineEditing();
    saveState();
}

// Export and Import Layouts
function exportLayout() {
    const layout = canvas.innerHTML;
    const blob = new Blob([layout], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'layout.html';
    link.click();
}

function importLayout(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        canvas.innerHTML = e.target.result;
        saveState();
    };
    reader.readAsText(file);
}

// Hook to initialize everything once the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBuilder);

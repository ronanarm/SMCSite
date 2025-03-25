// Stage Plot Tool - Interactive Canvas for Equipment Layout

// Equipment library - predefined items that can be added to the canvas
const equipmentLibrary = {
    guitarandbass: {
        name: 'Guitar & Bass',
        items: {
            guitar: {
                name: 'Acoustic Guitar',
                icon: 'acousticGuitar.png',
                width: 50,
                height: 50,
                description: 'Acoustic Guitar'
            },
            guitar2: {
                name: 'Electric Guitar',
                icon: 'electricGuitarOne.jpg',
                width: 50,
                height: 50,
                description: 'Electric Guitar'
            },
            jbass: {
                name: 'P-Style Bass',
                icon: 'jbass.png',
                width: 50,
                height: 50,
                description: 'P-Style Bass'
            },
            jaybass: {
                name: 'J-Style Bass',
                icon: 'jayBass.png',
                width: 50,
                height: 50,
                description: 'J-Style Bass'
            },
            strat: {
                name: 'S-Style Guitar',
                icon: 'stratocaster.png',
                width: 50,
                height: 50,
                description: 'S-Style Guitar'
            },
            tele: {
                name: 'T-Style Guitar',
                icon: 'telecaster.png',
                width: 50,
                height: 50,
                description: 'T-Style Guitar'
            },
        }
    },
    keys: {
        name: 'Piano & Keyboard',
        items: {
            keyboard: {
                name: 'Keyboard',
                icon: 'Keyboard.png',
                width: 80,
                height: 40,
                description: 'Keyboard/Piano'
            },
            grand1: {
                name: 'Grand Piano 1',
                icon: 'grandPiano.png',
                width: 80,
                height: 40,
                description: 'Keyboard/Piano'
            },
            grand2: {
                name: 'Grand Piano 2',
                icon: 'grandPiano2.png',
                width: 80,
                height: 40,
                description: 'Keyboard/Piano'
            },
            synth1: {
                name: 'Synthesizer 1',
                icon: 'synth.png',
                width: 80,
                height: 40,
                description: 'Keyboard/Piano'
            },
            drumMachine: {
                name: 'Synthesizer 2',
                icon: 'tr808.png',
                width: 80,
                height: 40,
                description: 'Keyboard/Piano'
            },

        }
    },
    microphones: {
        name: 'Microphones',
        items: {
            microphone: {
                name: 'Classic 58',
                icon: 'sm58.png',
                width: 40,
                height: 40,
                description: 'Standard microphone'
            },
            
        }
    },
    speakers: {
        name: 'Speakers & Monitors',
        items: {
            speaker: {
                name: 'PA Speaker',
                icon: 'wedge.webp',
                width: 60,
                height: 60,
                description: 'PA Speaker'
            },
            monitor: {
                name: 'Stage Monitor',
                icon: 'wedge.webp',
                width: 40,
                height: 40,
                description: 'Stage monitor'
            }
        }
    },
    instruments: {
        name: 'Instruments',
        items: {
            drumKit: {
                name: 'Drum Kit',
                icon: 'drums.png',
                width: 100,
                height: 100,
                description: 'Standard drum kit'
            },
            keyboard: {
                name: 'Keyboard',
                icon: 'Keyboard.png',
                width: 80,
                height: 40,
                description: 'Keyboard/Piano'
            }
        }
    },
    amplifiers: {
        name: 'Amplifiers',
        items: {
            guitar: {
                name: 'Guitar Amp',
                icon: 'fenderAmp.webp',
                width: 50,
                height: 50,
                description: 'Guitar amplifier'
            }
        }
    }
};

// Main class for the Stage Plot application
class StagePlot {
    constructor() {
        this.items = [];
        this.nextId = 1;
        this.selectedItem = null;
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.isRenaming = false;
        this.canvasWidth = 800;
        this.canvasHeight = 500;
        this.showGrid = false;
        this.gridSize = 20;
        
        this.init();
    }
    
    init() {
        // Create the main container
        this.createMainContainer();
        
        // Create the equipment library panel
        this.createLibraryPanel();
        
        // Create the canvas for the stage plot
        this.createCanvas();
        
        // Create the toolbar
        this.createToolbar();
        
        // Add event listeners
        this.addEventListeners();
    }
    
    createMainContainer() {
        const bodyContent = document.querySelector('.bodyContent');
        
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'stagePlotContainer';
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Stage Plot Designer';
        this.container.appendChild(title);
        
        // Add description
        const description = document.createElement('p');
        description.textContent = 'Drag and drop equipment to create your stage plot. Click on items to select and customize them.';
        this.container.appendChild(description);
        
        bodyContent.appendChild(this.container);
    }
    
    createLibraryPanel() {
        // Create layout container
        this.layout = document.createElement('div');
        this.layout.className = 'stagePlotLayout';
        this.container.appendChild(this.layout);
        
        // Create library panel
        this.libraryPanel = document.createElement('div');
        this.libraryPanel.className = 'libraryPanel';
        
        const libraryTitle = document.createElement('h3');
        libraryTitle.textContent = 'Equipment Library';
        this.libraryPanel.appendChild(libraryTitle);
        
        // Create equipment categories container
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'equipmentCategories';
        
        // Add equipment categories
        for (const [categoryId, category] of Object.entries(equipmentLibrary)) {
            // Create category container
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'equipmentCategory';
            
            // Create category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'categoryHeader';
            
            // Add collapse/expand icon
            const collapseIcon = document.createElement('i');
            collapseIcon.className = 'bi bi-chevron-down';
            categoryHeader.appendChild(collapseIcon);
            
            // Add category title
            const categoryTitle = document.createElement('span');
            categoryTitle.textContent = category.name;
            categoryHeader.appendChild(categoryTitle);
            
            // Create category content
            const categoryContent = document.createElement('div');
            categoryContent.className = 'categoryContent';
            
            // Create equipment grid for this category
            const equipmentGrid = document.createElement('div');
            equipmentGrid.className = 'equipmentGrid';
            
            // Add equipment items to the grid
            for (const [itemId, equipment] of Object.entries(category.items)) {
                const item = document.createElement('div');
                item.className = 'equipmentItem';
                item.dataset.equipmentId = itemId;
                item.dataset.categoryId = categoryId;
                
                const icon = document.createElement('div');
                icon.className = 'equipmentIcon';
                icon.innerHTML = `<img src="img/stageplot/${equipment.icon}" height="50"/>`;
                
                const name = document.createElement('div');
                name.className = 'equipmentName';
                name.textContent = equipment.name;
                
                item.appendChild(icon);
                item.appendChild(name);
                equipmentGrid.appendChild(item);
                
                // Add click event to add the item to the canvas
                item.addEventListener('click', () => this.addItemToCanvas(itemId, categoryId));
            }
            
            categoryContent.appendChild(equipmentGrid);
            
            // Add click event for category header to toggle collapse
            categoryHeader.addEventListener('click', () => {
                categoryContainer.classList.toggle('collapsed');
                collapseIcon.className = categoryContainer.classList.contains('collapsed') 
                    ? 'bi bi-chevron-right' 
                    : 'bi bi-chevron-down';
            });
            
            // Assemble category container
            categoryContainer.appendChild(categoryHeader);
            categoryContainer.appendChild(categoryContent);
            categoriesContainer.appendChild(categoryContainer);
        }
        
        this.libraryPanel.appendChild(categoriesContainer);
        this.layout.appendChild(this.libraryPanel);
        this.updateLibraryHeight();
    }
    
    createCanvas() {
        // Create canvas container
        this.canvasContainer = document.createElement('div');
        this.canvasContainer.className = 'canvasContainer';
        
        // Create canvas controls
        this.createCanvasControls();
        
        // Create canvas
        this.canvas = document.createElement('div');
        this.canvas.className = 'stageCanvas';
        this.canvas.style.width = `${this.canvasWidth}px`;
        this.canvas.style.height = `${this.canvasHeight}px`;
        this.canvas.style.position = 'relative';
        
        this.canvasContainer.appendChild(this.canvas);
        this.layout.appendChild(this.canvasContainer);
        
        // Apply grid if enabled
        this.updateGrid();
        this.updateLibraryHeight();
    }
    
    createCanvasControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'canvasControls';
        
        // Width control
        const widthLabel = document.createElement('label');
        widthLabel.innerHTML = 'Canvas Width: ';
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.min = '400';
        widthInput.max = '2000';
        widthInput.value = this.canvasWidth;
        widthInput.addEventListener('change', () => {
            this.canvasWidth = parseInt(widthInput.value, 10) || 800;
            this.canvas.style.width = `${this.canvasWidth}px`;
            this.updateLibraryHeight();
            this.updateGrid();
        });
        widthLabel.appendChild(widthInput);
        
        // Height control
        const heightLabel = document.createElement('label');
        heightLabel.innerHTML = 'Canvas Height: ';
        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.min = '300';
        heightInput.max = '1500';
        heightInput.value = this.canvasHeight;
        heightInput.addEventListener('change', () => {
            this.canvasHeight = parseInt(heightInput.value, 10) || 500;
            this.canvas.style.height = `${this.canvasHeight}px`;
            this.updateLibraryHeight();
            this.updateGrid();
        });
        heightLabel.appendChild(heightInput);
        
        // Grid control
        const gridLabel = document.createElement('label');
        const gridCheckbox = document.createElement('input');
        gridCheckbox.type = 'checkbox';
        gridCheckbox.checked = this.showGrid;
        gridCheckbox.addEventListener('change', () => {
            this.showGrid = gridCheckbox.checked;
            this.updateLibraryHeight();
            this.updateGrid();
        });
        gridLabel.appendChild(gridCheckbox);
        gridLabel.appendChild(document.createTextNode(' Show Grid'));
        
        // Grid size control
        const gridSizeLabel = document.createElement('label');
        gridSizeLabel.innerHTML = 'Grid Size: ';
        const gridSizeInput = document.createElement('input');
        gridSizeInput.type = 'number';
        gridSizeInput.min = '10';
        gridSizeInput.max = '100';
        gridSizeInput.value = this.gridSize;
        gridSizeInput.addEventListener('change', () => {
            this.gridSize = parseInt(gridSizeInput.value, 10) || 20;
            this.updateGrid();
            this.updateLibraryHeight();
        });
        gridSizeLabel.appendChild(gridSizeInput);
        
        // Add controls to container
        controlsContainer.appendChild(widthLabel);
        controlsContainer.appendChild(heightLabel);
        controlsContainer.appendChild(gridLabel);
        controlsContainer.appendChild(gridSizeLabel);
        
        // Add container to canvas container
        this.canvasContainer.appendChild(controlsContainer);
        this.updateLibraryHeight();
    }
    
    updateGrid() {
        if (this.showGrid) {
            this.canvas.classList.add('grid');
            this.canvas.style.backgroundSize = `${this.gridSize}px ${this.gridSize}px`;
        } else {
            this.canvas.classList.remove('grid');
            this.canvas.style.backgroundSize = '';
        }
    }
    
    createToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'toolbar';
        
        // Clear button
        const clearButton = document.createElement('button');
        clearButton.className = 'toolbarButton';
        clearButton.textContent = 'Clear All';
        clearButton.addEventListener('click', () => this.clearCanvas());
        
        // Save button
        const saveButton = document.createElement('button');
        saveButton.className = 'toolbarButton';
        saveButton.textContent = 'Save Plot';
        saveButton.addEventListener('click', () => this.savePlot());
        
        // Load button
        const loadButton = document.createElement('button');
        loadButton.className = 'toolbarButton';
        loadButton.textContent = 'Load Plot';
        loadButton.addEventListener('click', () => this.loadPlot());
        
        this.toolbar.appendChild(clearButton);
        this.toolbar.appendChild(saveButton);
        this.toolbar.appendChild(loadButton);
        
        this.container.appendChild(this.toolbar);
    }
    
    addEventListeners() {
        // Canvas click event (deselect items)
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectAll();
            }
        });
        
        // Window click event (handle renaming)
        window.addEventListener('click', (e) => {
            if (this.isRenaming && !e.target.classList.contains('renameInput')) {
                this.finishRenaming();
            }
        });
        
        // Key events for escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isRenaming) {
                    this.cancelRenaming();
                } else if (this.selectedItem) {
                    this.deselectAll();
                }
            }
        });
    }
    
    addItemToCanvas(itemId, categoryId) {
        const equipment = equipmentLibrary[categoryId]?.items[itemId];
        if (!equipment) return;
        
        const id = this.nextId++;
        const item = {
            id,
            type: itemId,
            name: equipment.name,
            icon: equipment.icon,
            x: (this.canvas.clientWidth / 2 - equipment.width),
            y: (this.canvas.clientHeight / 2 - equipment.height),
            width: equipment.width,
            height: equipment.height,
            rotation: 0,
            hasText: false
        };
        
        this.items.push(item);
        this.renderItem(item);
    }
    
    updateItemBoundingBox(itemElement) {
        // Get all the content elements
        const iconContainer = itemElement.querySelector('.itemIconContainer');
        const nameElement = itemElement.querySelector('.itemName');
        const controlsElement = itemElement.querySelector('.itemControls');

        if (!iconContainer) return;

        // Get the actual dimensions of the icon including its scale
        // const scale = parseFloat(iconContainer.dataset.scale || 1);
        const scale = 1;
        const iconRect = iconContainer.getBoundingClientRect();
        const scaledIconWidth = iconRect.width * scale;
        const scaledIconHeight = iconRect.height * scale;

        // Calculate the total width and height needed
        let totalWidth = scaledIconWidth;
        let totalHeight = scaledIconHeight;

        // Add text height if visible
        if (nameElement && itemElement.classList.contains('has-text')) {
            const nameRect = nameElement.getBoundingClientRect();
            totalHeight += nameRect.height;
            totalWidth = Math.max(totalWidth, nameRect.width);
        }


        // Add some padding
        totalWidth += 20;
        totalHeight += 20;

        // Update the container size
        itemElement.style.width = `${totalWidth}px`;
        itemElement.style.height = `${totalHeight}px`;
    }

    renderItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'canvasItem';
        if (item.hasText) {
            itemElement.classList.add('has-text');
        }
        itemElement.dataset.itemId = item.id;
        itemElement.style.left = `${item.x}px`;
        itemElement.style.top = `${item.y}px`;
        
        // Create icon container to handle rotation separately
        const iconContainer = document.createElement('div');
        iconContainer.className = 'itemIconContainer';
        
        const icon = document.createElement('div');
        icon.className = 'itemIcon';
        icon.innerHTML = `<img src="img/stageplot/${item.icon}" alt="${item.name}" height="50" style="transform:rotate(${item.rotation}deg) scale(1);">`;
        
        iconContainer.appendChild(icon);
        
        const name = document.createElement('div');
        name.className = 'itemName';
        name.textContent = item.name;
        
        // Create item controls
        const controls = document.createElement('div');
        controls.className = 'itemControls';
        
        // Increase size button
        const increaseBtn = document.createElement('button');
        increaseBtn.innerHTML = '<i class="bi bi-plus"></i>';
        increaseBtn.title = 'Increase Size';
        increaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.resizeItem(item, 1.2);
        });
        
        // Decrease size button
        const decreaseBtn = document.createElement('button');
        decreaseBtn.innerHTML = '<i class="bi bi-dash"></i>';
        decreaseBtn.title = 'Decrease Size';
        decreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.resizeItem(item, 0.8);
        });
        
        // Rotate left button
        const rotateLeftBtn = document.createElement('button');
        rotateLeftBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
        rotateLeftBtn.title = 'Rotate Left';
        rotateLeftBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotateItem(item, -45);
        });
        
        // Rotate right button
        const rotateRightBtn = document.createElement('button');
        rotateRightBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
        rotateRightBtn.title = 'Rotate Right';
        rotateRightBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotateItem(item, 45);
        });
        
        // Toggle text button
        const textBtn = document.createElement('button');
        textBtn.innerHTML = '<i class="bi bi-input-cursor-text"></i>';
        textBtn.title = 'Toggle Text';
        textBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleItemText(item);
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.title = 'Delete Item';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeItem(item);
        });
        
        // Add buttons to controls
        controls.appendChild(decreaseBtn);
        controls.appendChild(increaseBtn);
        controls.appendChild(rotateLeftBtn);
        controls.appendChild(rotateRightBtn);
        controls.appendChild(textBtn);
        controls.appendChild(deleteBtn);
        
        // Add elements to item
        itemElement.appendChild(iconContainer);
        itemElement.appendChild(name);
        itemElement.appendChild(controls);
        
        // Add event listeners for the item
        itemElement.addEventListener('mousedown', (e) => {
            // Don't start dragging if clicking on a control button
            if (e.target.closest('.itemControls')) return;
            this.onItemMouseDown(e, item);
        });
        
        itemElement.addEventListener('click', (e) => {
            // Don't select if clicking on a control button
            if (e.target.closest('.itemControls')) return;
            e.stopPropagation();
            this.selectItem(item);
        });
        
        this.canvas.appendChild(itemElement);
        
        // Calculate initial bounding box size
        this.updateItemBoundingBox(itemElement);
    }
    
    resizeItem(item, factor) {
        // Get the icon container
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        if (!itemElement) return;

        const iconContainer = itemElement.querySelector('.itemIconContainer');
        if (!iconContainer) return;

        // Update the scale transform of the icon container
        const currentScale = parseFloat(iconContainer.dataset.scale || 1);
        const newScale = currentScale * factor;
        
        // Limit the scale between 0.2 and 5
        const limitedScale = Math.max(0.2, Math.min(5, newScale));
        
        iconContainer.style.transform = `rotate(${item.rotation || 0}deg) scale(${limitedScale})`;
        iconContainer.dataset.scale = limitedScale;

        // Update the bounding box
        this.updateItemBoundingBox(itemElement);
    }
    
    rotateItem(item, degrees) {
        // Update rotation
        item.rotation = (item.rotation || 0) + degrees;
        
        // Normalize rotation to 0-359
        item.rotation = ((item.rotation % 360) + 360) % 360;
        
        // Update DOM element
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        if (itemElement) {
            const iconContainer = itemElement.querySelector('.itemIconContainer');
            if (iconContainer) {
                const scale = parseFloat(iconContainer.dataset.scale || 1);
                iconContainer.style.transform = `rotate(${item.rotation}deg) scale(${scale})`;
            }
        }
        this.updateItemBoundingBox(itemElement);
    }
    
    toggleItemText(item) {
        // Toggle text visibility
        item.hasText = !item.hasText;
        
        // Update DOM element
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        if (itemElement) {
            if (item.hasText) {
                itemElement.classList.add('has-text');
                // Start renaming if text is being shown for the first time
                this.startRenaming(item);
            } else {
                itemElement.classList.remove('has-text');
            }
            // Update the bounding box
            this.updateItemBoundingBox(itemElement);
        }
    }
    
    onItemMouseDown(e, item) {
        if (this.isRenaming) return;
        
        this.isDragging = true;
        this.selectItem(item);
        
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        const rect = itemElement.getBoundingClientRect();
        
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;
        
        const onMouseMove = (e) => {
            if (!this.isDragging) return;
            
            const canvasRect = this.canvas.getBoundingClientRect();
            let newX = e.clientX - canvasRect.left - this.dragOffsetX;
            let newY = e.clientY - canvasRect.top - this.dragOffsetY;
            
            // Keep the item within the canvas bounds
            newX = Math.max(0, Math.min(newX, canvasRect.width - item.width));
            newY = Math.max(0, Math.min(newY, canvasRect.height - item.height));
            
            itemElement.style.left = `${newX}px`;
            itemElement.style.top = `${newY}px`;
            
            // Update the item's position in the data
            item.x = newX;
            item.y = newY;
        };
        
        const onMouseUp = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    

    selectItem(item) {
        this.deselectAll();
        this.selectedItem = item;
        
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        if (itemElement) {
            itemElement.classList.add('selected');
        }
    }
    
    deselectAll() {
        this.selectedItem = null;
        document.querySelectorAll('.canvasItem.selected').forEach(el => {
            el.classList.remove('selected');
        });
    }
    
    startRenaming(item) {
        if (this.isRenaming) return;
        
        this.isRenaming = true;
        this.selectItem(item);
        
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        const nameElement = itemElement.querySelector('.itemName');
        
        // Create input element
        const input = document.createElement('input');
        input.className = 'renameInput';
        input.value = item.name;
        input.style.width = `${item.width}px`;
        
        // Position the input
        const rect = itemElement.getBoundingClientRect();
        const nameRect = nameElement.getBoundingClientRect();
        
        input.style.left = `${nameRect.left - rect.left}px`;
        input.style.top = `${nameRect.top - rect.top}px`;
        
        // Handle input events
        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
                this.finishRenaming();
            } else if (e.key === 'Escape') {
                this.cancelRenaming();
            }
        });
        
        // Hide the name element and add the input
        nameElement.style.visibility = 'hidden';
        itemElement.appendChild(input);
        input.focus();
        input.select();
    }
    
    finishRenaming() {
        if (!this.isRenaming || !this.selectedItem) return;
        
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${this.selectedItem.id}"]`);
        const input = itemElement.querySelector('.renameInput');
        const nameElement = itemElement.querySelector('.itemName');
        
        if (input && input.value.trim()) {
            // Update the item name
            this.selectedItem.name = input.value.trim();
            nameElement.textContent = this.selectedItem.name;
        }
        
        // Clean up
        nameElement.style.visibility = 'visible';
        if (input) input.remove();
        this.isRenaming = false;

        // Update the bounding box
        this.updateItemBoundingBox(itemElement);
    }
    
    cancelRenaming() {
        if (!this.isRenaming || !this.selectedItem) return;
        
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${this.selectedItem.id}"]`);
        const input = itemElement.querySelector('.renameInput');
        const nameElement = itemElement.querySelector('.itemName');
        
        // Clean up without saving
        nameElement.style.visibility = 'visible';
        if (input) input.remove();
        this.isRenaming = false;
    }
    
    removeItem(item) {
        // Remove the item from the DOM
        const itemElement = document.querySelector(`.canvasItem[data-item-id="${item.id}"]`);
        if (itemElement) {
            itemElement.remove();
        }
        
        // Remove the item from the data
        this.items = this.items.filter(i => i.id !== item.id);
        
        // Deselect
        this.selectedItem = null;
    }
    
    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas? All items will be removed.')) {
            // Remove all items from the DOM
            document.querySelectorAll('.canvasItem').forEach(el => el.remove());
            
            // Clear the items array
            this.items = [];
            this.selectedItem = null;
        }
    }
    
    savePlot() {
        const data = {
            items: this.items,
            nextId: this.nextId,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            showGrid: this.showGrid,
            gridSize: this.gridSize
        };
        
        const json = JSON.stringify(data);
        localStorage.setItem('stagePlotData', json);
        
        alert('Stage plot saved successfully!');
    }
    
    loadPlot() {
        const json = localStorage.getItem('stagePlotData');
        if (!json) {
            alert('No saved stage plot found.');
            return;
        }
        
        try {
            const data = JSON.parse(json);
            
            // Clear current items
            document.querySelectorAll('.canvasItem').forEach(el => el.remove());
            
            // Load the saved items
            this.items = data.items;
            this.nextId = data.nextId || this.items.length + 1;
            
            // Load canvas settings if available
            if (data.canvasWidth) {
                this.canvasWidth = data.canvasWidth;
                this.canvas.style.width = `${this.canvasWidth}px`;
                
                // Update input value if control exists
                const widthInput = this.canvasContainer.querySelector('.canvasControls input[type="number"]:nth-child(1)');
                if (widthInput) widthInput.value = this.canvasWidth;
            }
            
            if (data.canvasHeight) {
                this.canvasHeight = data.canvasHeight;
                this.canvas.style.height = `${this.canvasHeight}px`;
                
                // Update input value if control exists
                const heightInput = this.canvasContainer.querySelector('.canvasControls input[type="number"]:nth-child(1)');
                if (heightInput) heightInput.value = this.canvasHeight;
            }
            
            if (data.showGrid !== undefined) {
                this.showGrid = data.showGrid;
                
                // Update checkbox if control exists
                const gridCheckbox = this.canvasContainer.querySelector('.canvasControls input[type="checkbox"]');
                if (gridCheckbox) gridCheckbox.checked = this.showGrid;
            }
            
            if (data.gridSize) {
                this.gridSize = data.gridSize;
                
                // Update input value if control exists
                const gridSizeInput = this.canvasContainer.querySelector('.canvasControls input[type="number"]:nth-child(2)');
                if (gridSizeInput) gridSizeInput.value = this.gridSize;
            }
            
            // Update grid
            this.updateGrid();
            
            // Render all items
            this.items.forEach(item => this.renderItem(item));
            
            alert('Stage plot loaded successfully!');
        } catch (error) {
            console.error('Error loading stage plot:', error);
            alert('Error loading stage plot. Please try again.');
        }
    }

    updateLibraryHeight() {
        const libraryPanel = document.querySelector('.libraryPanel');
        const canvasPanel = document.querySelector('.canvasContainer');
        console.log (`Library Panel is ${libraryPanel} and canvas panel is ${canvasPanel}`)
        if (libraryPanel && canvasPanel) {
            //set the max height of the library to the canvas - 100
            libraryPanel.style.height = `${canvasPanel.clientHeight - 32}px`;
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const stagePlot = new StagePlot();
});
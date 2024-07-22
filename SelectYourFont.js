// JS file for SelectYourFont

const fontDisplay = document.querySelector('#font-display');
const sampleTextElement = document.querySelector('#sample-text');
const sampleTextInput = document.querySelector('#sample-text-input');
const btn = document.querySelector('#click-btn');
const fontInput = document.querySelector('#font-input');
const fontList = document.querySelector('#font-list');
const favoritesList = document.querySelector('#favorites-list');
const favoriteBtn = document.querySelector('#favorite-btn');
const userInput = document.querySelector('#user-input');
const userTextElement = document.querySelector('#user-text');
let currentFont = '';

// List of available fonts
const fonts = [
    'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Lucida Console', 'Lucida Sans Unicode', 
    'Palatino Linotype', 'Tahoma', 'Pacifico', 'Roboto', 'Lobster', 'Raleway', 'Dancing Script', 'Great Vibes', 'Open Sans', 'Oswald', 
    'Montserrat', 'Poppins', 'Merriweather', 'Ubuntu', 'Playfair Display', 'PT Sans', 'Cabin', 'Indie Flower', 'Lora', 'Nunito', 
    'Anton', 'Baloo 2', 'Cookie', 'Fjalla One', 'Kalam', 'Quicksand', 'Sacramento', 'Shadows Into Light', 'Teko', 'Zilla Slab', 
    'Chewy', 'Comfortaa', 'Fredoka One', 'Gloria Hallelujah', 'Permanent Marker', 'Press Start 2P', 'Satisfy', 'Space Mono', 'Varela Round'
];

// Function to get a random font from the list
function getRandomFont() {
    const randomIndex = Math.floor(Math.random() * fonts.length);
    return fonts[randomIndex];
}

// Function to change the font display
function changeFontDisplay(font) {
    sampleTextElement.style.fontFamily = font;
    userInput.style.fontFamily = font;
    currentFont = font;
    favoriteBtn.classList.remove('active');
}

// Function to update the sample text
function updateSampleText(text) {
    sampleTextElement.textContent = text;
}

// Function to add a font to favorites
function addFavoriteFont(font) {
    if (!isFontInFavorites(font)) {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.setAttribute('draggable', true);

        const fontName = document.createElement('span');
        fontName.textContent = font;
        fontName.className = 'font-name'; // Add a class for easier styling if needed
        fontName.style.fontFamily = font; // Apply the font to the text
        fontName.addEventListener('click', () => {
            changeFontDisplay(font);
            fontInput.value = font; // Update the search bar with the favorite font name
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the font change when deleting
            favoritesList.removeChild(favoriteItem);
            saveFavoritesToLocalStorage();
        });

        favoriteItem.appendChild(fontName);
        favoriteItem.appendChild(deleteBtn);
        favoriteItem.addEventListener('click', () => {
            changeFontDisplay(font);
            fontInput.value = font;
        });

        favoritesList.appendChild(favoriteItem);

        // Add event listeners for drag-and-drop
        favoriteItem.addEventListener('dragstart', handleDragStart);
        favoriteItem.addEventListener('dragover', handleDragOver);
        favoriteItem.addEventListener('dragleave', handleDragLeave);
        favoriteItem.addEventListener('drop', handleDrop);
        favoriteItem.addEventListener('dragend', handleDragEnd);

        saveFavoritesToLocalStorage();
    }
}

// Function to check if a font is already in favorites
function isFontInFavorites(font) {
    const favoriteItems = document.querySelectorAll('.favorite-item span');
    for (let item of favoriteItems) {
        if (item.textContent === font) {
            return true;
        }
    }
    return false;
}

// Function to save favorites to local storage
function saveFavoritesToLocalStorage() {
    const favorites = [];
    document.querySelectorAll('.favorite-item span').forEach(item => {
        favorites.push(item.textContent);
    });
    localStorage.setItem('favoriteFonts', JSON.stringify(favorites));
}

// Function to load favorites from local storage
function loadFavoritesFromLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem('favoriteFonts'));
    if (favorites) {
        favorites.forEach(font => {
            addFavoriteFont(font);
        });
    }
}

// Event handler for the button click to get a random font
btn.onclick = () => {
    const randomFont = getRandomFont();
    changeFontDisplay(randomFont);
    fontInput.value = randomFont; // Update the font search bar with the selected random font
}

// Event handler for font input change
fontInput.oninput = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredFonts = fonts.filter(font => font.toLowerCase().includes(query));
    fontList.innerHTML = '';
    filteredFonts.forEach(font => {
        const fontOption = document.createElement('div');
        fontOption.textContent = font;
        fontOption.style.fontFamily = font;
        fontOption.className = 'font-option';
        fontOption.onclick = () => {
            changeFontDisplay(font);
            fontInput.value = font;
            fontList.style.display = 'none';
        };
        fontList.appendChild(fontOption);
    });
    fontList.style.display = filteredFonts.length ? 'block' : 'none';
};

// Show the font list when the input field is clicked
fontInput.addEventListener('click', () => {
    const query = fontInput.value.toLowerCase();
    const filteredFonts = fonts.filter(font => font.toLowerCase().includes(query));
    fontList.innerHTML = '';
    filteredFonts.forEach(font => {
        const fontOption = document.createElement('div');
        fontOption.textContent = font;
        fontOption.style.fontFamily = font;
        fontOption.className = 'font-option';
        fontOption.onclick = () => {
            changeFontDisplay(font);
            fontInput.value = font;
            fontList.style.display = 'none';
        };
        fontList.appendChild(fontOption);
    });
    fontList.style.display = 'block';
});

// Optionally, hide the font list when clicking outside of it
document.addEventListener('click', (event) => {
    if (!fontInput.contains(event.target) && !fontList.contains(event.target)) {
        fontList.style.display = 'none';
    }
});

// Event handler for sample text input change
sampleTextInput.oninput = (event) => {
    const text = event.target.value;
    updateSampleText(text);
}

// Event handler for user input change
userInput.oninput = (event) => {
    const text = event.target.value;
    userTextElement.textContent = text;
}

// Event handler for adding the current font to favorites
favoriteBtn.onclick = () => {
    addFavoriteFont(currentFont);
    favoriteBtn.classList.add('active');
}

// Drag-and-drop event handlers
let draggingElement;

function handleDragStart(event) {
    draggingElement = event.target;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const targetElement = event.target.closest('.favorite-item');
    if (targetElement && targetElement !== draggingElement) {
        targetElement.classList.add('dragover');
    }
}

function handleDragLeave(event) {
    const targetElement = event.target.closest('.favorite-item');
    if (targetElement) {
        targetElement.classList.remove('dragover');
    }
}

function handleDrop(event) {
    event.preventDefault();
    const targetElement = event.target.closest('.favorite-item');
    if (targetElement && targetElement !== draggingElement) {
        targetElement.classList.remove('dragover');
        const bounding = targetElement.getBoundingClientRect();
        const offset = bounding.y + (bounding.height / 2);
        const nextSibling = (event.clientY - offset > 0) ? targetElement.nextElementSibling : targetElement;
        favoritesList.insertBefore(draggingElement, nextSibling);
        saveFavoritesToLocalStorage();
    }
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    const items = favoritesList.querySelectorAll('.favorite-item');
    items.forEach(item => item.classList.remove('dragover'));
}

// Apply drag-and-drop functionality to existing items (if any)
document.querySelectorAll('.favorite-item').forEach(item => {
    item.setAttribute('draggable', true);
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
});

// Load favorites from local storage on page load
window.onload = loadFavoritesFromLocalStorage;
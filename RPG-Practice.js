// Initialize Variables
let self = {
    level: 1,
    xp: 0,
    nextXp: 20,
    battleStats: {
      strength: 5,
      defense: 5,
      health: 25,
      maxHealth: 25
    },
    gold: 20
}
class Button {
    
}

class Item {
  constructor(name, type, number = 1, stackable = false){
    this.name = name;
    this.type = type;
    this.number = number;
    this.stackable = stackable;
  }
}
/*
const item = {
  name: yaddaYadda,
  type: weapons, items, miscellanous,
  number: (If it is stackable, else x1),
  stackable: boolean (Can it be stacked or not?)
};
*/
let gold = 20;
let inventory = ["Sword", "Shield", "Potion", "Elixir", "Staff", "Dagger"];
const maxInventory = 20;

const experienceCurveAdjustments = () => {
    const expRequired = 10 * (self.level ** 2) * ((Math.exp(-0.01)) ** self.level);
    
    self.nextXp = expRequired - self.exp;
}
experienceCurveAdjustments();
// Initialize Weapons
const weaponList = [
    { name: "Wooden stick", strength: 2, cost: 0},
    { name: "Bronze dagger", strength: 5, cost: 15},
    { name: "poor man's axe", strength: 6, cost: 16},
    { name: "Jigman's Spear", strength: 7, cost: 18},
    { name: "Bronze sword", strength: 8, cost: 24},
    { name: "silver sword", strength: 12, cost: 35}
]

const armorList = [
  { name: "bronze chestplate", defense: 5},
  { name: "bronze shoulder platings", defense: 3}
]

//Begins Game Function
const beginGame = () => {
  update(locations[1]);
}

const locations = [
  {
    name: "startmenu",
    "button text": ["Begin game", "", "", ""],
    "button functions": [beginGame, null, null, null],
    "button style display": ["inline", "none", "none", "none"],
    text: "Welcome to the RPG test game. I'm currently building something in the moment, so just hang tight and enjoy. Take a look around if you want.",
    colorPalette: () => {
      document.querySelector(':root').style.setProperty('--page-background', '#444');
      document.querySelector(':root').style.setProperty('--textbox-color', '#090');
      document.querySelector(':root').style.setProperty('--game-text', "#fff");
    }
  },  
  {
    name: "overworld",
    "button text": ["Go to menu", "Go to Store", "Go to Home", "Go to Forest"],
    "button functions": [goMenu, goStore, goHome, goForest],
    "button style display": ['inline', 'inline', 'inline', 'inline'],
    text: "Welcome back to the overworld.",
    colorPalette: () => {
      document.querySelector(':root').style.setProperty('--page-background', '#768769');
      document.querySelector(':root').style.setProperty('--textbox-color', '#070');
      document.querySelector(':root').style.setProperty('--game-text', "#fff");

    }
  },
  {
    name: "menu",
    "button text": ["Check Stats", "Check Inventory", "Exit Menu", ""],
    "button functions": [checkStats, checkInventory, backToPlay, null],
    "button style display": ['inline', 'inline', 'inline', 'none'],
    text: "This is the menu screen.",
    colorPalette: () => {
      document.querySelector(':root').style.setProperty('--page-background', '#253428');
      document.querySelector(':root').style.setProperty('--textbox-color', '#545');
      document.querySelector(':root').style.setProperty('--game-text', "#fff");

    }

  },
  {
    name: "store",
    "button text": ["Buy Items", "Buy Weapons", "Sell", "Exit Store"],
    "button functions": [buyItems, buyWeapons, sellStuff, backToPlay],
    "button style display": ['inline', 'inline', 'inline', 'inline'],
    text: "Welcome to the Store. What do you want to do?",
    colorPalette: () => {
      document.querySelector(':root').style.setProperty('--page-background', '#a09050');
      document.querySelector(':root').style.setProperty('--textbox-color', '#a09000');
      document.querySelector(':root').style.setProperty('--game-text', "#000");

    }
  }
]

// Initialize query Selectors (pointers)
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const shortStats = document.querySelector('#short-stats');
const battleStats = document.querySelector('#battle-stats');
const strengthText = document.getElementById('strength-text');
const defenseText = document.getElementById('defense-text');
const xpText = document.querySelector('#xpText'); 
const levelText = document.querySelector('#levelText');
const goldText = document.querySelector('#goldText');
const inventorySection = document.querySelector('#inventory');
const inventoryList = document.querySelector('#inventory-list');
const storeSection = document.querySelector("#store-section");

// Initialize buttons
button1.onclick = goMenu;
button2.onclick = goStore;
button3.onclick = goHome;
button4.onclick = goForest;

const renderStats = () => {
    document.getElementById("health-text").textContent = self.battleStats.health;
    document.getElementById("max-health-text").textContent = self.battleStats.maxHealth;
    xpText.textContent = self.xp;
    levelText.textContent = self.level;
    strengthText.textContent = self.battleStats.strength;
    defenseText.textContent = self.battleStats.defense;
    goldText.textContent = self.gold;
}


function update(location){
    renderButtons(location);
    text.innerHTML = `<strong>${location.text}</strong>`;
    location.colorPalette();
    renderStats();
}

/* NEW TODO: Try to find a way to dynamically render buttons */
const renderButtons = (location) => {
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button4.innerText = location["button text"][3];
    button1.style.display = location["button style display"][0];
    button2.style.display = location["button style display"][1];
    button3.style.display = location["button style display"][2];
    button4.style.display = location["button style display"][3];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    button4.onclick = location["button functions"][3];
};

/*

*/
function goMenu(){
    update(locations[2]);
    
    if (!inventoryList.classList.contains('hide')){
        hideInventory();
    }
    shortStats.style.display = 'block';
    battleStats.style.display = 'none';
    inventorySection.style.display = 'none';
    
}

function checkStats(){
    battleStats.style.display = 'block';
    button1.innerText = "Exit Stats";
    button2.style.display = 'none';
    button3.style.display = 'none';
    button4.style.display = 'none';
    button1.onclick = goMenu;
}


const numCols = 2;
const columnSize = Math.floor(maxInventory / numCols);
console.log(columnSize);

// INVENTORY SECTION

function checkInventory(){
    inventorySection.style.display = 'block';
    button1.innerText = "Exit Inventory";
    button2.style.display = 'none';
    button3.style.display = 'none';
    button4.style.display = 'none';
    button1.onclick = goMenu;

    renderInventory();
    
     for (let i = 0; i < inventory.length; i++){
        const columnId = Math.floor(i / columnSize) + 1;
        const HTMLStringItem = `
             <span class="inventory-item" id="item-${i + 1}">${inventory[i]}</span>
         `;
        const location = `#list-column-${columnId} #inventory-item-${(i + 1)}`;
        const inventoryItem = document.querySelector(location);
        inventoryItem.insertAdjacentHTML("beforeend", HTMLStringItem);
     }
    
 }

const renderInventory = () => {
    inventoryList.classList.toggle('hide');
    for (let i = 0; i < numCols; i++){
        const columnHTML = `<div class="list-column" id="list-column-${i + 1}">
        
        </div>`;
        inventoryList.insertAdjacentHTML("beforeend", columnHTML);
        const columnPointer = document.querySelector(`#list-column-${i + 1}`);

        for (let j = 0; j < columnSize; j++){
            const itemHTML = `<div class="list-item" id="inventory-item-${j + 1}"></div>`;
            columnPointer.insertAdjacentHTML("beforeend", itemHTML);
        }
    }
}

function hideInventory(){
    for (let i = 0; i < inventory.length; i++){
        
        const inventoryItem = document.querySelector(`#inventory-item-${i + 1}`);
        inventoryItem.innerHTML = "";
    }
    inventoryList.innerHTML = "";
    inventoryList.classList.toggle('hide');
}


// GAMEPLAY SECTION

function backToPlay(){
    shortStats.style.display = 'none';
    storeSection.style.display = 'none';
    update(locations[1]);
}

// STORE SECTION

function goStore(){
    console.log("Going to store.");
    storeSection.style.display = 'block';
    update(locations[3]);
}

function buyItems() {
    console.log("Buying items.");
}

function buyWeapons() {
    console.log("Buying weapons and defenses.");
    storeSection.insertAdjacentHTML("beforeend", `
        <div id="weapons-section">
            
        </div>
    `);
    const weaponsSection = document.getElementById('weapons-section');
    for (let i = 0; i < 8; i++){
        weaponsSection.insertAdjacentHTML("beforeend", `
                
        `);
    }
}
function sellStuff() {
    console.log("Selling stuff.");
}

function goHome(){
    console.log("Going home.");
}

function goForest(){
    console.log("Going to Forest.");
}


//Starts the Game Up
update(locations[0]);
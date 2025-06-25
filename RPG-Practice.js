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
    gold: 20,
    inventory: ["Sword", "Shield", "Potion", "Elixir", "Staff", "Dagger"]
}

// All DOM references of the player's stats.
const statSelectors = {
  strengthText: document.getElementById('strength-text'),
  defenseText: document.getElementById('defense-text'),
  xpText: document.querySelector('#xpText'), 
  levelText: document.getElementById('level-text'),
  goldText: document.getElementById('gold-text'),
  healthText: document.getElementById('health-text'),
  maxHealthText: document.getElementById('max-health-text')
};

// All DOM references to the games's dynamic section.
const sectionSelectors = {
  shortStats: document.getElementById('short-stats'),
  battleStats: document.getElementById('battle-stats'),
  controlSection: document.getElementById('controls'),
  inventorySection: document.getElementById('inventory'),
  inventoryList: document.getElementById('inventory-list'),
  storeSection: document.getElementById("store-section")
}

// HTML references
const rootPointer = document.querySelector(":root");

// The blueprint for a button in the control section.
class Button {
  constructor(id, btnFunction, btnLabel, additionalStyles = ""){
    this.id = id;
    this.btnFunction = btnFunction;
    this.btnLabel = btnLabel;
    this.additionalStyles = additionalStyles;
  }
  renderBtn(){
    return `
      <button id="${this.id}" ${this.additionalStyles ? `style="${this.additionalStyles}"` : ""}>${this.btnLabel}</button>
    `;
  }
  getFunction(){
    return this.btnFunction;
  }
  getID(){
    return this.id;
  }
}

// Blueprint for each item.
class Item {
  constructor(name, type, number = 1, stackable = false){
    this.name = name;
    this.type = type;
    this.number = number;
    this.stackable = stackable;
  }
}

// Sample inventory.
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

// Helper Function
function cleanControls() {
  sectionSelectors.controlSection.innerHTML = "";
}

// Locations/Rooms Array
const locationSet = [
  {
    name: "startmenu",
    buttons: [new Button("start", beginGame, "BEGIN GAME", "display: block; margin: auto;")],
    text: "Welcome to the RPG test game. I'm currently building something in the moment, so just hang tight and enjoy. Take a look around if you want.",
    colorPalette: () => {
      rootPointer.style.setProperty('--page-background', '#444');
      rootPointer.style.setProperty('--textbox-color', '#090');
      rootPointer.style.setProperty('--game-text', "#fff");
    }
  },  
  {
    name: "overworld",
    buttons: [
      new Button("go-menu", goMenu, "Go to menu"),
      new Button("go-store", goStore, "Go to Store"),
      new Button("go-home", goHome, "Go to Home"),
      new Button("go-forest", goForest, "Go to Forest")
    ],
    text: "Welcome back to the overworld.",
    colorPalette: () => {
      rootPointer.style.setProperty('--page-background', '#768769');
      rootPointer.style.setProperty('--textbox-color', '#070');
      rootPointer.style.setProperty('--game-text', "#fff");

    }
  },
  {
    name: "menu",
    buttons: [
      new Button('check-stats', checkStats, "Check Stats"),
      new Button('check-inventory', checkInventory, "Check Inventory"),
      new Button('exit-menu', backToPlay, "Exit Menu")
    ],
    text: "This is the menu screen.",
    colorPalette: () => {
      document.querySelector(':root').style.setProperty('--page-background', '#253428');
      document.querySelector(':root').style.setProperty('--textbox-color', '#545');
      document.querySelector(':root').style.setProperty('--game-text', "#fff");
    }
  },
  {
    name: "store",
    buttons: [
      new Button('buy-items', buyItems, "Buy Items"),
      new Button('buy-weapons', buyWeapons, "Buy Weapons"),
      new Button('sell', sellStuff, "Sell"),
      new Button('exit-store', backToPlay, "Exit Store")
    ],
    text: "Welcome to the Store. What do you want to do?",
    colorPalette: () => {
      document.querySelector(':root').style.setProperty('--page-background', '#a09050');
      document.querySelector(':root').style.setProperty('--textbox-color', '#a09000');
      document.querySelector(':root').style.setProperty('--game-text', "#fff");

    }
  }
];

function renderStats() {
    statSelectors.healthText.textContent = self.battleStats.health;
    statSelectors.maxHealthText.textContent = self.battleStats.maxHealth;
    statSelectors.xpText.textContent = self.xp;
    statSelectors.levelText.textContent = self.level;
    statSelectors.strengthText.textContent = self.battleStats.strength;
    statSelectors.defenseText.textContent = self.battleStats.defense;
    statSelectors.goldText.textContent = self.gold;
}


function update(location){
    renderButtons(location);
    text.innerHTML = `<strong>${location.text}</strong>`;
    location.colorPalette();
    renderStats();
}

// Dynamically renders the base buttons of the location.
function renderButtons(location) {

  // Clean Control Section First
  sectionSelectors.controlSection.innerHTML = "";
  for (let i = 0; i < location.buttons.length; i++){
    sectionSelectors.controlSection.innerHTML += location.buttons[i].renderBtn();
  };
  for (let i = 0; i < location.buttons.length; i++){
    document.getElementById(location.buttons[i].getID()).addEventListener("click", location.buttons[i].getFunction());
  }
};

function goMenu(){
    update(locationSet[2]);
    
    if (!sectionSelectors.inventoryList.classList.contains('hide')){
        hideInventory();
    }
    showSection(sectionSelectors.shortStats);
    hideSection(sectionSelectors.battleStats, "hide");
    hideSection(sectionSelectors.inventorySection, "hide");
}

function checkStats(){
    sectionSelectors.battleStats.classList.toggle("hide");
    cleanControls();
  
    const button = new Button("exit-stats", goMenu, "Exit Stats");
    sectionSelectors.controlSection.innerHTML = button.renderBtn();
    document.getElementById(button.getID()).onclick = goMenu;
   console.log("Yes.");
}


const numCols = 2;
const columnSize = Math.floor(maxInventory / numCols);
console.log(columnSize);

// INVENTORY SECTION

function checkInventory() {
    showSection(sectionSelectors.inventorySection);
  
    cleanControls();
    const button = new Button("exit-inventory", goMenu, "Exit Inventory");
    sectionSelectors.controlSection.innerHTML = button.renderBtn();
    document.getElementById(button.getID()).onclick = button.getFunction();

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

function renderInventory() {
    showSection(sectionSelectors.inventoryList);
    for (let i = 0; i < numCols; i++){
        const columnHTML = `<div class="list-column" id="list-column-${i + 1}">
        
        </div>`;
        sectionSelectors.inventoryList.insertAdjacentHTML("beforeend", columnHTML);
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
  sectionSelectors.inventoryList.innerHTML = "";
  hideSection(sectionSelectors.inventoryList); 
}


// GAMEPLAY SECTION

function backToPlay(){
    hideSection(sectionSelectors.shortStats);
    hideSection(sectionSelectors.storeSection);
    
    update(locationSet[1]);
} 

// STORE SECTION

function goStore(){
  sectionSelectors.storeSection.classList.toggle('hide');
  update(locationSet[3]);
}

function buyItems() {
    console.log("Buying items.");
}

function buyWeapons() {
    console.log("Buying weapons and defenses.");
    sectionSelectors.storeSection.insertAdjacentHTML("beforeend", `
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

function renderList(sectionID, parentSection,) {
  parentSection.insertAdjacentHTML("beforeend", `
    <div id="${sectionID}">
    </div>
  `);
}
function hideSection(sectionReference){
  if (!sectionReference.classList.contains("hide")){
    sectionReference.classList.toggle("hide");
  }
}
function showSection(sectionReference){
  if (sectionReference.classList.contains("hide")){
    sectionReference.classList.toggle("hide");
  }
}


//Starts the Game Up
update(locationSet[0]);

//Begins Game Function
function beginGame() {
  update(locationSet[1]);
}

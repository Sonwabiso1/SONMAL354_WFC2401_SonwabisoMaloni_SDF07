// Import necessary functions from Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase configuration
const appSettings = {
    databaseURL: "https://realtime-database-579b5-default-rtdb.europe-west1.firebasedatabase.app/"
}

// Initialize Firebase app
const app = initializeApp(appSettings)

// Get a reference to the Firebase database
const database = getDatabase(app)

// Reference to the "shoppingList" node in the database
const shoppingListInDB = ref(database, "shoppingList")

// DOM elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Event listener for the "Add" button
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    // Check if input value is empty
    if (inputValue.trim() =="") {
        inputFieldEl.placeholder = "⚠️can't add empty text"
        return
    }
    inputFieldEl.placeholder = "bread"
    
    // Add item to the shopping list in the database
    push(shoppingListInDB, inputValue)
    
    // Clear input field
    clearInputFieldEl()
})

// Listen for changes in the shopping list in the database
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        // Convert snapshot to array of items
        let itemsArray = Object.entries(snapshot.val())
    
        // Clear the shopping list
        clearShoppingListEl()
        
        // Iterate through each item and append it to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        // If no items exist, display a message
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Function to clear the shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function to append an item to the shopping list
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    // Create a new list item element
    let newEl = document.createElement("li")
    
    // Set the text content of the new element to the item value
    newEl.textContent = itemValue
    
    // Add event listener to remove item from the shopping list when clicked
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    // Append the new element to the shopping list
    shoppingListEl.append(newEl)
}
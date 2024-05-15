// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const label = document.getElementById('message');

let items = [
    {
        id: 1,
        name: 'Apple',
        price: 0.99,
    },
    {
        id: 2,
        name: 'Watermelon',
        price: 10,
    },
    {
        id: 3,
        name: 'Strawberries',
        price: 12,
    },
];

let cart = [];


// An example function that creates HTML elements using the DOM.
function fillItemsGrid(items) {
    for (const item of items) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="images/${item.name.toLowerCase()}.webp" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);
    }
}

// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
  modal.classList.toggle('show-modal');
}

// Call fillItemsGrid function when page loads
fillItemsGrid(items);

// Example of DOM methods for adding event handling
cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);

// Function to update the cart badge
function updateCartBadge() {
    let totalItems = 0;
    for(let index in cart) {
        totalItems += cart[index].quantity; // Assuming each item has a 'quantity' property
    }
    
    cartBadge.textContent = totalItems; // Update the cart badge text content
}

function addItemToCart(id) {
    let selectedItem = items.find((item) => item.id === id); 
    let search = cart.find((item) => item.id === id);  

    if (search === undefined) {
        cart.push({
            id: selectedItem.id,
            quantity: 1,
        });
    } else {
        search.quantity += 1;
    }

    console.log(cart);
    updateCartBadge();
}

// Function to display an item in the cart modal
function addItemToCartModal(item) {

     // Clear the cartItemsList to ensure only the current cart state is displayed
     cartItemsList.innerHTML = "";
     label.innerHTML = "";
    // Display the item in the cart modal with its updated quantity
    if (cart.length!== 0) {
        buyButton.disabled = false;
        cart.forEach((x) => {  // Iterate over each item in the cart
            let { id, quantity } = x;  // Destructure id and item from the cart item
            let search = items.find((y) => y.id === id) || {}; // Find the corresponding item in the items array
            
            // Create a new div element for each cart item
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item'; // Set the class name
    
            // Set the inner HTML of the div
            itemDiv.innerHTML = `
                <p>${search.name}</p> 
                <p>Quantity: ${quantity}</p>
                <p>$ ${search.price.toFixed(2)}</p>  
                <button class ="decrement-btn" onclick="decrementQuantityInCart(${search.id})">-1</button>
            `;
    
            // Append the newly created div to the cartItemsList
            cartItemsList.appendChild(itemDiv);
        });
    }
  
}
// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get the search input element
    const searchInput = document.getElementById('searchInput');

    // Function to filter items based on the search query
    function filterItems(query) {
        // Filter the items array based on the query
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        itemsGrid.innerHTML = '';

        // Display the filtered items
        console.log(filterItems)
        fillItemsGrid(filteredItems);
        addToCart();
    }

    // Listen for input events on the search input
    searchInput.addEventListener('input', function() {
        // Call the filterItems function with the current input value
        filterItems(searchInput.value);
    });

    function addToCart() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

        // Attach event listeners to "Add to Cart" buttons
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                //event.preventDefault();
                const itemId = parseInt(button.dataset.id, 10);
                const item = items.find(i => i.id === itemId);
                addItemToCart(itemId);
                addItemToCartModal(item);
                totalAmount();
            });
        });

    }

    addToCart();
    cartItemsList.innerHTML = ""; // Clear the cartItemsList
    label.innerHTML = `<h2>Cart is Empty</h2>`;
    buyButton.disabled = true;

});

let totalAmount = () => {
    if (cart.length !== 0) {
        let amount = cart
            .map((x) => {
                let { id, quantity } = x;
                let filterData = items.find((x) => x.id === id);
                return filterData.price * quantity;
            })
            .reduce((x, y) => x + y, 0);
        
        return (cartTotal.innerHTML = `$ ${amount.toFixed(2)}`);
    } else return;
};

let buyItemsInCart = () => {
    cart= [];
    updateCartBadge();
    cartItemsList.innerHTML = "";
    label.innerHTML ="Successful purchase!";
    cartTotal.innerHTML = `$0`;
    buyButton.disabled = true;
}

buyButton.addEventListener('click', buyItemsInCart);


let decrementQuantityInCart = (id) => {
    let selectedItem = items.find((item) => item.id === id);
    let search = cart.find((x) => x.id === selectedItem.id);
    
    if (search === undefined) return;
    else if (search.quantity === 0) return;
    else {
        search.quantity -= 1;
        const cartBadge = document.querySelector('.cart-badge');
        cartBadge.innerHTML = cart.map((x) => x.quantity).reduce((x, y) => x + y, 0); 
        console.log(cart);
        totalAmount();
    }
    // Filter out items with quantity 0
    cart = cart.filter((x) => x.quantity > 0);
    // Refresh the cart display
    generateCartItems();
};

let generateCartItems = () => {
    if (cart.length!== 0) {
        cartItemsList.innerHTML = ""; // Clear existing cart items
        cart.forEach((x) => {
            let { id, quantity } = x;
            let search = items.find((y) => y.id === id) || [];
            cartItemsList.innerHTML += `
                <div class="cart-item">
                    <p>${search.name}</p> 
                    <p>Quantity: ${quantity}</p>
                    <p>$ ${search.price.toFixed(2)}</p>  
                    <button class ="decrement-btn" onclick="decrementQuantityInCart(${search.id})">-1</button>
                </div>`;
        });
    }
};


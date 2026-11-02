// This script runs when the page has finished loading
document.addEventListener("DOMContentLoaded", function() {

  var currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "" || currentPage === undefined) {
    currentPage = "index.html";
  }

  var navLinks = document.querySelectorAll("nav a");
  for (var i = 0; i < navLinks.length; i++) {
    var link = navLinks[i];
    if (link.getAttribute("href") === currentPage) {
      link.style.fontWeight = "bold";
      link.style.borderBottom = "2px solid black";
    }
  }

  var form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // stop the page from reloading

      // Clear any old error messages
      var oldErrors = document.querySelectorAll(".error-message");
      for (var e = 0; e < oldErrors.length; e++) {
        oldErrors[e].remove();
      }

      var isValid = true;

      // Get the input fields (they may have slightly different IDs on different pages)
      var fullName = document.getElementById("fullName");
      var email = document.getElementById("email");
      var message = document.getElementById("message");
      var enquiryType = document.getElementById("enquiryType");

      // Check Full Name
      if (fullName && fullName.value.trim() === "") {
        showError(fullName, "Please enter your full name");
        isValid = false;
      }

      // Check Email
      if (email) {
        var emailValue = email.value.trim();
        if (emailValue === "") {
          showError(email, "Please enter your email address");
          isValid = false;
        } else if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1) {
          showError(email, "Please enter a valid email address");
          isValid = false;
        }
      }

      // Check Message
      if (message && message.value.trim() === "") {
        showError(message, "Please write a message");
        isValid = false;
      }

      // Check Enquiry Type (only on enquiry page)
      if (enquiryType && enquiryType.value === "") {
        showError(enquiryType, "Please select what your enquiry is about");
        isValid = false;
      }

      // If everything is correct
      if (isValid) {
        // Show a success message on the page
        var successDiv = document.createElement("div");
        successDiv.style.backgroundColor = "#d4edda";
        successDiv.style.color = "#155724";
        successDiv.style.padding = "15px";
        successDiv.style.marginTop = "20px";
        successDiv.style.borderRadius = "5px";
        successDiv.style.textAlign = "center";
        successDiv.innerHTML = "Thank you! Your message has been received. We will reply within 1-2 working days.";

        form.parentNode.insertBefore(successDiv, form.nextSibling);
        form.reset(); // clear the form

        // Remove the success message after 6 seconds
        setTimeout(function() {
          successDiv.remove();
        }, 6000);
      }
    });
  }

  // Helper function to show error messages under the fields
  function showError(inputElement, message) {
    var error = document.createElement("div");
    error.className = "error-message";
    error.style.color = "red";
    error.style.fontSize = "0.9rem";
    error.style.marginBottom = "10px";
    error.innerHTML = message;
    inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
  }

  // This creates a bigger view of the image when you click on it
  var productImages = document.querySelectorAll(".product-images img, .gallery img");

  for (var j = 0; j < productImages.length; j++) {
    productImages[j].style.cursor = "pointer"; // show hand cursor

    productImages[j].addEventListener("click", function() {
      // Create the dark background
      var overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0,0,0,0.85)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "9999";
      overlay.style.cursor = "pointer";

      // Create the big image
      var bigImg = document.createElement("img");
      bigImg.src = this.src;
      bigImg.style.maxWidth = "90%";
      bigImg.style.maxHeight = "90%";
      bigImg.style.borderRadius = "8px";
      bigImg.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

      overlay.appendChild(bigImg);
      document.body.appendChild(overlay);

      // Close when clicking the dark area
      overlay.addEventListener("click", function() {
        document.body.removeChild(overlay);
      });
    });
  }

  // This is a basic example of dynamic content using JavaScript
  var filterButtons = document.querySelectorAll(".filter-btn");
  if (filterButtons.length > 0) {
    for (var k = 0; k < filterButtons.length; k++) {
      filterButtons[k].addEventListener("click", function() {
        var filter = this.getAttribute("data-filter");
        var items = document.querySelectorAll(".product-item");

        for (var m = 0; m < items.length; m++) {
          if (filter === "all" || items[m].classList.contains(filter)) {
            items[m].style.display = "block";
          } else {
            items[m].style.display = "none";
          }
        }
      });
    }
  }

});

//Shopping Cart Functionality
  // Load the cart from localStorage (or start with empty array)
  var cart = JSON.parse(localStorage.getItem("swvyCart")) || [];

  // Function to update what the user sees in the cart
  function updateCartDisplay() {
    var cartItemsDiv = document.getElementById("cart-items");
    var cartTotalSpan = document.getElementById("cart-total");

    if (!cartItemsDiv) return; // only run on the product page

    // Clear the old list
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalSpan.innerHTML = "0";
      return;
    }

    var total = 0;

    // Show each item in the cart
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      total = total + item.price;

      var itemDiv = document.createElement("div");
      itemDiv.innerHTML = 
        "<span>" + item.name + " - R " + item.price + "</span>" +
        "<button class='remove-btn' data-index='" + i + "' style='background:red;color:white;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;'>Remove</button>";

      cartItemsDiv.appendChild(itemDiv);
    }

    cartTotalSpan.innerHTML = total;

    // Add remove button events
    var removeButtons = document.querySelectorAll(".remove-btn");
    for (var r = 0; r < removeButtons.length; r++) {
      removeButtons[r].addEventListener("click", function() {
        var index = this.getAttribute("data-index");
        cart.splice(index, 1); // remove the item
        localStorage.setItem("swvyCart", JSON.stringify(cart)); // save again
        updateCartDisplay(); // refresh the display
      });
    }
  }

  // Add to Cart buttons
  var addButtons = document.querySelectorAll(".add-to-cart");
  for (var a = 0; a < addButtons.length; a++) {
    addButtons[a].addEventListener("click", function() {
      var name = this.getAttribute("data-name");
      var price = parseInt(this.getAttribute("data-price"));

      // Add the item to the cart array
      cart.push({
        name: name,
        price: price
      });

      // Save the cart in the browser
      localStorage.setItem("swvyCart", JSON.stringify(cart));

      // Update the cart display
      updateCartDisplay();

      // Small feedback for the student
      alert(name + " has been added to your cart!");
    });
  }

  // Checkout button
  var checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add some items first.");
        return;
      }

      var total = 0;
      var summary = "You are checking out the following items:\n\n";

      for (var c = 0; c < cart.length; c++) {
        summary = summary + "- " + cart[c].name + " (R " + cart[c].price + ")\n";
        total = total + cart[c].price;
      }

      summary = summary + "\nTotal: R " + total + "\n\nThank you for shopping at SWVY!";
      alert(summary);

      // Clear the cart after checkout
      cart = [];
      localStorage.setItem("swvyCart", JSON.stringify(cart));
      updateCartDisplay();
    });
  }

  // Show the cart when the page loads
  updateCartDisplay();

    // ========== Dynamic Search ==========
  var searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function() {
      var filter = this.value.toLowerCase();
      var items = document.querySelectorAll(".product-item");

      for (var i = 0; i < items.length; i++) {
        var name = items[i].querySelector("h3").innerText.toLowerCase();
        if (name.indexOf(filter) > -1) {
          items[i].style.display = "";
        } else {
          items[i].style.display = "none";
        }
      }
    });
  }
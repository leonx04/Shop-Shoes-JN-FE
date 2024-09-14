// Function to fetch and display products
function fetchAndDisplayProducts() {
  fetch("http://localhost:8080/api/products/pricing")
    .then((response) => response.json())
    .then((products) => {
      const pricingContainer = document.getElementById("pricingContainer");
      pricingContainer.innerHTML = ""; // Clear existing content

      products.forEach((product) => {
        const productHtml = `
          <div class="col-md-4 d-flex mb-4">
            <div class="pricing-plan p-4 border rounded flex-grow-1 d-flex flex-column">
              <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid mb-3 pricing-image">
              <h3>${product.name}</h3>
              <p class="mb-4">$${product.price}</p>
              <a href="/product-detail/${product.code}" class="btn btn-outline-primary mt-auto">Buy Now <i class="fas fa-shopping-basket"></i></a>
            </div>
          </div>
        `;
        pricingContainer.innerHTML += productHtml; // Append new product
      });
    })
    .catch((error) => console.error("Error fetching pricing data:", error));
}

// Function to handle smooth scrolling and updating URL hash
function scrollToPricing() {
  const pricingElement = document.getElementById("pricing");
  if (pricingElement) {
    // Trigger a reflow to force a new scroll event
    pricingElement.style.display = 'none';
    // Remove the line that triggers reflow
    pricingElement.style.display = '';

    pricingElement.scrollIntoView({ behavior: 'smooth' });

    // Update URL hash
    window.location.hash = "#pricing";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Initial fetch and display of products
  fetchAndDisplayProducts();

  // Set up interval to refresh products every 50 seconds
  setInterval(fetchAndDisplayProducts, 50000);

  // Add event listener for the "Shop Now" button
  const shopNowBtn = document.querySelector('.hero-section .btn-success');
  if (shopNowBtn) {
    shopNowBtn.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToPricing();
      fetchAndDisplayProducts(); // Fetch products immediately when clicking "Shop Now"
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8080/api/products/pricing")
      .then((response) => response.json())
      .then((products) => {
        const pricingContainer = document.querySelector("#pricing .row");
        pricingContainer.innerHTML = ""; // Clear existing content

        products.forEach((product) => {
          const productHtml = `
                <div class="col-md-4 d-flex">
                    <div class="pricing-plan p-4 border rounded flex-grow-1 d-flex flex-column">
                        <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid mb-3 pricing-image">
                        <h3>${product.name}</h3>
                        <p>$${product.price}</p>
                        <a href="${product.code}" class="btn btn-outline-primary mt-auto">Buy Now <i class="fas fa-shopping-basket"></i></a>
                    </div>
                </div>
            `;
          pricingContainer.innerHTML += productHtml;
        });
      })
      .catch((error) =>
        console.error("Error fetching pricing data:", error)
      );
  });
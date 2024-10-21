let products = [];
let filteredProducts = [];
let displayedProductsCount = 0; // Count of displayed products
const sortSelect = document.getElementById("sort");
const productsList = document.getElementById("products-list");
const loadMoreButton = document.getElementById("load-more");

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Failed to fetch products.");
    products = await response.json();
    let totalProducts = products.length;
    console.log(totalProducts);
    filteredProducts = products;
    displayProducts(filteredProducts.slice(0, 10));
    displayedProductsCount = 10;
    const totalProductsElement = document.getElementById("total-products");
    totalProductsElement.innerHTML = `${totalProducts} Results`;
    document.getElementById("loading").style.display = "none";
  } catch (error) {
    console.error(error);
    document.getElementById("loading").innerText = "Failed to load products.";
  }
}

function createProductHTML(product) {
  return `
    <div class="product" onclick="location.href='product-details.html?id=${
      product.id
    }'">
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
    </div>
  `;
}

function displayProducts(productsToDisplay) {
  productsList.innerHTML += productsToDisplay.map(createProductHTML).join("");
}

sortSelect.addEventListener("change", (e) => {
  const sortValue = e.target.value;
  if (sortValue === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    filteredProducts = products;
  }
  displayedProductsCount = 0;
  productsList.innerHTML = "";
  displayProducts(filteredProducts.slice(0, 10));
});

function filterProducts() {
  const selectedCategories = Array.from(
    document.querySelectorAll(".category-filters input:checked")
  ).map((cb) => cb.value);
  const selectedPriceRanges = Array.from(
    document.querySelectorAll(".price-filters input:checked")
  ).map((cb) => cb.value);

  const searchInput = document.getElementById("search").value.toLowerCase();

  filteredProducts = products.filter((product) => {
    const inCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const inPriceRange =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      });
    const matchesSearch = product.title.toLowerCase().includes(searchInput);

    return inCategory && inPriceRange && matchesSearch;
  });

  displayedProductsCount = 0;
  productsList.innerHTML = "";
  displayProducts(filteredProducts.slice(0, 10));
}

function loadMoreProducts() {
  const nextProducts = filteredProducts.slice(
    displayedProductsCount,
    displayedProductsCount + 10
  );
  if (nextProducts.length > 0) {
    displayProducts(nextProducts);
    displayedProductsCount += nextProducts.length;
  } else {
    loadMoreButton.style.display = "none";
  }
}

document.querySelectorAll(".category-filters input").forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});

document.querySelectorAll(".price-filters input").forEach((checkbox) => {
  checkbox.addEventListener("change", filterProducts);
});

document.getElementById("search").addEventListener("input", filterProducts);

loadMoreButton.addEventListener("click", loadMoreProducts);

fetchProducts();

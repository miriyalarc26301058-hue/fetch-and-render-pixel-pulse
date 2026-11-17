const form = document.getElementById("search-form");
const input = document.getElementById("input");
const button = document.getElementById("button");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

// Wikimedia Commons' public API does not require an API key.
async function searchImages(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php" +
    "?action=query&format=json&origin=*&generator=search" +
    "&gsrnamespace=6&gsrlimit=18&gsrsearch=" + encodeURIComponent(query) +
    "&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=640";

  const response = await fetch(url);

  // Do not try to render a failed HTTP response.
  if (!response.ok) {
    throw new Error("Image search request failed: " + response.status);
  }

  const data = await response.json();
  return Object.values(data.query?.pages || {});
}

function renderImages(items, query) {
  results.innerHTML = "";

  if (items.length === 0) {
    results.innerHTML = `
      <div class="empty-state">
        <h3>No images found for “${escapeHtml(query)}”.</h3>
        <p>Try a different word or a broader topic.</p>
      </div>`;
    resultCount.textContent = "0 results";
    return;
  }

  resultCount.textContent = `Showing ${items.length} results for “${query}”`;

  items.forEach((item) => {
    const imageInfo = item.imageinfo?.[0];
    if (!imageInfo?.thumburl && !imageInfo?.url) return;

    const card = document.createElement("article");
    card.className = "image-card";

    // Enhancement: each image links to its full-size original in a new tab.
    const link = document.createElement("a");
    link.className = "image-link";
    link.href = imageInfo.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "Open full-size image in a new tab";

    const image = document.createElement("img");
    image.src = imageInfo.thumburl || imageInfo.url;
    image.alt = item.title.replace(/^File:/, "").replaceAll("_", " ");
    image.loading = "lazy";

    const copy = document.createElement("div");
    copy.className = "card-copy";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = item.title.replace(/^File:/, "").replaceAll("_", " ");

    const meta = document.createElement("p");
    meta.className = "card-meta";
    const width = imageInfo.width;
    const height = imageInfo.height;
    meta.textContent = width && height ? `${width} × ${height} px · Wikimedia Commons` : "Wikimedia Commons";

    copy.appendChild(title);
    copy.appendChild(meta);
    link.appendChild(image);
    link.appendChild(copy);
    card.appendChild(link);
    results.appendChild(card);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) return; // Ignore blank searches; do not call the API.

  button.disabled = true;
  button.textContent = "Searching…";

  try {
    const items = await searchImages(query);
    renderImages(items, query);
  } catch (error) {
    console.error(error);
    resultCount.textContent = "Search could not be completed";
    results.innerHTML = "";
    const message = document.createElement("div");
    message.className = "empty-state";
    message.textContent = "Something went wrong while loading images. Please try again.";
    results.appendChild(message);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Search <span aria-hidden="true">→</span>';
  }
});

// Part 1 quick-pick chips also submit a search.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.query;
    form.requestSubmit();
  });
});

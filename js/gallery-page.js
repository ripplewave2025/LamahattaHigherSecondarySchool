import { galleryCategories, galleryItems } from "./gallery-data.js";
import { refreshIcons } from "./main.js";

const state = {
  filter: "all",
  activeIndex: 0,
  visibleItems: galleryItems
};

function getFilterFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedFilter = params.get("filter");

  return galleryCategories.some((category) => category.id === requestedFilter)
    ? requestedFilter
    : "all";
}

function updateUrl(filter) {
  const url = new URL(window.location.href);

  if (filter === "all") {
    url.searchParams.delete("filter");
  } else {
    url.searchParams.set("filter", filter);
  }

  window.history.replaceState({}, "", url);
}

function renderFilters(container) {
  container.innerHTML = galleryCategories
    .map(
      (category) => `
        <button class="filter-chip${category.id === state.filter ? " is-active" : ""}" type="button" data-filter="${category.id}">
          ${category.label}
        </button>
      `
    )
    .join("");

  container.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      updateUrl(state.filter);
      renderGallery();
    });
  });
}

function renderGrid(container) {
  if (!state.visibleItems.length) {
    container.innerHTML = '<div class="gallery-empty">No photos are mapped to this filter yet.</div>';
    return;
  }

  container.innerHTML = state.visibleItems
    .map(
      (item, index) => `
        <article class="gallery-item${item.featured ? " featured" : ""}">
          <img src="${item.image}" alt="${item.title}" width="800" height="600" loading="lazy" />
          <button type="button" data-gallery-index="${index}">
            <span class="gallery-kicker">${item.category}</span>
            <h3 class="gallery-title">${item.title}</h3>
            <p class="gallery-caption">${item.caption}</p>
          </button>
        </article>
      `
    )
    .join("");

  container.querySelectorAll("[data-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => openLightbox(Number(button.dataset.galleryIndex)));
  });
}

function renderGallery() {
  const filterRow = document.getElementById("galleryFilters");
  const grid = document.getElementById("galleryGrid");
  const count = document.getElementById("galleryCount");

  state.visibleItems =
    state.filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === state.filter);

  renderFilters(filterRow);
  renderGrid(grid);
  count.textContent = `${state.visibleItems.length} moments`;
}

function openLightbox(index) {
  const item = state.visibleItems[index];
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  const title = document.getElementById("lightboxTitle");
  const caption = document.getElementById("lightboxCaption");

  if (!item || !lightbox || !image || !title || !caption) {
    return;
  }

  state.activeIndex = index;
  image.src = item.image;
  image.alt = item.title;
  image.width = 800;
  image.height = 600;
  title.textContent = item.title;
  caption.textContent = item.caption;
  lightbox.classList.add("is-open");
  document.body.classList.add("nav-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");

  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function stepLightbox(direction) {
  if (!state.visibleItems.length) {
    return;
  }

  const nextIndex = (state.activeIndex + direction + state.visibleItems.length) % state.visibleItems.length;
  openLightbox(nextIndex);
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeButton = document.getElementById("lightboxClose");
  const previousButton = document.getElementById("lightboxPrevious");
  const nextButton = document.getElementById("lightboxNext");

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", () => stepLightbox(-1));
  nextButton?.addEventListener("click", () => stepLightbox(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  state.filter = getFilterFromUrl();
  renderGallery();
  initLightbox();
  refreshIcons();
});

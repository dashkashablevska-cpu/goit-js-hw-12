import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img
              class="gallery-image"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
          </a>

          <div class="image-info">
            <div>
              <strong>Likes</strong>
              <span>${likes}</span>
            </div>
            <div>
              <strong>Views</strong>
              <span>${views}</span>
            </div>
            <div>
              <strong>Comments</strong>
              <span>${comments}</span>
            </div>
            <div>
              <strong>Downloads</strong>
              <span>${downloads}</span>
            </div>
          </div>
        </li>
      `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('is-hidden');
}

export function hideLoader() {
  loader.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.add('is-hidden');
}

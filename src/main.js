import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import './css/styles.css';

import { getImagesByQuery } from './js/pixabay-api.js';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');

const PER_PAGE = 15;

let query = '';
let page = 1;
let totalHits = 0;
let isLoading = false;
let requestId = 0;

form.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  const searchQuery = form.elements.searchQuery.value.trim();

  if (!searchQuery) {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  query = searchQuery;
  page = 1;
  totalHits = 0;

  const currentRequest = ++requestId;

  clearGallery();
  hideLoadMoreButton();
  showLoader();
  isLoading = true;

  try {
    const data = await getImagesByQuery(query, page);

    if (currentRequest !== requestId) return;

    if (data.hits.length === 0) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    totalHits = Math.min(data.totalHits, 500);
    createGallery(data.hits);

    if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    if (currentRequest !== requestId) return;

    iziToast.error({
      message: 'Something went wrong. Please try again!',
      position: 'topRight',
    });
  } finally {
    if (currentRequest === requestId) {
      hideLoader();
      isLoading = false;
    }
  }
}

async function handleLoadMore() {
  if (isLoading || page * PER_PAGE >= totalHits) return;

  const currentRequest = requestId;
  const nextPage = page + 1;

  isLoading = true;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, nextPage);

    if (currentRequest !== requestId) return;

    if (data.hits.length === 0) {
      totalHits = page * PER_PAGE;

      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    page = nextPage;
    createGallery(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    if (currentRequest !== requestId) return;

    iziToast.error({
      message: 'Failed to load more images. Please try again!',
      position: 'topRight',
    });

    showLoadMoreButton();
  } finally {
    if (currentRequest === requestId) {
      hideLoader();
      isLoading = false;
    }
  }
}

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const loadBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const BISE_API = 'https://pixabay.com/api/';
const KEY = '38117249-fdc11eda8e12f01d0107f1e44';
let imgPage = 1;
let inputValue = '';
let getImages = null;
let totalImg = 0;
let formSubmitted = false;

formEl.addEventListener('submit', onSubmitForm);
loadBtn.addEventListener('click', onClickLoad);

function onSubmitForm(evt) {
  evt.preventDefault();
  formSubmitted = true;
  galleryEl.innerHTML = '';
  inputValue = evt.target.elements[0].value;

  createPetsMarkup(inputValue);
}
function onClickLoad(evt) {
  evt.preventDefault();
  imgPage += 1;
  createPetsMarkup(inputValue);
}

async function createPetsMarkup(inputValue) {
  try {
    if (inputValue !== '') {
      getImages = await axios.get(
        `${BISE_API}?key=${KEY}&q=${inputValue}&page=${imgPage}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page=40`
      );
    }
    const data = getImages.data.hits;
    totalImg = getImages.data.total;
    const markup = data
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card gallery__item">
            <a class="gallery__link" href="${largeImageURL}">
                        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="300" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b><br>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b><br>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b><br>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b><br>
                ${downloads}
              </p>
            </div>
          </div>`;
        }
      )
      .join('');

    if (JSON.stringify(data) !== JSON.stringify([])) {
      galleryEl.insertAdjacentHTML('beforeend', markup);
      console.log(getImages);
      const galleryLinks = document.querySelectorAll('.gallery__link');
      new SimpleLightbox(galleryLinks);
      if (formSubmitted) {
        Notiflix.Notify.success(`hooray, we found ${totalImg} images`);
        formSubmitted = false;
      }
    } else {
      throw new Error();
    }
    if (getImages.status === 200) {
      loadBtn.hidden = false;
    }
  } catch {
    loadBtn.hidden = true;
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
//

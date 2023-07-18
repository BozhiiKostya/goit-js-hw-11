import axios from 'axios';

const BISE_API = 'https://pixabay.com/api/';
const KEY = '38117249-fdc11eda8e12f01d0107f1e44';

export async function requestApi(inputValue, imgPage, getImages) {
  if (inputValue !== '') {
    return (getImages = await axios.get(
      `${BISE_API}?key=${KEY}&q=${inputValue}&page=${imgPage}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page=40`
    ));
  }
}

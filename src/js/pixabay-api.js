import axios from 'axios';

const API_KEY = '58354261-7d974ce9e9e47d9ba389b2f83';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 15,
    },
  });

  return response.data;
}

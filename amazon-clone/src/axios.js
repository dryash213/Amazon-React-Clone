// import axios from 'axios';

// const instance = axios.create({
//     baseUrl: 'http://localhost:5001/challenge-45e21/us-central1/api' 
//     //The Api Url
// });

// export default instance;


import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: 'http://localhost:5001/challenge-45e21/us-central1/api'
    // "http://localhost:5001/challenge-4b2b2/us-central1/api",
});

export default instance;
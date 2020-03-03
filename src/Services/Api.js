import axios from 'axios';

const Api = axios.create({
    baseURL : 'https://www.canalti.com.br/api/'
});

export default Api;
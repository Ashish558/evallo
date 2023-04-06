export const BASE_URL =  process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_BASE_URL
// export const BASE_URL =  'http://localhost:5000/'

export const getAuthHeader = ()=>{
 return  {
      "Authorization": sessionStorage.getItem('token'),
   }
}
// export const BASE_URL ='https://testingolineobackend.tk/'
export const BASE_URL = 'https://backend.sevensquarelearning.com/'
// export const BASE_URL = 'http://13.233.118.31:3000/'

export const getAuthHeader = ()=>{
 return  {
      "Authorization": sessionStorage.getItem('token'),
   }
}
export const BASE_URL =  process.env.REACT_APP_BASE_URL

export const getAuthHeader = ()=>{
 return  {
      "Authorization": sessionStorage.getItem('token'),
   }
}
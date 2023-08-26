export const BASE_URL =  process.env.REACT_APP_BASE_URL

export const getAuthHeader = ()=>{
   
   if(localStorage.getItem('evalloToken')){
      let token =localStorage.getItem('evalloToken');
      sessionStorage.setItem('token',token);
   }
 return  {
      "Authorization": sessionStorage.getItem('token'),
   }
}
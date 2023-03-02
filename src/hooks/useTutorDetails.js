
import { useEffect, useState } from 'react';
import { useLazyGetTutorDetailsQuery } from '../app/services/users';

export const useTutorDetails = (id) => {
   const [details, setDetails] = useState({})
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()

   useEffect(() => {
      getUserDetail({ id })
         .then(res => {
            let details = res.data.data.details
            console.log('details', details);
         })
   }, [])
   return { details }
};

import AppRoutes from "./navigation/AppRoutes";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateIsLoggedIn, updateUserDetails } from "./app/slices/user";
import { useLazyGetPersonalDetailQuery } from "./app/services/users";

function App() {
   const [loading, setLoading] = useState(true);
   const [fetchPersonalDetails, personalDetailsResp] = useLazyGetPersonalDetailQuery()
   const dispatch = useDispatch();
   const { isLoggedIn } = useSelector(state => state.user)

   useEffect(() => {
      setLoading(true);
     
      if (sessionStorage.getItem('token')) {
         fetchPersonalDetails()
            .then(res => {
               console.log('personal Dedails', res.data )
               const { firstName, lastName, _id, amountToPay, credits } = res.data.data.user
               setLoading(false);
               dispatch(updateIsLoggedIn(true));
               dispatch(updateUserDetails({
                  firstName, lastName, id: _id, amountToPay, credits
               }))
            })
      } else {
         setLoading(false);
      }

   }, [isLoggedIn]);

   if (loading) return <></>;

   return (
      <>
         <AppRoutes />
      </>
   );
}

export default App;

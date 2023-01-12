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
               if (res.error) {
                  return
               }
               console.log('personal Dedails', res.data)
               const { firstName, lastName, _id, amountToPay, credits, role } = res.data.data.user
               let timeZone = ''
               if (res.data.data.userdetails) {
                  timeZone = res.data.data.userdetails.timeZone
               }
               // if(!role) return
               sessionStorage.setItem('role', role)
               setLoading(false);
               dispatch(updateIsLoggedIn(true));
               dispatch(updateUserDetails({
                  firstName, lastName, id: _id, amountToPay, credits, role,
                  timeZone: timeZone ? timeZone : ''
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

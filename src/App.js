import AppRoutes from "./navigation/AppRoutes";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  updateAwsLink,
  updateIsLoggedIn,
  updateUserDetails,
} from "./app/slices/user";
import {
  useLazyGetOrganizationQuery,
  useLazyGetPersonalDetailQuery,
} from "./app/services/users";
import { updateOrganization } from "./app/slices/organization";

function App() {
  const [loading, setLoading] = useState(true);
  const [fetchPersonalDetails, personalDetailsResp] =
    useLazyGetPersonalDetailQuery();
  const [fetchOrganization, fetchOrganizationResp] =
    useLazyGetOrganizationQuery();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  const getOrganizationDetail = (id) => {
    if (id === undefined) return;
    fetchOrganization(id).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      dispatch(updateOrganization(res.data.organisation))
      console.log("res", res.data.organisation);
    });
  };

  useEffect(() => {
    setLoading(true);

    if (sessionStorage.getItem("token")) {
      fetchPersonalDetails().then((res) => {
        if (res.error) {
          return;
        }
        const {
          firstName,
          lastName,
          _id,
          amountToPay,
          credits,
          role,
          email,
          phone,
          associatedOrg,
        } = res.data.data.user;
        dispatch(updateAwsLink(res.data.data.baseLink));
        let timeZone = "";
        if (res.data.data.userdetails) {
          timeZone = res.data.data.userdetails.timeZone;
        }
        // if(!role) return
        sessionStorage.setItem("role", role);
        setLoading(false);
        dispatch(updateIsLoggedIn(true));
        dispatch(
          updateUserDetails({
            firstName,
            lastName,
            id: _id,
            amountToPay,
            credits,
            role,
            timeZone: timeZone ? timeZone : "",
            email,
            phone,
            associatedOrg,
          })
        );
        getOrganizationDetail(associatedOrg[0]);
      });
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

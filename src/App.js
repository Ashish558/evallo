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
import { useLazyGetLogoutQuery } from "./app/services/superAdmin";

function App() {
  const [loading, setLoading] = useState(true);
  const [fetchPersonalDetails, personalDetailsResp] =
    useLazyGetPersonalDetailQuery();
  const [fetchOrganization, fetchOrganizationResp] =
    useLazyGetOrganizationQuery();
  const dispatch = useDispatch();
  const [logOutApi, setLogOutApi] = useLazyGetLogoutQuery();
  const { isLoggedIn } = useSelector((state) => state.user);

  const getOrganizationDetail = (id) => {
    if (id === undefined) return;
    fetchOrganization(id).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      dispatch(updateOrganization(res.data.organisation));
      // console.log("res", res.data.organisation);
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
        getOrganizationDetail(associatedOrg);
      });
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();

      console.log("beforeunload event triggered");

      // return (event.returnValue =
      //   'Are you sure you want to exit?');
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      logOutApi().then(() => {
        console.log("Successfully logged out");
      });
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);
  if (loading) return <></>;

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;

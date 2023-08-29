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
import Loader from "./components/Loader";

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

    });
  };

  useEffect(() => {
    setLoading(true);

    if (sessionStorage.getItem("token")||localStorage.getItem("evalloToken")) {
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
        let dateFormat = "";
        if (res.data.data.userdetails) {
          timeZone = res.data.data.userdetails.timeZone;
          dateFormat = res.data.data.userdetails.dateFormat;
        }
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
            dateFormat: dateFormat ? dateFormat : 'dd/mm/yy'
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
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      // logOutApi().then(() => {
      //   console.log("Successfully logged out");
      // });
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);
  if (loading) return <Loader />;

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;

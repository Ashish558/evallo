import React from "react";
import { useEffect } from "react";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useVerifyNewEmailMutation } from "../../../../app/services/organization";

const EmailVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyEmail, setVerifyEmail] = useVerifyNewEmailMutation();

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    console.log({ currentParams });
    let body = {
      email: currentParams.email,
      token: currentParams.token,
      userid: currentParams.userid,
    };

    verifyEmail(body)
      .then((res) => {
        console.log({ res, body });
        navigate("/");
      })
      .catch((err) => {
        navigate("/");
      });
  }, []);
  return <div></div>;
};

export default EmailVerify;

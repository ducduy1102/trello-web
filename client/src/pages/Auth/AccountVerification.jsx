import { verifyUserAPI } from "@/apis";
import PageLoadingSpinner from "@/components/Loading/PageLoadingPinner";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export default function AccountVerification() {
  // Get email & token from url
  let [searhParams] = useSearchParams();
  // const email = searhParams.get("email");
  // const token = searhParams.get("token");
  const { email, token } = Object.fromEntries([...searhParams]);
  const [verified, setVerified] = useState(false);

  // Call API to verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true));
    }
  }, [email, token]);

  // If url does not exist email or token => 404
  if (!email || !token) {
    return <Navigate to='/404' />;
  }

  // If verifing => loading
  if (!verified) {
    return <PageLoadingSpinner caption='Verifying your account...' />;
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} />;
}

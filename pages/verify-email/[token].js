// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
// import useRequest from "../../hooks/useRequest";

// import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { axiosInstance } from "@/api";
import Loading from "@/components/loading/loading";

const VerifyEmail = ({ data, token }) => {
  const router = useRouter();
  useEffect(() => {
    // router.push(
    //   {
    //     pathname: "/verify-email/success?string=jajfififjupoqo42rg2g4e",
    //     query: { string: "just a random string" },
    //   },
    //   "verify-email/success"
    // );
    if (data.linkChange) {
      router.push(`/verify-email/expired-link`);
    } else {
      router.push(`/verify-email/success?token=${token}`);
    }
  }, []);
  return (
    <>
      <Loading />
    </>
  );
};

export default VerifyEmail;

export async function getServerSideProps(context) {
  const {
    query: { token, role },
  } = context;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const res = await axiosInstance.post("user/verify-token", { token, role: 2 });
  // if (!res?.data?.status) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/",
  //     },
  //   };
  // }

  return {
    props: { data: res.data, token, isProtected: null },
  };
}

// import { setUserProperties } from "firebase/analytics";
// import { signInWithEmailAndPassword } from "firebase/auth";
import Head from "next/head";
import router, { useRouter } from "next/router";
import React, { useState } from "react";
// import { auth } from "../config/firebase";
// import { useAuth } from "../context/AuthContext";
function Login() {
  const route = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  // const handleSignIn = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password).then((user) => {
  //       route.push("/");
  //     });
  //   } catch (err) {
  //     setError(true);
  //   }
  // };

  return (
    <>
      <div className="bg-gray-200 min-h-screen flex flex-col">
        <div className="container rounded-lg max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <div className="flex flex-row justify-center">
              <img className="w-12 h-12" src="/images/bitmap.png"></img>
              <h2 className="text-center text-5xl mx-2 my-auto text-[35px] mb-8">
                <b className="">Babble</b>
              </h2>
            </div>
            <h1 className="mb-8 text-3xl text-center">Log In</h1>
            {error ? (
              <section className="bg-red-500 text-white w-full my-2 p-3 text-center">
                Something&apos;s not right! Please check if you entered a valid
                email and password.
              </section>
            ) : null}
            <form onSubmit={() => {}}>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-green-300 text-black hover:bg-green-400"
              >
                Log In
              </button>
            </form>
          </div>

          <div className="text-grey-dark mt-6">
            Do not have an account?
            <button
              className="no-underline border-b border-blue text-blue"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign Up
            </button>
            .
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

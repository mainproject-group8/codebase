// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
// import { auth, db } from "../config/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useAuth } from "../context/AuthContext";
// import { stringify } from "querystring";
// import { Head } from "next/document";
// SignUp.title = "SignUp to Babble";
function SignUp() {
  const router = useRouter();
  // const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState(false);
  // const handleSignup = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password).then(
  //       (res) => {
  //         updateProfile(res.user, { displayName: name });
  //       }
  //     );
  //     const userData = await auth.currentUser;
  //     if (userData) {
  //       setUser(userData);
  //       await setDoc(doc(db, "users", userData.uid), {
  //         name: name,
  //         email: userData.email,
  //         uid: userData.uid,
  //       });
  //       await setDoc(doc(db, "userChats", userData.uid), {});
  //     }
  //     router.push("/");
  //   } catch (err) {
  //     setErr(true);
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
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            {err ? (
              <section className="bg-red-500 text-white w-full my-2 p-3 text-center">
                Something&apos; not right! Please check the values that
                you&apos;ve entered!
              </section>
            ) : null}
            <form onSubmit={() => {}}>
              <input
                type="text"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="fullname"
                placeholder="Full Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

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
              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="confirm_password"
                placeholder="Confirm Password"
              />

              <button
                type="submit"
                className="w-full text-center py-3 rounded bg-green-300 text-black hover:bg-green-400"
              >
                Create Account
              </button>
            </form>
          </div>

          <div className="text-grey-dark mt-6">
            Already have an account?
            <button
              className="ml-2 border-b border-blue text-blue"
              onClick={() => {
                router.push("/login");
              }}
            >
              Log in
            </button>
            .
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;

import React from "react";
import { Link } from "react-router-dom";
import supratour from "../assets/Supratour.jpg";
import axios from "axios";

const Register = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/api/users/register", values);
      if (response.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    console.log("login");
  };

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative w-screen"
      style={{
        backgroundImage: `url(${supratour})`,
      }}
    >
      <div className="absolute bg-gradient-to-b from-gray-700 to-black opacity-75 inset-0 z-0" />
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
          <div className="self-start hidden lg:flex flex-col  text-white">
            <h1 className="mb-3 font-bold text-5xl">Welcome to Supratours </h1>
            <p className="pr-3">
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center  z-10">
          <div className="p-12 bg-white text-black mx-auto rounded-2xl w-100 ">
            <div className="mb-4">
              <h3 className="font-bold text-3xl text-gray-800">Sign Up </h3>
              <p className="text-gray-500">Please create new account.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Full Name
                  </label>
                  <input
                    className=" w-full bg-white text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
                  </label>
                  <input
                    className=" w-full bg-white text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                    type="email"
                    name="email"
                    placeholder="mail@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                    Password
                  </label>
                  <input
                    className="w-full bg-white content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-sm ">
                    <a href="#" className="text-gray-400  hover:text-gray-600">
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center outline-none bg-gray-400 border border-neutral-800 hover:border-neutral-800 hover:bg-gray-600 text-gray-100 p-3  rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>

            <div className="pt-5 text-center text-gray-400 text-xs">
              <span>Already have an account?</span>
              <Link to="/login" className="no-underline">
                <h2 className="text-xl text-gray-500 hover:text-white mt-5 rounded-full p-2   hover:shadow-xl hover:bg-black transition ease-in duration-500">
                  Login
                </h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

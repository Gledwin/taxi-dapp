"use client";

import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import taxiAnimation from "@/components/animations/taxi.json"; // Adjust path to your taxi.json
import { createUser } from "@/services/createUser";
import { useAccount } from "wagmi";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function BecomeAUser() {
  const router = useRouter();
  const { address } = useAccount();

  const [isGettingStarted, setIsGettingStarted] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailAddressInput, setEmailAddressInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
        if (doesUserExist) {
          router.push("/");
        }
      }
    };

    checkIfUserExistsAndSet();
  }, [address, router]);

  const handleUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsernameInput(value);
    setUsernameError(value.length > 6 ? null : "Username must be more than 6 characters");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEmailAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailAddressInput(value);
    setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Email must be valid");
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRoleInput(value);
    setRoleError(value ? null : "Please select a role");
  };

  const validateInput = () => {
    let isValid = true;
    if (usernameInput.length <= 6) {
      setUsernameError("Username must be more than 6 characters");
      isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddressInput)) {
      setEmailError("Email must be valid");
      isValid = false;
    }
    if (!roleInput) {
      setRoleError("Please select a role");
      isValid = false;
    }
    return isValid;
  };

  const onClickCreateUser = async () => {
    if (validateInput()) {
      setIsCreatingUser(true);
      const isDriver = roleInput === "driver";
      const isUserCreated = await createUser(address, {
        _username: usernameInput,
        _emailAddress: emailAddressInput,
        _isDriver: isDriver,
      });

      if (isUserCreated) {
        setMessage("User creation successful.");
        setUserExists(true);
        window.location.reload();
      } else {
        setMessage("User creation failed. Please try again.");
      }
      setIsCreatingUser(false);
    }
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: taxiAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <Lottie options={lottieOptions} height="100%" width="100%" />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black/40 to-black/70 p-6">
        {/* Intro Card */}
        <section >
          <h2 className="text-3xl font-extrabold text-white">Welcome to Cashless Taxi</h2>
          <p className="text-white mt-4 leading-relaxed">
            Join us today for a seamless taxi experience! Whether you're a driver or passenger,
            enjoy safe, cashless rides with ease.
          </p>
        </section>

        {/* Get Started Section */}
        <div className="w-full  p-6 rounded-lg shadow-lg text-center mt-4 max-w-md">
          <h2 className="text-lg font-bold text-white">
            {userExists ? "Welcome Back!" : "Become a user"}
          </h2>
          <p className="text-white mt-2">
            {userExists
              ? "You're all set! Enjoy our services."
              : "Register your wallet to continue."}
          </p>
        </div>

        {!userExists && (
          <button
            onClick={() => setIsGettingStarted(true)}
            className="bg-yellow-400 text-white font-bold py-2 px-6 rounded-full shadow-lg mt-6 transform transition-all hover:scale-105 hover:bg-yellow-500"
          >
            {isGettingStarted ? "Setting Up..." : "Get Started"}
          </button>
        )}

        {isGettingStarted && (
          <form className="w-full space-y-6 mt-6 max-w-lg">
            <div>
              <label className="block text-white font-bold mb-2">Username</label>
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-yellow-500"
                type="text"
                placeholder="Enter username"
                value={usernameInput}
                onChange={handleUsernameInputChange}
              />
              {usernameError && <p className="text-red-600 mt-2">{usernameError}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Email Address</label>
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-yellow-500"
                type="email"
                placeholder="Enter email"
                value={emailAddressInput}
                onChange={handleEmailAddressInputChange}
              />
              {emailError && <p className="text-red-600 mt-2">{emailError}</p>}
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Role</label>
              <select
                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-yellow-500"
                value={roleInput}
                onChange={handleRoleChange}
              >
                <option value="">Choose your role</option>
                <option value="driver">Driver</option>
                <option value="passenger">Passenger</option>
              </select>
              {roleError && <p className="text-red-600 mt-2">{roleError}</p>}
            </div>

            <button
              onClick={onClickCreateUser}
              className={`w-full bg-yellow-400 text-white font-bold py-3 rounded-full shadow-md transform transition-all hover:scale-105 hover:bg-yellow-500 ${
                isCreatingUser ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isCreatingUser}
            >
              {isCreatingUser ? "Creating..." : "Continue"}
            </button>

            <button
              onClick={() => setIsGettingStarted(false)}
              className="w-full text-white mt-4 underline hover:text-gray-200"
            >
              Cancel
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}

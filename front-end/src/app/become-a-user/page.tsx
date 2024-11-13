"use client";

import React, { useEffect, useState } from "react";
import { createUser } from "@/services/createUser";
import { useAccount } from "wagmi";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { useRouter } from "next/navigation";
import { TaxiUser } from "@/entities/taxiUser";
import Footer from "@/components/footer";

export default function BecomeAUser() {
  const router = useRouter();
  const { address } = useAccount();

  const [taxiUser, setTaxiUser] = useState<TaxiUser | null>(null);
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
        window.location.reload(); // Reload after user creation success
      } else {
        setMessage("User creation failed. Please try again.");
      }
      setIsCreatingUser(false);
    }
  };
  

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center">
        <img src="/pictures/taxi-icon.jpg" alt="Taxi Icon" className="w-25 h-24" />

        {message && (
          <div className="fixed top-0 left-0 right-0 p-4 text-center z-50 text-white bg-gradient-to-r from-green-400 to-yellow-300 shadow-lg transform transition duration-500 ease-in-out animate-bounce" style={{ fontFamily: "Comic Sans MS, cursive", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" }}>
            {message}
          </div>
        )}
        <h3 className="font-normal text-lg py-8 text-center">Welcome to the Cashless Taxi System</h3>

        {userExists ? (
          <button
            onClick={() => router.push("/")}
            className="bg-green-500 text-white hover:bg-yellow-500 py-2 px-4 rounded"
          >
            All set
          </button>
        ) : (
          <button
            onClick={() => setIsGettingStarted(true)}
            className={`bg-yellow-500 text-white hover:bg-green-500 py-2 px-4 rounded ${isGettingStarted ? "cursor-not-allowed" : ""}`}
            disabled={isGettingStarted}
          >
            {isGettingStarted ? "Setting Up" : "Get started"}
          </button>
        )}

        {isGettingStarted && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 bg-gradient-to-r from-green-400 to-yellow-300">
              <h3 className="text-lg font-semibold">Become a User</h3>

              <label className="block mt-4">
                <span>Username</span>
                <input
                  className="mt-1 block w-full border rounded-md p-2"
                  type="text"
                  placeholder="yourUsername"
                  value={usernameInput}
                  onChange={handleUsernameInputChange}
                />
                {usernameError && <p className="text-red-600">{usernameError}</p>}
              </label>

              <label className="block mt-4">
                <span>Email</span>
                <input
                  className="mt-1 block w-full border rounded-md p-2"
                  type="email"
                  placeholder="e.g. youremail@gmail.com"
                  value={emailAddressInput}
                  onChange={handleEmailAddressInputChange}
                />
                {emailError && <p className="text-red-600">{emailError}</p>}
              </label>

              <label className="block mt-4">
                <span>Role</span>
                <select
                  className="mt-1 block w-full border rounded-md p-2"
                  value={roleInput}
                  onChange={handleRoleChange}
                >
                  <option value="">Select a role</option>
                  <option value="driver">Driver</option>
                  <option value="passenger">Passenger</option>
                </select>
                {roleError && <p className="text-red-600">{roleError}</p>}
              </label>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClickCreateUser}
                  className={`bg-yellow-500 text-white hover:bg-green-500 py-2 px-4 rounded ${isCreatingUser ? "cursor-not-allowed" : ""}`}
                  disabled={isCreatingUser}
                >
                  {isCreatingUser ? "Creating User" : "Continue"}
                </button>
                <button
                  onClick={() => setIsGettingStarted(false)}
                  className="ml-2 text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer/>
    </>
  );
}

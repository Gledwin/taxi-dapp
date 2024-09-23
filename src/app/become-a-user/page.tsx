"use client";

import React, { useEffect, useState } from "react";
import { createUser } from "@/services/createUser";
import { useAccount } from "wagmi";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { useRouter } from "next/navigation";
import { ToastContainer, ToastContentProps, toast } from "react-toastify";

export default function BecomeAUser() {
  const router = useRouter();
  const { address } = useAccount();

  const [isGettingStarted, setIsGettingStarted] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailAddressInput, setEmailAddressInput] = useState("");
  const [roleInput, setRoleInput] = useState(""); // State to track role selection (driver or passenger)

  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
      }
    };

    checkIfUserExistsAndSet();
  }, [address, userExists, router]);

  const handleUsernameInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setUsernameInput(e.target.value);
  };

  const handleEmailAddressInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmailAddressInput(e.target.value);
  };

  const handleRoleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setRoleInput(e.target.value); // Handle role input
  };

  const showErrorToast = (description: string) => {
    toast.error(description, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showSuccessToast = (description: string) => {
    toast.success(description, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const validateInput = () => {
    const isUsernameValid = usernameInput.length > 6;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddressInput);
    const isRoleValid = roleInput !== ""; // Ensure a role is selected

    if (isUsernameValid && isEmailValid && isRoleValid) {
      return true;
    } else {
      if (!isUsernameValid) showErrorToast("Username must be more than 6 characters");
      if (!isEmailValid) showErrorToast("Email must be valid");
      if (!isRoleValid) showErrorToast("Please select a role");
    }
    return false;
  };

  const onClickCreateUser = async () => {
    const inputIsValidated = validateInput();
  
    if (inputIsValidated) {
      setIsCreatingUser(true);
      
      // Convert role input to a boolean value (true for driver, false for passenger)
      const isDriver = roleInput === "driver";
  
      const isUserCreated = await createUser(address, {
        _username: usernameInput,
        _emailAddress: emailAddressInput,
        _isDriver: isDriver, // Pass the role as a boolean to the contract
      });
  
      if (isUserCreated) {
        showSuccessToast("User created successfully");
        router.push("/");
      } else {
        showErrorToast("User creation failed");
      }
      setIsCreatingUser(false);
    }
  };
  

  return (
    <main className="flex h-screen flex-col items-center">
      <h1 className="font-normal text-lg py-8"></h1>

      {userExists && (
        <h2 className="font-normal text-sm pb-2">Good to see you back</h2>
      )}

      {userExists ? (
        <button
          onClick={() => router.push("/")}
          className="bg-red-600 text-white hover:bg-purple-700 py-2 px-4 rounded"
        >
          Go home
        </button>
      ) : (
        <button
          onClick={() => setIsGettingStarted(true)}
          className={`bg-red-600 text-white hover:bg-purple-700 py-2 px-4 rounded ${
            isGettingStarted ? "cursor-not-allowed" : ""
          }`}
          disabled={isGettingStarted}
        >
          {isGettingStarted ? "Setting Up" : "Get started"}
        </button>
      )}

      {isGettingStarted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold">Become a User</h3>
            <label className="block mt-4">
              <span>Username</span>
              <input
                className="mt-1 block w-full border rounded-md p-2"
                type="text"
                placeholder="e.g. andrewkimjoseph"
                value={usernameInput}
                onChange={handleUsernameInputChange}
              />
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
            </label>

            {/* Role Selection (Driver/Passenger) */}
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
            </label>

            <div className="mt-4 flex justify-end">
              <button
                onClick={onClickCreateUser}
                className={`bg-red-600 text-white hover:bg-purple-700 py-2 px-4 rounded ${
                  isCreatingUser ? "cursor-not-allowed" : ""
                }`}
                disabled={isCreatingUser}
              >
                {isCreatingUser ? "Creating User" : "Create user"}
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

      <ToastContainer />
    </main>
  );
}



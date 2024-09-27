"use client";

import React, { useEffect, useState } from "react";
import { createUser } from "@/services/createUser";
import { useAccount } from "wagmi";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle } from "react-icons/fi"; // Icons for success and error
import { TaxiUser } from "@/entities/taxiUser";

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

  // Error states for validation
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
      }
    };

    checkIfUserExistsAndSet();
  }, [address, router]);

  const handleUsernameInputChange = (e: { target: { value: string } }) => {
    setUsernameInput(e.target.value);
    if (e.target.value.length > 6) {
      setUsernameError(null); // Clear the error if validation passes
    }
  };

  const handleEmailAddressInputChange = (e: { target: { value: string } }) => {
    setEmailAddressInput(e.target.value);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
      setEmailError(null); // Clear the error if validation passes
    }
  };

  const handleRoleChange = (e: { target: { value: string } }) => {
    setRoleInput(e.target.value);
    if (e.target.value !== "") {
      setRoleError(null); // Clear the error if validation passes
    }
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

    if (roleInput === "") {
      setRoleError("Please select a role");
      isValid = false;
    }

    return isValid;
  };

  const onClickCreateUser = async () => {
    const inputIsValidated = validateInput();
  
    if (inputIsValidated) {
      setIsCreatingUser(true);
  
      const isDriver = roleInput === "driver";
  
      const isUserCreated = await createUser(address, {
        _username: usernameInput,
        _emailAddress: emailAddressInput,
        _isDriver: isDriver,
      });
  
      if (isUserCreated) {
        router.push("/"); // Navigate to home page with the role query
        setUsernameInput("");
        setEmailAddressInput("");
        setRoleInput("");
        setUserExists(true); // Set userExists to true after successful creation
        setIsGettingStarted(false); // Hide the form after successful user creation
      } else {
        // You can show a general error message if user creation fails
        alert("User creation failed. Please try again.");
      }
  
      setIsCreatingUser(false);
    }
  };
  
  return (
    <main className="flex h-screen flex-col items-center">
      <h3 className="font-normal text-lg py-8">Welcome to the Cashless Taxi System</h3>

      {userExists ? (
        <button
          onClick={() => {
            if (taxiUser?.isDriver) {
              router.push("/"); // Redirect to driver home
            } else {
              router.push("/"); // Redirect to passenger home
            }
          }}
          className="bg-red-600 text-white hover:bg-purple-700 py-2 px-4 rounded"
        >
          Refresh the page to continue
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
                className={`bg-red-600 text-white hover:bg-purple-700 py-2 px-4 rounded ${
                  isCreatingUser ? "cursor-not-allowed" : ""
                }`}
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
  );
}

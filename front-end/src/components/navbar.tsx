import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NavLink from "./navLinks";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

const Links = [
  {
    title: "Home",
    href: "/",
  },
];

const NavBar = () => {
  const { connect } = useConnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    if (
      window.ethereum &&
      (window.ethereum.isMiniPay || window.ethereum.isMinipay)
    ) {
      setIsMiniPay(true);
      connect({ connector: injected({}) });
    }
  }, [connect]); // Include connect in the dependency array

  return (
    <nav className="bg-white sticky top-0 z-50 px-4">
      <div className="flex justify-between items-center h-16">
        <button
          className="md:hidden p-2 text-white"
          onClick={isOpen ? onClose : onOpen}
          aria-label="Open Menu"
        >
          {isOpen ? (
            <span className="text-green-500 text-2xl font-bold">x</span>
          ) : (
            <span className="text-green-500 text-2xl font-bold">☰</span>
          )}
        </button>
        <div className="flex items-center space-x-8">
          <h3 className="text-green-800 font-bold text-2xl px-4 py-2 shadow-md transition-transform duration-300 hover:scale-105">
            C.T.S
          </h3>
          <div className={`hidden md:flex space-x-4`}>
            {Links.map((link) => (
              <NavLink
                href={link.href}
                key={link.href}
                className="text-white hover:text-gray-200"
              >
                {link.title}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          {!isMiniPay ? (
            <ConnectButton
              chainStatus="none"
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "avatar",
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              label="Connect"
            />
          ) : (
            <div style={{ visibility: "hidden", pointerEvents: "none" }}>
              <ConnectButton
                chainStatus="none"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "avatar",
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
                label="Connect"
              />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-4">
            {Links.map((link) => (
              <NavLink
                href={link.href}
                key={link.href}
                className="text-white hover:text-yellow-200"
              >
                {link.title}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

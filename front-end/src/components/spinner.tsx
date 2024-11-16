// components/FunSpinner.tsx

export default function FunSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Bouncing Taxi */}
      <div className="text-6xl animate-bounce">🚕</div>

      {/* Spinning Loader */}
      <div className="mt-4 w-12 h-12 border-t-4 border-yellow-500 border-solid rounded-full animate-spin"></div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

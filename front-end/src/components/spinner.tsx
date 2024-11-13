// components/FunSpinner.tsx

export default function FunSpinner() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 via-green-200 to-green-400 animate-gradient">
        <div className="text-6xl animate-bounce">🚕</div>
        <p className="mt-4 text-xl text-green-800 font-bold animate-pulse">
            loading
        </p>
        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-bounce {
            animation: bounce 1s infinite;
          }
  
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
    );
  }
  
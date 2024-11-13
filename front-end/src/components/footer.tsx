
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-500 to-yellow-500 p-6 text-white mt-8 w-full">
      <div className="flex flex-col items-center justify-between max-w-4xl mx-auto md:flex-row">
        {/* Company Info */}
        <div className="mb-4 md:mb-0">
          <h4 className="text-2xl font-bold">C.T.S Taxi Services</h4>
          <p className="text-sm">Safe and reliable rides at your convenience.</p>
        </div>

       

        {/* Contact Info */}
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <p>Contact Us: support@ctstaxiservices.com</p>
          <p>Phone: +123 456 7890</p>
          <p className="text-xs">© 2024 C.T.S Taxi Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

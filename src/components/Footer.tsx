import Link from "next/link";

const footerColumns = [
  {
    title: "NEXTWORLD",
    links: ["About Us", "Careers", "News", "Investors", "Sustainability"],
  },
  {
    title: "Help",
    links: [
      "Order Status",
      "Shipping & Delivery",
      "Returns",
      "Contact Us",
      "FAQ",
    ],
  },
  {
    title: "Company",
    links: ["Gift Cards", "Find a Store", "Journal", "Become a Member"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      {/* Newsletter */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Stay in the loop
            </h3>
            <p className="text-neutral-400 mt-2 text-sm">
              Subscribe for early access to new drops and exclusive content.
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Email address"
              className="bg-neutral-900 border border-neutral-700 rounded-l-full px-5 py-3 text-sm w-full md:w-72 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-500"
            />
            <button className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-r-full hover:bg-neutral-200 transition-colors whitespace-nowrap">
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-neutral-400 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-bold text-xs tracking-widest uppercase mb-4">
              Social
            </h4>
            <div className="flex gap-3">
              {["X", "IG", "YT", "TK"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-xs font-bold hover:bg-white hover:text-black transition-all"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} NEXTWORLD. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

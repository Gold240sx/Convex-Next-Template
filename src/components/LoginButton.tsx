import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/signin"
      className="bg-slate-700 hover:bg-slate-800 opacity-50 hover:opacity-100 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200"
    >
      Log In
    </Link>
  );
}

"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // Redirect to the home page
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        
        <div className="flex items-center gap-6">
          <Image
            src="/assets/images/icons/logo.webp"
            alt="Logo"
            width={40}
            height={40}
          />
          <Link href="/" className="text-simmpy-green font-bold text-lg">Sippy</Link>

          <div className="flex gap-8 ml-10">
            <Link href="/" className="hover:text-simmpy-green text-simmpy-gray-800">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-simmpy-green text-simmpy-gray-800"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-simmpy-green text-simmpy-gray-800"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex gap-4">
          {status === "unauthenticated" ? (
            <>
              <Link href="/login">
                <button className="px-4 py-2 text-white bg-simmpy-gray-800 hover:bg-simmpy-gray-600 rounded">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 text-white bg-simmpy-green hover:bg-green-600 rounded">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-white bg-simmpy-gray-800 hover:bg-simmpy-gray-600 rounded"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
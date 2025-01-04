"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminToolLink() {
  const { data: session } = useSession();

  if (session?.user?.isAdmin) {
    return null;
  }
  return (
    <li>
      <Link href="/admin">ADMIN TOOL</Link>
    </li>
  );
}

"use client";

import { useRouter } from "next/navigation";

const GuestGuard = ({
  children
}) => {
  const router = useRouter();
  router.replace("/dashboard");

  return <>{children}</>;
};

export default GuestGuard;

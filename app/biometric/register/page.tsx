"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";

export default function BiometricRegisterPage() {
  const searchParams = useSearchParams();
  const session = searchParams.get("session");

  const hasStarted = useRef(false);
  const [status, setStatus] = useState(
    "Preparing biometric registration..."
  );

  useEffect(() => {
    if (!session) {
      setStatus("Invalid registration link.");
      return;
    }

    // Prevent double execution in React strict mode
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function register() {
      try {
        setStatus("Loading session...");

        // 🔥 STEP 1: Fetch options
        const res = await fetch(
          `/api/biometric/register/options?session=${session}`,
          { cache: "no-store" }
        );

        const options = await res.json();

        if (!res.ok) {
          console.error("Options error:", options);
          setStatus(options.error || "Session invalid or expired.");
          return;
        }

        console.log("Registration options:", options);

        setStatus("Triggering biometric prompt...");

        // 🔥 STEP 2: Start WebAuthn
        const credential = await startRegistration(options);

        console.log("Credential received:", credential);

        setStatus("Verifying biometric...");

        // 🔥 STEP 3: Verify on backend
        const verifyRes = await fetch(
          "/api/biometric/register/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session,
              credential,
            }),
          }
        );

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          console.error("Verify error:", verifyData);
          setStatus(verifyData.error || "Verification failed.");
          return;
        }

        setStatus("Biometric registration successful 🎉");

      } catch (err: any) {
        console.error("Biometric error:", err);
        setStatus(
          err?.message || "Biometric registration failed."
        );
      }
    }

    register();
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">
          Patient Biometric Registration
        </h1>
        <p className="text-gray-600 break-words">{status}</p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";

export default function BiometricAuthPage() {
  const params = useSearchParams();
  const session = params.get("session");
  const [status, setStatus] = useState("Preparing authentication...");

  useEffect(() => {
    if (!session) return;

    async function authenticate() {
      try {
        setStatus("Requesting authentication options...");

        const res = await fetch(
          `/api/biometric/auth/options?session=${session}`
        );

        if (!res.ok) {
          setStatus("Invalid or expired session.");
          return;
        }

        const options = await res.json();

        setStatus("Triggering biometric prompt...");

        const credential = await startAuthentication(options);

        setStatus("Verifying...");

        await fetch("/api/biometric/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session, credential }),
        });

        setStatus("Authentication successful 🎉");

      } catch (err) {
        console.error(err);
        setStatus("Authentication failed.");
      }
    }

    authenticate();
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1>Patient Authentication</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
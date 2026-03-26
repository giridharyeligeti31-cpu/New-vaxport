"use client";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { PatientProvider } from "@/lib/patient-context";
import { Login } from "@/components/login";
import { Dashboard } from "@/components/dashboard";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <PatientProvider>
      <Dashboard />
    </PatientProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

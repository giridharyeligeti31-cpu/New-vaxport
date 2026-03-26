"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { PatientTable } from "@/components/patient-table";
import { VaccinationCalendar } from "@/components/vaccination-calendar";
import { AddPatientModal } from "@/components/add-patient-modal";
import { UpdateStatusModal } from "@/components/update-status-modal";
import { EducationalCards } from "@/components/educational-cards";
import { Patient } from "@/lib/patient-context";

export function Dashboard() {
  const [language, setLanguage] = useState("en");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateStatus = (patient: Patient) => {
    setSelectedPatient(patient);
    setUpdateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header selectedLanguage={language} onLanguageChange={setLanguage} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Hero Section */}
        <HeroSection />

        {/* Action Bar */}
        <div className="flex items-center justify-between py-6">
          <h2 className="text-xl font-semibold text-foreground">
            Patient Management
          </h2>
          <AddPatientModal />
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6">
          {/* Patient Table */}
          <div className="w-full">
            <PatientTable onUpdateStatus={handleUpdateStatus} />
          </div>

          {/* Calendar Overview */}
          <div className="w-full">
            <VaccinationCalendar />
          </div>
        </div>

        {/* Educational Cards */}
        <EducationalCards />
      </motion.main>

      {/* Update Status Modal */}
      <UpdateStatusModal
        patient={selectedPatient}
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
      />
    </div>
  );
}

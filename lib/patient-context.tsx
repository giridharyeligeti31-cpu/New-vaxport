"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Patient {
  id: string;
  name: string;
  patientFirstName: string;
  patientLastName: string;
  parentFirstName?: string;
  parentLastName?: string;
  parentRelationship?: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  motherFirstName?: string;
  motherLastName?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  parentMobile?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  age: number;
  vaccineName: string;
  vaccineType: "viral" | "bacterial";
  totalDoses: number;
  dosesCompleted: number;
  status: "completed" | "pending";
  nextDoseDate: string | null;
  completionDate?: string;
  timeline?: {
    dose: number;
    date: string;
    status: "completed" | "pending";
  }[];
}

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id">) => void;
  updatePatientStatus: (id: string, status: "completed" | "pending") => void;
  sendReminder: (id: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    patientFirstName: "Arjun",
    patientLastName: "Sharma",
    fatherFirstName: "Rajesh",
    fatherLastName: "Sharma",
    parentMobile: "9876543210",
    dateOfBirth: "2021-02-15",
    gender: "male",
    age: 5,
    vaccineName: "MMR",
    vaccineType: "viral",
    totalDoses: 2,
    dosesCompleted: 1,
    status: "pending",
    nextDoseDate: "2026-04-15",
  },
  {
    id: "2",
    name: "Aditi Nair",
    patientFirstName: "Aditi",
    patientLastName: "Nair",
    motherFirstName: "Lakshmi",
    motherLastName: "Nair",
    parentMobile: "8123456789",
    dateOfBirth: "2023-01-10",
    gender: "female",
    age: 3,
    vaccineName: "DTaP",
    vaccineType: "bacterial",
    totalDoses: 5,
    dosesCompleted: 3,
    status: "pending",
    nextDoseDate: "2026-04-20",
  },
  {
    id: "3",
    name: "Sai Kiran",
    patientFirstName: "Sai",
    patientLastName: "Kiran",
    guardianFirstName: "Ramesh",
    guardianLastName: "Babu",
    parentMobile: "9988776655",
    dateOfBirth: "2019-06-20",
    gender: "male",
    age: 7,
    vaccineName: "Polio (IPV)",
    vaccineType: "viral",
    totalDoses: 4,
    dosesCompleted: 4,
    status: "completed",
    nextDoseDate: null,
    completionDate: "20-Mar-2026",
  },
  {
    id: "4",
    name: "Ananya Reddy",
    patientFirstName: "Ananya",
    patientLastName: "Reddy",
    fatherFirstName: "Srinivasa",
    fatherLastName: "Reddy",
    motherFirstName: "Kavitha",
    motherLastName: "Reddy",
    parentMobile: "7766554433",
    dateOfBirth: "2024-03-05",
    gender: "female",
    age: 2,
    vaccineName: "Hepatitis B",
    vaccineType: "viral",
    totalDoses: 3,
    dosesCompleted: 2,
    status: "pending",
    nextDoseDate: "2026-03-28",
  },
  {
    id: "5",
    name: "Rasagna Vanga",
    patientFirstName: "Rasagna",
    patientLastName: "Vanga",
    guardianFirstName: "Venkat",
    guardianLastName: "Vanga",
    parentMobile: "9812981298",
    dateOfBirth: "2024-02-14",
    gender: "female",
    age: 2,
    vaccineName: "MMR",
    vaccineType: "viral",
    totalDoses: 2,
    dosesCompleted: 2,
    status: "completed",
    nextDoseDate: "2026-03-30",
  },
  {
    id: "6",
    name: "Meera Kapoor",
    patientFirstName: "Meera",
    patientLastName: "Kapoor",
    fatherFirstName: "Anil",
    fatherLastName: "Kapoor",
    parentMobile: "7000123456",
    dateOfBirth: "2020-11-23",
    gender: "female",
    age: 6,
    vaccineName: "Varicella",
    vaccineType: "viral",
    totalDoses: 2,
    dosesCompleted: 1,
    status: "pending",
    nextDoseDate: "2026-04-05",
  },
  {
    id: "7",
    name: "Aarav Patel",
    patientFirstName: "Aarav",
    patientLastName: "Patel",
    motherFirstName: "Neha",
    motherLastName: "Patel",
    parentMobile: "8899889988",
    dateOfBirth: "2025-05-11",
    gender: "male",
    age: 1,
    vaccineName: "Rotavirus",
    vaccineType: "viral",
    totalDoses: 3,
    dosesCompleted: 2,
    status: "pending",
    nextDoseDate: "2026-03-30",
  },
  {
    id: "8",
    name: "Siddharth Rao",
    patientFirstName: "Siddharth",
    patientLastName: "Rao",
    fatherFirstName: "Vikram",
    fatherLastName: "Rao",
    motherFirstName: "Sneha",
    motherLastName: "Rao",
    parentMobile: "9111222333",
    dateOfBirth: "2018-09-02",
    gender: "male",
    age: 8,
    vaccineName: "Tdap",
    vaccineType: "bacterial",
    totalDoses: 1,
    dosesCompleted: 1,
    status: "completed",
    nextDoseDate: null,
    completionDate: "10-Jan-2026",
  },
];

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    return initialPatients.map(p => {
      if (p.timeline) return p;
      const timeline: { dose: number; date: string; status: "completed" | "pending" }[] = [];
      const baseDate = new Date();
      if (p.nextDoseDate) {
        baseDate.setTime(new Date(p.nextDoseDate).getTime());
        baseDate.setDate(baseDate.getDate() - (p.dosesCompleted * 28));
      } else {
        baseDate.setDate(baseDate.getDate() - (p.totalDoses * 28));
      }
      for (let i = 0; i < p.totalDoses; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + (i * 28));
        const dt = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        timeline.push({
          dose: i + 1,
          date: dt,
          status: i < p.dosesCompleted ? "completed" : "pending",
        });
      }
      
      let completionDate = p.completionDate;
      if (p.dosesCompleted >= p.totalDoses && timeline.length > 0) {
        completionDate = timeline[timeline.length - 1].date;
      }
      
      return { ...p, timeline, completionDate };
    });
  });

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
  };

  const updatePatientStatus = (id: string, status: "completed" | "pending") => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        
        const newTimeline = p.timeline?.map(t => ({
          ...t,
          status: status === "completed" ? "completed" : t.status
        }));
        
        let completionDate = undefined;
        if (status === "completed" && newTimeline && newTimeline.length > 0) {
          completionDate = newTimeline[newTimeline.length - 1].date;
        }
        
        return {
          ...p,
          status,
          dosesCompleted: status === "completed" ? p.totalDoses : p.dosesCompleted,
          nextDoseDate: status === "completed" ? null : p.nextDoseDate,
          completionDate: status === "completed" ? completionDate : undefined,
          timeline: newTimeline,
        };
      })
    );
  };

  const sendReminder = (id: string) => {
    // In a real app, this would send an email/SMS
    console.log(`Reminder sent for patient ${id}`);
  };

  return (
    <PatientContext.Provider
      value={{ patients, addPatient, updatePatientStatus, sendReminder }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
}

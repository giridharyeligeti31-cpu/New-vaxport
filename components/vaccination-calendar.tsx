"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePatients } from "@/lib/patient-context";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Syringe, User, X } from "lucide-react";

export function VaccinationCalendar() {
  const { patients } = usePatients();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Get dates with scheduled vaccinations
  const scheduledDates = patients
    .filter((p) => p.nextDoseDate)
    .map((p) => new Date(p.nextDoseDate!));

  // Get patients scheduled for selected date
  const patientsOnDate = selectedDate
    ? patients.filter((p) => {
        if (!p.nextDoseDate) return false;
        const doseDate = new Date(p.nextDoseDate);
        return (
          doseDate.toDateString() === selectedDate.toDateString()
        );
      })
    : [];

  // Modifier to highlight dates with appointments
  const modifiers = {
    hasAppointment: scheduledDates,
  };

  const modifiersStyles = {
    hasAppointment: {
      backgroundColor: "oklch(0.52 0.12 175 / 0.2)",
      borderRadius: "50%",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="w-5 h-5 text-primary" />
            Vaccination Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row text-card-foreground">
            {/* Calendar */}
            <div className="flex justify-center pr-0 lg:pr-8 pb-8 lg:pb-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
              />
            </div>

            {/* Scheduled Appointments */}
            <div className="flex-1 min-w-[300px] lg:border-l border-t lg:border-t-0 border-border pt-8 lg:pt-0 lg:pl-8">
              <AnimatePresence mode="wait">
                {selectedDate ? (
                  <motion.div
                    key={selectedDate.toISOString()}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full relative"
                  >
                    <button
                      onClick={() => setSelectedDate(undefined)}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-md transition-colors"
                      aria-label="Close details"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mb-4 pr-6">
                      <h4 className="font-semibold text-card-foreground">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {patientsOnDate.length} appointment
                        {patientsOnDate.length !== 1 ? "s" : ""} scheduled
                      </p>
                    </div>

                    {patientsOnDate.length > 0 ? (
                      <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                        {patientsOnDate.map((patient) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-muted/50 border border-border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  patient.gender === "female"
                                    ? "bg-pink-100 text-pink-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <User className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-card-foreground truncate">
                                  {patient.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Syringe className="w-3 h-3 text-muted-foreground" />
                                  <span className="font-bold text-foreground">
                                    {patient.vaccineName}
                                  </span>
                                </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      Dose {patient.dosesCompleted + 1} of{" "}
                                      {patient.totalDoses}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        <p className="text-center">
                          No vaccinations scheduled
                          <br />
                          for this date
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="text-center text-muted-foreground">
                      <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Select a date to view</p>
                      <p className="text-sm">scheduled vaccinations</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

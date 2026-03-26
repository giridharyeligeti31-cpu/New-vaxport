"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePatients, Patient } from "@/lib/patient-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface UpdateStatusModalProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateStatusModal({
  patient,
  open,
  onOpenChange,
}: UpdateStatusModalProps) {
  const { updatePatientStatus } = usePatients();
  const [status, setStatus] = useState<"completed" | "pending">("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setStatus(patient.status);
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    updatePatientStatus(patient.id, status);

    toast.success("Status Updated", {
      description: `${patient.name}'s vaccination status has been updated`,
    });

    onOpenChange(false);
    setIsSubmitting(false);
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-md" forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Update Patient Status</DialogTitle>
              </DialogHeader>

              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      patient.gender === "female"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {patient.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {patient.vaccineName} - {patient.dosesCompleted}/
                      {patient.totalDoses} doses
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="space-y-3">
                  <Label>Vaccination Status</Label>
                  <RadioGroup
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as "completed" | "pending")
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center">
                      <RadioGroupItem
                        value="pending"
                        id="status-pending"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="status-pending"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-border cursor-pointer peer-data-[state=checked]:border-warning peer-data-[state=checked]:bg-warning/5 transition-colors"
                      >
                        <Clock className="w-5 h-5 text-warning" />
                        <div>
                          <p className="font-medium">Pending</p>
                          <p className="text-sm text-muted-foreground">
                            Vaccination is in progress
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem
                        value="completed"
                        id="status-completed"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="status-completed"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-border cursor-pointer peer-data-[state=checked]:border-success peer-data-[state=checked]:bg-success/5 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <div>
                          <p className="font-medium">Completed</p>
                          <p className="text-sm text-muted-foreground">
                            All doses administered
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      "Update Status"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

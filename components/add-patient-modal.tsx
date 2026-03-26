"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePatients } from "@/lib/patient-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, Syringe, Phone, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const vaccines = [
  { name: "MMR", type: "viral" as const, doses: 2 },
  { name: "DTaP", type: "bacterial" as const, doses: 5 },
  { name: "Polio (IPV)", type: "viral" as const, doses: 4 },
  { name: "Hepatitis B", type: "viral" as const, doses: 3 },
  { name: "Pneumococcal", type: "bacterial" as const, doses: 4 },
  { name: "Varicella", type: "viral" as const, doses: 2 },
  { name: "Rotavirus", type: "viral" as const, doses: 3 },
  { name: "Tdap", type: "bacterial" as const, doses: 1 },
  { name: "Hib", type: "bacterial" as const, doses: 4 },
  { name: "Hepatitis A", type: "viral" as const, doses: 2 },
  { name: "BCG", type: "bacterial" as const, doses: 1 },
  { name: "Oral Polio (OPV)", type: "viral" as const, doses: 5 },
  { name: "Typhoid", type: "bacterial" as const, doses: 1 },
];

const VACCINE_SCHEDULE = [
  { minWeeks: 0, maxWeeks: 5, targetWeeks: 0, title: "At Birth", vaccines: ["BCG", "Oral Polio (OPV)", "Hepatitis B"], doseNumber: 1 },
  { minWeeks: 6, maxWeeks: 9, targetWeeks: 6, title: "6 Weeks", vaccines: ["DTaP", "Polio (IPV)", "Hepatitis B", "Hib", "Rotavirus", "Pneumococcal"], doseNumber: 1 },
  { minWeeks: 10, maxWeeks: 13, targetWeeks: 10, title: "10 Weeks", vaccines: ["DTaP", "Polio (IPV)", "Hib", "Rotavirus", "Pneumococcal"], doseNumber: 2 },
  { minWeeks: 14, maxWeeks: 23, targetWeeks: 14, title: "14 Weeks", vaccines: ["DTaP", "Polio (IPV)", "Hib", "Rotavirus", "Pneumococcal"], doseNumber: 3 },
  { minWeeks: 24, maxWeeks: 38, targetWeeks: 26, title: "6 Months", vaccines: ["Oral Polio (OPV)", "Hepatitis B"], doseNumber: 3 },
  { minWeeks: 39, maxWeeks: 51, targetWeeks: 39, title: "9 Months", vaccines: ["MMR", "Typhoid"], doseNumber: 1 },
  { minWeeks: 52, maxWeeks: 999, targetWeeks: 52, title: "12-15 Months", vaccines: ["Hepatitis A", "MMR", "Varicella"], doseNumber: 1 },
];

export function AddPatientModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPatient } = usePatients();

  const [formData, setFormData] = useState({
    patientFirstName: "",
    patientLastName: "",
    guardianType: "",
    guardianFirstName: "",
    guardianLastName: "",
    parentMobile: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female",
    vaccineName: "",
    doseNumber: 0,
    nextDoseDate: "",
  });

  const [scheduleInfo, setScheduleInfo] = useState<{
    title: string;
    vaccines: string[];
    isOverdue: boolean;
  } | null>(null);

  const selectedVaccine = vaccines.find((v) => v.name === formData.vaccineName);

  const calculateAgeYears = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const getAgeString = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return "";

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years < 0) return "Invalid DOB";
    return `Age: ${years} Year${years !== 1 ? "s" : ""}, ${months} Month${months !== 1 ? "s" : ""}`;
  };

  const calculateAgeWeeks = (dob: string) => {
    if (!dob) return -1;
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return -1;
    const diffTime = today.getTime() - birthDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setFormData((prev) => ({ ...prev, dateOfBirth: dob }));
    
    if (!dob) {
      setScheduleInfo(null);
      return;
    }
    
    const weeks = calculateAgeWeeks(dob);
    if (weeks < 0) return;
    
    const milestone = VACCINE_SCHEDULE.find(m => weeks >= m.minWeeks && weeks <= m.maxWeeks) || VACCINE_SCHEDULE[VACCINE_SCHEDULE.length - 1];
    const isOverdue = weeks - milestone.targetWeeks > 4;
    
    setScheduleInfo({
      title: milestone.title,
      vaccines: milestone.vaccines,
      isOverdue,
    });
    
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dob,
      vaccineName: milestone.vaccines[0],
      doseNumber: milestone.doseNumber,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const vaccine = vaccines.find((v) => v.name === formData.vaccineName);
    if (!vaccine) return;

    const calculatedAge = calculateAgeYears(formData.dateOfBirth);
    const fullName = `${formData.patientFirstName} ${formData.patientLastName}`;
    const startingDoseNumber = Math.max(1, formData.doseNumber);
    const completedCount = Math.max(0, startingDoseNumber - 1);

    const timeline: { dose: number; date: string; status: "completed" | "pending" }[] = [];
    if (formData.nextDoseDate) {
      const baseDate = new Date(formData.nextDoseDate);
      for (let i = 0; i < vaccine.doses; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + (i * 28));
        const dt = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        timeline.push({
          dose: i + 1,
          date: dt,
          status: i < completedCount ? "completed" : "pending"
        });
      }
    }

    addPatient({
      name: fullName,
      patientFirstName: formData.patientFirstName,
      patientLastName: formData.patientLastName,
      fatherFirstName: formData.guardianType === "father" ? formData.guardianFirstName : "",
      fatherLastName: formData.guardianType === "father" ? formData.guardianLastName : "",
      motherFirstName: formData.guardianType === "mother" ? formData.guardianFirstName : "",
      motherLastName: formData.guardianType === "mother" ? formData.guardianLastName : "",
      guardianFirstName: formData.guardianType === "guardian" ? formData.guardianFirstName : "",
      guardianLastName: formData.guardianType === "guardian" ? formData.guardianLastName : "",
      parentMobile: formData.parentMobile,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      age: calculatedAge,
      vaccineName: vaccine.name,
      vaccineType: vaccine.type,
      totalDoses: vaccine.doses,
      dosesCompleted: completedCount,
      status: completedCount >= vaccine.doses ? "completed" : "pending",
      nextDoseDate: formData.nextDoseDate,
      timeline,
      completionDate: completedCount >= vaccine.doses && timeline.length > 0 ? timeline[timeline.length - 1].date : undefined,
    });

    toast.success("Patient Added", {
      description: `${fullName} has been added to the system`,
    });

    setFormData({
      patientFirstName: "",
      patientLastName: "",
      guardianType: "",
      guardianFirstName: "",
      guardianLastName: "",
      parentMobile: "",
      dateOfBirth: "",
      gender: "male",
      vaccineName: "",
      doseNumber: 0,
      nextDoseDate: "",
    });
    setScheduleInfo(null);
    setOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Patient
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-primary" />
                  Add New Patient
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Patient & Parent Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientFirstName">Patient First Name</Label>
                      <Input
                        id="patientFirstName"
                        placeholder="First name"
                        value={formData.patientFirstName}
                        onChange={(e) =>
                          setFormData({ ...formData, patientFirstName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientLastName">Patient Last Name</Label>
                      <Input
                        id="patientLastName"
                        placeholder="Last name"
                        value={formData.patientLastName}
                        onChange={(e) =>
                          setFormData({ ...formData, patientLastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Guardian Type & Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Guardian Type</Label>
                      <Select
                        value={formData.guardianType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, guardianType: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select guardian type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="guardian">Other Guardian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {formData.guardianType && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-2 gap-4 overflow-hidden"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="guardianFirstName">Guardian First Name</Label>
                            <Input
                              id="guardianFirstName"
                              placeholder="First name"
                              value={formData.guardianFirstName}
                              onChange={(e) =>
                                setFormData({ ...formData, guardianFirstName: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardianLastName">Guardian Last Name</Label>
                            <Input
                              id="guardianLastName"
                              placeholder="Last name"
                              value={formData.guardianLastName}
                              onChange={(e) =>
                                setFormData({ ...formData, guardianLastName: e.target.value })
                              }
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Parent Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="parentMobile">Parent Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="parentMobile"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.parentMobile}
                        onChange={(e) =>
                          setFormData({ ...formData, parentMobile: e.target.value })
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="space-y-3">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        gender: value as "male" | "female",
                      })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center">
                      <RadioGroupItem value="male" id="male" className="peer sr-only" />
                      <Label
                        htmlFor="male"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500"><circle cx="10" cy="14" r="5"/><line x1="13.54" y1="10.46" x2="21" y2="3"/><polyline points="16 3 21 3 21 8"/></svg>
                        Boy
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="female" id="female" className="peer sr-only" />
                      <Label
                        htmlFor="female"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-pink-500"><circle cx="12" cy="10" r="5"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/></svg>
                        Girl
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Date of Birth & Auto Age */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleDobChange}
                    required
                  />
                  {formData.dateOfBirth && (
                    <p className="text-sm font-medium text-primary mt-1">
                      {getAgeString(formData.dateOfBirth)}
                    </p>
                  )}
                </div>

                {/* Vaccine & Dose Selection */}
                <div className="grid grid-cols-[2fr_1fr] gap-4">
                  <div className="space-y-2">
                    <Label>Vaccine</Label>
                    <Select
                      value={formData.vaccineName}
                      onValueChange={(value) =>
                        setFormData({ ...formData, vaccineName: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vaccine" />
                      </SelectTrigger>
                      <SelectContent>
                        {vaccines.map((vaccine) => (
                          <SelectItem key={vaccine.name} value={vaccine.name}>
                            <div className="flex items-center gap-2">
                              <span>{vaccine.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({vaccine.type}, {vaccine.doses} doses)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doseNumber">Dose Number</Label>
                    <Input
                      id="doseNumber"
                      type="number"
                      min="1"
                      value={formData.doseNumber || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, doseNumber: parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Smart Alerts */}
                {scheduleInfo && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="p-3 bg-[#00897B]/10 border border-[#00897B]/20 rounded-lg">
                      <p className="text-sm font-semibold text-[#00897B]">
                        Recommended for {scheduleInfo.title}:
                      </p>
                      <p className="text-xs text-[#00897B]/80 mt-1 font-medium leading-relaxed">
                        {scheduleInfo.vaccines.join(", ")}
                      </p>
                    </div>
                    {scheduleInfo.isOverdue && (
                      <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                        <p className="text-xs font-semibold text-orange-600">
                          Note: This is a Catch-up dose (Overdue)
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Next Dose Date */}
                <div className="space-y-2">
                  <Label htmlFor="nextDoseDate">First Dose Date</Label>
                  <Input
                    id="nextDoseDate"
                    type="date"
                    value={formData.nextDoseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, nextDoseDate: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
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
                      "Add Patient"
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

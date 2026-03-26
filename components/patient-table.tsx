"use client";

import { motion } from "framer-motion";
import { usePatients, Patient } from "@/lib/patient-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  User,
  Bell,
  CheckCircle2,
  Clock,
  Pencil,
  Phone,
  Baby,
  Syringe,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface PatientTableProps {
  onUpdateStatus: (patient: Patient) => void;
}

export function PatientTable({ onUpdateStatus }: PatientTableProps) {
  const { patients, sendReminder } = usePatients();

  const handleSendReminder = (patient: Patient) => {
    sendReminder(patient.id);
    toast.success("Reminder Sent", {
      description: `Reminder sent to ${patient.name}'s contact`,
    });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getParentName = (patient: Patient) => {
    if (patient.motherFirstName) return `${patient.motherFirstName} ${patient.motherLastName}`;
    if (patient.fatherFirstName) return `${patient.fatherFirstName} ${patient.fatherLastName}`;
    if (patient.guardianFirstName) return `${patient.guardianFirstName} ${patient.guardianLastName}`;
    return "N/A";
  };

  const getAgeString = (dob: string) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return "-";

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
    return `${years} Years, ${months} Months`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">
          Patient Vaccination Records
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage and track patient vaccination progress
        </p>
      </div>

      <div className="overflow-x-auto">
        <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold whitespace-nowrap">Patient Name</TableHead>
              <TableHead className="font-semibold">Gender</TableHead>
              <TableHead className="font-semibold whitespace-nowrap">Age</TableHead>
              <TableHead className="font-semibold">Vaccine</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold whitespace-nowrap">Next Dose</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient, index) => (
              <motion.tr
                key={patient.id}
                initial={{ 
                  opacity: 0, 
                  x: -20,
                  backgroundColor: Number(patient.id) > 1000 ? "rgba(0, 137, 123, 0.2)" : "rgba(0, 0, 0, 0)"
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  backgroundColor: "rgba(0, 0, 0, 0)"
                }}
                transition={{ 
                  opacity: { delay: index * 0.05 },
                  x: { delay: index * 0.05 },
                  backgroundColor: { duration: 1.5, ease: "easeOut" }
                }}
                className="border-b border-border hover:bg-muted/30 transition-colors"
                style={{
                  transitionProperty: "color, border-color, text-decoration-color, fill, stroke"
                }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-offset-2 transition-all ${
                            patient.gender === "female"
                              ? "bg-pink-100 text-pink-600 hover:ring-pink-300 ring-pink-500/50"
                              : "bg-blue-100 text-blue-600 hover:ring-blue-300 ring-blue-500/50"
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-5 shadow-lg rounded-xl border-[#00897B]/20" align="start">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-sm tracking-wide flex items-center gap-2 border-b border-[#00897B]/10 pb-2 mb-3 text-[#00897B]">
                              <User className="w-4 h-4" />
                              Parent Details
                            </h4>
                            <div className="grid gap-3 text-sm bg-muted/20 p-3 rounded-lg border border-[#00897B]/5">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Father:</span>
                                <span className="font-semibold text-foreground text-right">{patient.fatherFirstName ? `${patient.fatherFirstName} ${patient.fatherLastName}` : "N/A"}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Mother:</span>
                                <span className="font-semibold text-foreground text-right">{patient.motherFirstName ? `${patient.motherFirstName} ${patient.motherLastName}` : "N/A"}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1 pt-3 border-t border-[#00897B]/10">
                                <span className="text-muted-foreground font-medium flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#00897B]" /> Mobile:</span>
                                <span className="font-bold text-[#00897B]">{patient.parentMobile || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm tracking-wide flex items-center gap-2 border-b border-[#00897B]/10 pb-2 mb-3 text-[#00897B]">
                              <Shield className="w-4 h-4" />
                              Vaccine Details
                            </h4>
                            <div className="grid gap-3 text-sm bg-muted/20 p-3 rounded-lg border border-[#00897B]/5">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium flex items-center gap-1.5"><Syringe className="w-4 h-4 text-[#00897B]" /> Name:</span>
                                <span className="font-semibold text-foreground text-right">{patient.vaccineName}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1 pt-3 border-t border-[#00897B]/10">
                                <span className="text-muted-foreground font-medium">Type:</span>
                                <span className="font-semibold text-[#00897B] capitalize bg-[#00897B]/10 px-2.5 py-0.5 rounded-full">{patient.vaccineType}</span>
                              </div>
                            </div>
                          </div>

                          {/* Vaccination Timeline */}
                          {patient.timeline && patient.timeline.length > 0 && (
                            <div className="mt-2">
                              <h4 className="font-bold text-sm tracking-wide flex items-center gap-2 border-b border-[#00897B]/10 pb-2 mb-4 text-[#00897B]">
                                <Clock className="w-4 h-4" />
                                Vaccination Timeline
                              </h4>
                              <div className="relative border-l-2 border-[#00897B]/20 ml-3 space-y-4">
                                {patient.timeline.map((t) => (
                                  <div key={t.dose} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      t.status === 'completed' 
                                        ? 'bg-[#00897B] border-[#00897B] text-white' 
                                        : 'bg-background border-muted-foreground text-background'
                                    }`}>
                                      {t.status === 'completed' ? (
                                        <CheckCircle2 className="w-3 h-3 min-w-[12px] min-h-[12px]" />
                                      ) : (
                                        <Clock className="w-2.5 h-2.5 text-muted-foreground opacity-0" />
                                      )}
                                    </div>
                                    <p className="text-sm font-semibold text-foreground leading-none">Dose {t.dose}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        t.status === 'completed' ? 'bg-[#00897B]/10 text-[#00897B]' : 'bg-orange-500/10 text-orange-600'
                                      }`}>
                                        {t.status === 'completed' ? 'Completed' : 'Pending'}
                                      </span>
                                      <p className="text-xs text-muted-foreground font-medium">{formatDate(t.date)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <span className="font-medium text-card-foreground">
                      {patient.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {patient.gender === "female" ? (
                      <Baby className="w-5 h-5 text-pink-500" strokeWidth={2.5} />
                    ) : (
                      <Baby className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
                    )}
                    <span className="text-muted-foreground capitalize font-medium">
                      {patient.gender === "female" ? "Girl" : "Boy"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-card-foreground whitespace-nowrap">
                  {getAgeString(patient.dateOfBirth)}
                </TableCell>
                <TableCell className="font-medium text-card-foreground whitespace-nowrap">
                  {patient.vaccineName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      patient.vaccineType === "viral"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-chart-3 bg-chart-3/10 text-chart-3"
                    }
                  >
                    {patient.vaccineType === "viral" ? "Viral" : "Bacterial"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {patient.dosesCompleted}/{patient.totalDoses} doses
                      </span>
                      <span className="font-medium text-card-foreground">
                        {Math.round(
                          (patient.dosesCompleted / patient.totalDoses) * 100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (patient.dosesCompleted / patient.totalDoses) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {patient.status === "completed" ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-success text-success-foreground gap-1 cursor-help">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 text-white border-slate-800">
                        <p>Completed on: {patient.completionDate ? formatDate(patient.completionDate) : "Unknown"}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-warning bg-warning/10 text-warning gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-card-foreground">
                  {patient.status === "completed" ? (
                    <span className="text-muted-foreground font-medium text-sm">Done</span>
                  ) : (
                    <span className="font-semibold text-foreground">
                      {formatDate(patient.timeline?.find(t => t.status === "pending")?.date || patient.nextDoseDate)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onUpdateStatus(patient)}
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit Details</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update Details</p>
                      </TooltipContent>
                    </Tooltip>

                    {patient.status === "pending" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSendReminder(patient)}
                          >
                            <Bell className="w-4 h-4" />
                            <span className="sr-only">Send Reminder</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send Reminder</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}

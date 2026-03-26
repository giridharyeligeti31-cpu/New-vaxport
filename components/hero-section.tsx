"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { usePatients } from "@/lib/patient-context";
import { Users, CheckCircle, Clock, Calendar } from "lucide-react";

export function HeroSection() {
  const { user } = useAuth();
  const { patients } = usePatients();

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Completed",
      value: patients.filter((p) => p.status === "completed").length,
      icon: CheckCircle,
      color: "bg-success/10 text-success",
    },
    {
      label: "Pending",
      value: patients.filter((p) => p.status === "pending").length,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "This Week",
      value: patients.filter((p) => {
        if (!p.nextDoseDate) return false;
        const doseDate = new Date(p.nextDoseDate);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return doseDate >= now && doseDate <= weekFromNow;
      }).length,
      icon: Calendar,
      color: "bg-chart-2/10 text-chart-2",
    },
  ];

  return (
    <section className="py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Doctor"}!
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Here&apos;s an overview of your vaccination management dashboard.
            Track patient progress, schedule appointments, and send reminders
            all in one place.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-card-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/doctor-patient.jpg"
              alt="Doctor with patient"
              className="w-full h-48 lg:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

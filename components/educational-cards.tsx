"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

const educationalContent = [
  {
    image: "/images/vaccine-card-1.jpg",
    title: "Why Vaccinations Matter",
    description:
      "Vaccines protect children from serious diseases and help build community immunity. Regular vaccination schedules ensure optimal protection.",
  },
  {
    image: "/images/vaccine-card-2.jpg",
    title: "Understanding Vaccine Schedules",
    description:
      "Following the recommended vaccine schedule gives children the best protection at the right time, when they're most vulnerable to diseases.",
  },
  {
    image: "/images/vaccine-card-3.jpg",
    title: "Post-Vaccination Care",
    description:
      "After vaccination, mild side effects are normal. Comfort your child, apply cool cloths to the injection site, and contact your doctor if concerned.",
  },
];

export function EducationalCards() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Educational Resources
            </h3>
            <p className="text-sm text-muted-foreground">
              Share these with parents and guardians
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="w-8 h-8"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="w-8 h-8"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {educationalContent.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="snap-start"
          >
            <Card className="w-80 flex-shrink-0 overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-card-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

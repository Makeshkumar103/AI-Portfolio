"use client";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "3+", label: "Years Experience" },
    { value: "10+", label: "Technologies" },
    { value: "15+", label: "Projects Shipped" },
    { value: "5", label: "Certifications" },
  ];

  return (
    <div className="relative z-10 my-8 lg:my-12">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="glass glow-border group rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1">
              <p className="text-3xl font-extrabold sm:text-4xl">
                <span className="gradient-text">{stat.value}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

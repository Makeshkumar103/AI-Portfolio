"use client";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar } from "lucide-react";

export default function EducationSection() {
  const education = [
    {
      degree: "Bachelor of Engineering in Computer Science",
      institution: "Anna University",
      location: "Chennai, India",
      date: "2019 - 2023",
      score: "CGPA: 8.5/10",
    }
  ];

  return (
    <div id="education" className="relative z-10 border-t my-12 lg:my-24 border-gray-200 scroll-mt-24">
      <div className="flex justify-center my-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center"
        >
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-r from-transparent to-violet-400"></span>
          <span className="relative mx-1 w-fit rounded-md bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2 text-xl font-semibold text-white shadow-md shadow-violet-200">
            Education
          </span>
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400"></span>
        </motion.div>
      </div>

      <div className="py-8">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 md:left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-pink-500 via-violet-600 to-transparent"></div>
          
          <div className="flex flex-col gap-10">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-16 md:pl-20"
              >
                <span className="absolute left-2 md:left-3 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/30">
                  <GraduationCap size={20} />
                </span>
                
                <div className="glass glow-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#1e2235]">{edu.degree}</h3>
                  <p className="text-violet-600 font-semibold mt-1">{edu.institution}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <Calendar size={14} className="text-pink-500" /> {edu.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <MapPin size={14} className="text-teal-500" /> {edu.location}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-sm font-medium text-gray-700 bg-white/50 inline-block px-3 py-1 rounded-md border border-gray-200">
                    {edu.score}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

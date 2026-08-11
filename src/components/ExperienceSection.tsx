"use client";
import { motion } from "framer-motion";
import { Briefcase, MapPin, CheckCircle2 } from "lucide-react";

export default function ExperienceSection() {
  const experiences = [
    {
      date: "Dec 2025 - Present",
      role: "Full Stack & AI Engineer",
      company: "Constient Global Solutions",
      location: "Chennai",
      achievements: [
        "Designed and built an AI-powered chatbot using LLMs and Retrieval-Augmented Generation (RAG) to deliver accurate, context-aware answers over enterprise data.",
        "Implemented semantic search and document retrieval with pgvector on PostgreSQL and Elasticsearch, generating and indexing embeddings for fast similarity matching.",
        "Developed LLM-driven pipelines to extract and structure data from unstructured documents, improving accuracy and reducing manual effort.",
        "Integrated multiple LLM APIs with prompt engineering to optimize response accuracy, latency and cost.",
      ],
    },
    {
      date: "Sep 2023 - Dec 2025",
      role: "Full Stack Developer & Team Lead",
      company: "Genpixels Tech Pvt Ltd",
      location: "Coimbatore",
      achievements: [
        "Designed and shipped responsive full-stack web applications end-to-end across frontend (React, Next.js) and backend (Node.js, Python).",
        "Built secure REST APIs and integrated the Razorpay payment gateway for seamless, reliable online transactions.",
        "Deployed and scaled applications on AWS using EC2, RDS, S3, Elastic Beanstalk, Amplify and CodePipeline.",
        "Led a development team — assigning tasks, reviewing code and mentoring members — to deliver projects on schedule with high code quality.",
      ],
    },
  ];

  return (
    <div id="experience" className="relative z-10 border-t my-12 lg:my-24 border-gray-200 scroll-mt-24">
      <div className="flex justify-center my-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center"
        >
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-r from-transparent to-violet-400"></span>
          <span className="relative mx-1 w-fit rounded-md bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2 text-xl font-semibold text-white shadow-md shadow-violet-200">
            Experience
          </span>
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400"></span>
        </motion.div>
      </div>

      <div className="py-8">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 md:left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-pink-500 via-violet-600 to-transparent"></div>
          
          <div className="flex flex-col gap-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pl-16 md:pl-20"
              >
                <span className="absolute left-2 md:left-3 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/30">
                  <Briefcase size={18} />
                </span>
                
                <div className="glass glow-border rounded-2xl p-6">
                  <p className="text-sm font-medium text-teal-600 mb-1">{exp.date}</p>
                  <h3 className="text-xl font-semibold text-[#1e2235]">{exp.role}</h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-gray-600">
                    <span className="font-semibold text-violet-600">{exp.company}</span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={14} /> {exp.location}
                    </span>
                  </p>
                  
                  <ul className="mt-5 flex flex-col gap-3">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                        <CheckCircle2 className="mt-0.5 flex-shrink-0 text-teal-500" size={16} />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

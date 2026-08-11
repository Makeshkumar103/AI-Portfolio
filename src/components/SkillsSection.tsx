"use client";
import { motion } from "framer-motion";
import { Code2, LayoutTemplate, Server } from "lucide-react";

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "AI / LLM",
      icon: <Code2 />,
      skills: ["AI Chatbots", "RAG", "LLM APIs", "Vector Search (pgvector)", "AI Data Extraction", "Embeddings", "Prompt Engineering"],
    },
    {
      title: "Frontend",
      icon: <LayoutTemplate />,
      skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "React Query", "Material UI", "Tailwind CSS"],
    },
    {
      title: "Backend",
      icon: <Server />,
      skills: ["Node.js (Express)", "Nest.js", "Python (Django)", "Strapi"],
    },
  ];

  return (
    <div id="skills" className="relative z-10 border-t my-12 lg:my-24 border-gray-200 scroll-mt-24">
      <div className="flex justify-center my-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center"
        >
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-r from-transparent to-violet-400"></span>
          <span className="relative mx-1 w-fit rounded-md bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2 text-xl font-semibold text-white shadow-md shadow-violet-200">
            Skills
          </span>
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400"></span>
        </motion.div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="glass glow-border h-full rounded-2xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-pink-100 text-xl text-violet-600">
                  {category.icon}
                </span>
                <h3 className="text-lg font-semibold text-[#1e2235]">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="cursor-default rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs sm:text-sm text-gray-700 transition-colors duration-300 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import { FolderGit2, ExternalLink } from "lucide-react";
// import { FolderGit2, ExternalLink, Github } from "lucide-react";

import Link from "next/link";

export default function ProjectsSection() {
  const projects = [
    {
      title: "AI Enterprise Knowledge Base",
      description: "A RAG-powered chatbot application that allows enterprise users to query their internal documents securely. Built with Next.js, FastAPI, and pgvector.",
      tags: ["Next.js", "Python", "pgvector", "LLMs"],
      github: "#",
      demo: "#",
    },
    {
      title: "E-Commerce Payment Gateway",
      description: "A robust e-commerce platform with seamless Razorpay integration, dynamic cart management, and admin dashboard.",
      tags: ["React", "Node.js", "MongoDB", "Razorpay"],
      github: "#",
      demo: "#",
    },
    {
      title: "Automated Data Extractor",
      description: "An LLM-driven pipeline that ingests unstructured PDFs and extracts structured JSON data for financial analysis.",
      tags: ["Python", "OpenAI API", "AWS S3"],
      github: "#",
      demo: "#",
    },
  ];

  return (
    <div id="projects" className="relative z-10 border-t my-12 lg:my-24 border-gray-200 scroll-mt-24">
      <div className="flex justify-center my-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center"
        >
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-r from-transparent to-violet-400"></span>
          <span className="relative mx-1 w-fit rounded-md bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2 text-xl font-semibold text-white shadow-md shadow-violet-200">
            <span className="flex items-center gap-2">
              <FolderGit2 className="text-yellow-300" /> Projects
            </span>
          </span>
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400"></span>
        </motion.div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="glass glow-border group h-full flex flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-bold text-[#1e2235] mb-3">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, i) => (
                  <span key={i} className="rounded-full border border-pink-200 bg-pink-50 px-2 py-1 text-[10px] sm:text-xs text-pink-700 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                {/* <Link href={project.github} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors">
                  <Github size={18} /> Code
                </Link> */}
                <Link href={project.demo} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors">
                  <ExternalLink size={18} /> Live Demo
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

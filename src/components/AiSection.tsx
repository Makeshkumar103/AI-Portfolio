"use client";
import { motion } from "framer-motion";
import { Sparkles, Database, BrainCircuit, Network } from "lucide-react";

export default function AiSection() {
  const aiSkills = [
    {
      icon: <Sparkles />,
      title: "AI Chatbots & RAG",
      description: "Designed and built AI-powered chatbots using LLMs and Retrieval-Augmented Generation to deliver accurate, context-aware answers over enterprise data.",
      tags: ["LLM", "RAG", "Context-aware"],
    },
    {
      icon: <Database />,
      title: "Vector Search",
      description: "Implemented semantic search and document retrieval with pgvector on PostgreSQL and Elasticsearch — generating and indexing embeddings for fast, relevant similarity matching.",
      tags: ["pgvector", "Embeddings", "Elasticsearch"],
    },
    {
      icon: <Network />,
      title: "AI Data Extraction",
      description: "Developed LLM-driven pipelines that extract and structure data from unstructured documents and text — improving data accuracy and reducing manual effort.",
      tags: ["Pipelines", "Unstructured Data", "Accuracy"],
    },
    {
      icon: <BrainCircuit />,
      title: "LLM Integration",
      description: "Integrated multiple LLM APIs and applied prompt engineering to optimize chatbot response accuracy, latency and cost — exposed securely through REST APIs.",
      tags: ["LLM APIs", "Prompt Engineering", "REST"],
    },
  ];

  return (
    <div id="ai" className="relative z-10 border-t my-12 lg:my-24 border-gray-200 scroll-mt-24">
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
              <Sparkles className="text-yellow-300" /> AI / LLM Engineering
            </span>
          </span>
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400"></span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-10 max-w-2xl text-center"
      >
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
          Building intelligent, context-aware products with Large Language Models, Retrieval-Augmented Generation and semantic vector search — from embeddings and pipelines to production-ready APIs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {aiSkills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="glass glow-border group h-full rounded-2xl p-6 lg:p-7">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 text-2xl text-violet-600 transition-transform duration-300 group-hover:scale-110">
                  {skill.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-[#1e2235]">{skill.title}</h3>
              </div>
              <p className="mb-5 text-sm lg:text-[0.95rem] text-gray-600 leading-relaxed">{skill.description}</p>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, i) => (
                  <span key={i} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700">
                    {tag}
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

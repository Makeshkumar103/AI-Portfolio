"use client";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <div id="about" className="my-12 lg:my-20 relative scroll-mt-24">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
        <span className="bg-gradient-to-b from-violet-600 to-pink-500 w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md shadow-md shadow-violet-200 tracking-widest whitespace-nowrap">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-gradient-to-b from-violet-400 to-transparent mt-[85px]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <p className="font-semibold mb-5 text-teal-600 text-xl uppercase tracking-wide">
            Who I am?
          </p>
          <p className="text-gray-600 text-sm lg:text-lg leading-relaxed">
            Hi, I'm Makeshkumar — a Full Stack & AI Engineer with 1 year of experience building scalable, high-performance web applications across the frontend and backend.<br /><br />
            I specialize in AI-powered features such as intelligent chatbots built on Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG), backed by vector search. I work fluently across React, Next.js, Node.js, Python and cloud platforms, and I've successfully delivered reliable, production-ready solutions.<br /><br />
            I love turning complex problems into clean, intuitive products — and I'm always eager to take on new challenges in fast-paced, dynamic environments.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center order-1 lg:order-2"
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-pink-400 via-violet-500 to-teal-400 opacity-70 blur-md"></div>
            {/* <div className="relative rounded-2xl bg-white p-1.5 shadow-lg w-[300px] h-[300px] flex items-center justify-center overflow-hidden"> */}
            <div className="relative rounded-2xl bg-white p-1.5 shadow-lg w-[350px] h-[450px] flex items-center justify-center overflow-hidden">

              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl font-bold text-gray-400 text-2xl">
                {/* PROFILE IMAGE */}
                <img src="/hprofile.png" alt="profile.png" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

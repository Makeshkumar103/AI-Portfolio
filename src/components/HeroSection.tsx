"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import { Mail, Download } from "lucide-react";
// import { Github, Linkedin, Twitter, Mail, Download } from "lucide-react";


export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between py-8 lg:py-16">
      <div className="grid grid-cols-1 items-center lg:grid-cols-2 lg:gap-12 gap-y-10 w-full">
        {/* Left side text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="order-2 lg:order-1 flex flex-col items-start justify-center p-2"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50 px-4 py-1.5 text-xs font-medium text-teal-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            </span>
            Available for opportunities
          </motion.span>
          <h1 className="text-3xl font-bold leading-tight text-[#1e2235] md:font-extrabold lg:text-[2.7rem] lg:leading-[3.4rem]">
            Hello, I'm <br />
            <span className="gradient-text">MAKESHKUMAR</span>
          </h1>
          <div className="mt-3 text-xl md:text-2xl font-semibold text-gray-700 min-h-[2.2rem]">
            <Typewriter
              words={["Full Stack Engineer", "AI Engineer", "Software Developer"]}
              loop={0} // infinite loop
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
          <p className="mt-5 max-w-xl text-sm lg:text-base text-gray-600 leading-relaxed">
            I build scalable, production-ready web apps and AI-powered features — intelligent chatbots, RAG pipelines and vector search — with a focus on clean, intuitive product experiences.
          </p>
          <div className="my-8 flex items-center gap-5">
            {/* <Link href="https://github.com/" target="_blank" className="text-gray-500 transition-colors duration-300 hover:text-pink-600">
              <Github size={28} />
            </Link>
            <Link href="https://linkedin.com/" target="_blank" className="text-gray-500 transition-colors duration-300 hover:text-pink-600">
              <Linkedin size={28} />
            </Link>
            <Link href="https://twitter.com/" target="_blank" className="text-gray-500 transition-colors duration-300 hover:text-pink-600">
              <Twitter size={28} />
            </Link> */}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="#contact" className="group rounded-full bg-gradient-to-r from-violet-600 to-pink-500 p-[1px] transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30">
              <button className="flex items-center gap-1 rounded-full border-none bg-white px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-[#1e2235] transition-all duration-200 group-hover:gap-3 md:px-8 md:py-4 md:text-sm md:font-semibold">
                <span>Contact me</span>
                <Mail size={16} />
              </button>
            </Link>
            <Link href="#" target="_blank" className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 hover:gap-3 hover:shadow-lg hover:shadow-violet-500/30 md:px-8 md:py-4 md:text-sm md:font-semibold">
              <span>Get Resume</span>
              <Download size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Right side code window */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="order-1 lg:order-2"
        >
          <div className="relative rounded-xl border border-[#1b2c68a0] bg-[#0d1224] shadow-2xl shadow-violet-500/20">
            <div className="flex flex-row">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
            </div>
            <div className="px-4 lg:px-8 py-5">
              <div className="flex flex-row space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-300"></div>
              </div>
            </div>
            <div className="overflow-x-auto border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
              <code className="font-mono text-xs md:text-sm lg:text-base leading-relaxed whitespace-pre block">
                <div><span className="mr-2 text-pink-500">const</span><span className="mr-2 text-white">engineer</span><span className="mr-2 text-pink-500">=</span><span className="text-gray-400">{`{`}</span></div>
                <div><span className="ml-4 lg:ml-8 mr-2 text-white">name:</span><span className="text-amber-300">'Makeshkumar'</span><span className="text-gray-400">,</span></div>
                <div><span className="ml-4 lg:ml-8 mr-2 text-white">role:</span><span className="text-amber-300">'Full Stack & AI Engineer'</span><span className="text-gray-400">,</span></div>
                <div className="ml-4 lg:ml-8 mr-2">
                  <span className="text-white">expertise:</span><span className="text-gray-400"> ['</span>
                  <span className="text-amber-300">RAG</span><span className="text-gray-400">', '</span>
                  <span className="text-amber-300">LLMs</span><span className="text-gray-400">', '</span>
                  <span className="text-amber-300">Next.js</span><span className="text-gray-400">', '</span>
                  <span className="text-amber-300">Node.js</span><span className="text-gray-400">', '</span>
                  <span className="text-amber-300">Python</span>
                  <span className="text-gray-400"></span>
                  {/* <span className="text-amber-300">AWS</span> */}
                  <span className="text-gray-400">'],</span>
                </div>
                <div><span className="ml-4 lg:ml-8 mr-2 text-white">hardWorker:</span><span className="text-orange-400">true</span><span className="text-gray-400">,</span></div>
                <div><span className="ml-4 lg:ml-8 mr-2 text-white">quickLearner:</span><span className="text-orange-400">true</span><span className="text-gray-400">,</span></div>
                <div><span className="ml-4 lg:ml-8 mr-2 text-green-400">hireable:</span><span className="text-orange-400">function</span><span className="text-gray-400">() {`{`}</span></div>
                <div><span className="ml-8 lg:ml-16 mr-2 text-orange-400">return</span><span className="text-gray-400">(</span></div>
                <div><span className="ml-12 lg:ml-24 text-cyan-400">this.</span><span className="mr-2 text-white">hardWorker</span><span className="text-amber-300">&amp;&amp;</span></div>
                <div><span className="ml-12 lg:ml-24 text-cyan-400">this.</span><span className="mr-2 text-white">quickLearner</span><span className="text-amber-300">&amp;&amp;</span></div>
                <div><span className="ml-12 lg:ml-24 text-cyan-400">this.</span><span className="mr-2 text-white">expertise.length</span><span className="mr-2 text-amber-300">&gt;=</span><span className="text-orange-400">5</span></div>
                <div><span className="ml-8 lg:ml-16 mr-2 text-gray-400">);</span></div>
                <div><span className="ml-4 lg:ml-8 text-gray-400">{`}`}</span></div>
                <div><span className="text-gray-400">{`}`};</span></div>
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

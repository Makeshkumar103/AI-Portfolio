"use client";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <div id="contact" className="relative z-10 border-t my-12 lg:my-24 border-gray-200 scroll-mt-24">
      <div className="flex justify-center my-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center"
        >
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-r from-transparent to-violet-400"></span>
          <span className="relative mx-1 w-fit rounded-md bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2 text-xl font-semibold text-white shadow-md shadow-violet-200">
            Contact Me
          </span>
          <span className="w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-pink-400"></span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-[#1e2235] mb-4">Let's Connect</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base font-semibold text-[#1e2235]">Makeshlg6@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base font-semibold text-[#1e2235]">Chennai, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass glow-border rounded-2xl p-8">
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">Your Name</label>
                <input type="text" id="name" className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Your Email</label>
                <input type="email" id="email" className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1 block">Your Message</label>
                <textarea id="message" rows={4} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none" placeholder="Hello, I'd like to talk about..."></textarea>
              </div>
              <button className="flex items-center justify-center gap-2 w-full mt-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-500/30 hover:shadow-lg transition-all hover:opacity-90">
                Send Message <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

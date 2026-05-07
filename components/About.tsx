"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="about" className="bg-bone py-24 md:py-32" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
        >
          <div>
            <motion.p variants={itemVariants} className="section-label text-amber mb-4">Who I am</motion.p>
            <motion.h2
              id="about-heading"
              variants={itemVariants}
              className="font-syne font-semibold text-3xl md:text-5xl tracking-tighter text-slate mb-8 leading-tight"
            >
              I'm Gabe. I build with people, not for them.
            </motion.h2>

            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-steel mb-5">
              I trained as a mechanical engineer at MIT, then spent the next decade building software companies — Grove Labs (acquired by LG), Imbellus, Revonate (CTO), Maxable (CEO), and most recently LeanLaw, where I led product through the company's pivot from SaaS billing into payments and financial services.
            </motion.p>

            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-steel mb-5">
              Somewhere in there I walked the Appalachian Trail. 2,181 miles. Six months. The most useful thing it taught me: the right pack is the one you can actually carry.
            </motion.p>

            <motion.p variants={itemVariants} className="font-inter text-base leading-body text-steel mb-8">
              I think about software the same way. The right system is the one you can actually run.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link
                href="/about"
                className="font-inter text-sm font-medium border border-slate/30 text-slate px-6 py-3 hover:bg-slate hover:text-white transition-colors inline-block"
              >
                More about me →
              </Link>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="aspect-[4/5] border border-dust bg-white relative overflow-hidden">
              <Image
                src="/founder.jpeg"
                alt="Gabe Blanchet, founder of Fieldwork AI"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
            <p className="font-inter text-xs text-steel/60 italic">Boise, Idaho. Husband, father of two, builder by training.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";

export default function Projects() {
  return (
    <main>
      <section id="projects">
        <Link href="#projects" className="group flex items-center py-5">
          <span className="mr-4 h-px w-20 bg-indigo-700 md:group-hover:w-32 transition-all motion-reduce:transition-none"></span>
          <span>Projects</span>
        </Link>
      </section>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaDiscord,
  FaGithubSquare,
  FaInstagramSquare,
} from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import Projects from "./projects/page";
import Skills from "./skills/page";

export default function HomePage() {
  const [isEndOfPage, setIsEndOfPage] = useState(false);

  const checkScrollPosition = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const scrolledToBottom = Math.ceil(scrollTop + windowHeight) >= docHeight;

    setIsEndOfPage(scrolledToBottom);
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <main className="scroll-smooth">
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:px-24">
        <header className="mb-24 min-h-screen justify-center items-center flex flex-col md:pb-32 text-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="z-10 text-4xl duration-1000 text-slate-300 font-display sm:text-6xl md:text-9xl animate-pulse">
              xhal
            </h1>
            <p className="text-xs sm:text-xl md:text-2xl mb-5 leading-8 text-gray-400">
              Electronics Engineering Student | Frontend Web Developer |
              Passionate about Tech and Innovation.
            </p>
          </div>
          <nav className="flex flex-row space-x-5 w-5 h-5 justify-center align-middle items-center">
            <div className="space-x-3">
              <Link
                href="#projects"
                className="text-black font-extrabold py-1 text-[9pt] tracking-widest rounded-md border-[1px] bg-slate-300 border-slate-200 px-3 hover:border-indigo-600 hover:bg-indigo-700  transition-colors duration-300 ease-in-out"
              >
                Projects
              </Link>
              <Link
                href="#skills"
                className="text-black font-extrabold py-1 text-[9pt] tracking-widest rounded-md border-[1px] bg-slate-300 border-slate-200 px-3 hover:border-indigo-600 hover:bg-indigo-700  transition-colors duration-300 ease-in-out"
              >
                Skills
              </Link>
            </div>
            <Link
              href="https://www.linkedin.com/in/tommydeleon/"
              target="_blank"
              className="text-xl sm:text-3xl md:text-4xl text-slate-300 hover:text-indigo-700 shadow-2xl ease-in-out duration-300"
            >
              <IoLogoLinkedin></IoLogoLinkedin>
            </Link>
            <Link
              href="https://github.com/TommyDeLeon"
              target="_blank"
              className="text-xl sm:text-3xl md:text-4xl text-slate-300 hover:text-indigo-700 ease-in-out duration-300"
            >
              <FaGithubSquare></FaGithubSquare>
            </Link>
            <Link
              href="https://www.instagram.com/tomdeleon_/"
              target="_blank"
              className="text-xl sm:text-3xl md:text-4xl text-slate-300 hover:text-indigo-700 ease-in-out duration-300"
            >
              <FaInstagramSquare></FaInstagramSquare>
            </Link>
            <Link
              href="https://www.discordapp.com/users/701646897869357067"
              target="_blank"
              className="text-xl sm:text-3xl md:text-4xl text-slate-300 hover:text-indigo-700 ease-in-out duration-500"
            >
              <FaDiscord></FaDiscord>
            </Link>
          </nav>
          <div id="scrollIndicator">
            {!isEndOfPage && (
              <div className="fixed mb-0 md:mb-24 bottom-0 left-0 right-0 flex justify-center">
                <FaArrowDown className="animate-bounce h-10"></FaArrowDown>
              </div>
            )}
          </div>
        </header>
        <main>
          <Skills></Skills>
          <Projects></Projects>
        </main>
        <footer></footer>
      </div>
      <div className="mx-auto max-w-screen-xl px-6 md:px-12 lg:px-24 mb-12 italic">
        <h2>Under Development.</h2>
        <p>Tommy De Leon</p>
      </div>
    </main>
  );
}

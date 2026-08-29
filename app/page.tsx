import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Adjacency from "@/components/adjacency";
import Story from "@/components/story";
import Capability from "@/components/capability";
import Projects from "@/components/projects";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import MotionLayer from "@/components/motion-layer";
import ThemeShots from "@/components/theme-shots";
import { hasStory } from "@/content/story";
import { projects } from "@/content/projects";

/**
 * Nav is built from what is actually rendered, so a link can never point at a
 * section that does not exist.
 */
/*
  Work leads, Capability follows.

  The page now opens by emphasising what Tommy builds, and the honest order for
  that argument is evidence first: one shipped project with a written-up case
  study behind it is a stronger claim than a list of things he is training on.
  Capability then reads as the qualifying detail after the proof, rather than as
  the opening pitch -- which also suits a section whose whole point is admitting
  which half is not earned yet.
*/
const navLinks = [
  ...(projects.length ? [{ href: "#work", label: "Work" }] : []),
  { href: "#capability", label: "Capability" },
  ...(hasStory ? [{ href: "#story", label: "About" }] : []),
  { href: "#contact", label: "Contact" },
];

export default function HomePage() {
  return (
    <>
      <Nav links={navLinks} />
      <main id="main">
        <Hero />
        <Adjacency />
        <Projects />
        <Capability />
        <Story />
        <Contact />
      </main>
      <Footer links={navLinks} />
      <MotionLayer />
      <ThemeShots />
    </>
  );
}

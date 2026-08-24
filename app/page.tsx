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
const navLinks = [
  { href: "#capability", label: "Capability" },
  ...(projects.length ? [{ href: "#work", label: "Work" }] : []),
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
        <Capability />
        <Projects />
        <Story />
        <Contact />
      </main>
      <Footer links={navLinks} />
      <MotionLayer />
      <ThemeShots />
    </>
  );
}

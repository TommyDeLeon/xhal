/**
 * Split by what is true today.
 *
 * "building" means Tommy has shipped something with it and can be asked about
 * it in an interview. "learning" means he is actively working through it and
 * the site says so rather than implying otherwise. Nothing is listed as
 * capability that has not been earned.
 */

export type SkillGroup = {
  id: string;
  title: string;
  status: "building" | "learning";
  blurb: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "network-fundamentals",
    title: "Network fundamentals",
    status: "learning",
    blurb:
      "How data finds its way from one machine to another, and how networks are kept apart. Most of my study time goes here.",
    items: [
      "TCP/IP & the OSI model",
      "Subnetting and VLSM",
      "Routing and switching",
      "VLANs and segmentation",
      "DNS, DHCP, NAT",
    ],
  },
  {
    id: "security-foundations",
    title: "Security foundations",
    status: "learning",
    blurb:
      "Who is allowed to do what, and how a system proves it.",
    items: [
      "Authentication and authorization",
      "TLS and certificates",
      "Least privilege",
      "Threat modeling",
      "System hardening",
    ],
  },
  {
    id: "software",
    title: "Software I build with",
    status: "building",
    blurb:
      "Everything here was used to build and run CodeLock. Ask me anything about it.",
    items: [
      "TypeScript",
      "Node and Express",
      "React and Next.js",
      "Postgres and Prisma",
      "Electron",
      "Docker",
      "Git",
    ],
  },
  {
    id: "tools",
    title: "Tools I am working with",
    status: "learning",
    blurb:
      "Seeing what is really happening on a network, in a lab, instead of guessing.",
    items: [
      "Wireshark",
      "nmap",
      "Linux command line",
      "pfSense / OPNsense",
      "Virtual lab environments",
    ],
  },
];
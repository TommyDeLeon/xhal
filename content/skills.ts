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
  /** Tailwind col-span for the >=1024px grid. */
  span: string;
  surface: "raised" | "hairline" | "textured";
};

export const skillGroups: SkillGroup[] = [
  {
    id: "network-fundamentals",
    title: "Network fundamentals",
    status: "learning",
    blurb:
      "The layer I am spending most of my time on. Working through how traffic is actually addressed, routed, and separated rather than memorising acronyms.",
    items: [
      "TCP/IP & the OSI model",
      "Subnetting and VLSM",
      "Routing and switching",
      "VLANs and segmentation",
      "DNS, DHCP, NAT",
    ],
    span: "lg:col-span-7",
    surface: "raised",
  },
  {
    id: "security-foundations",
    title: "Security foundations",
    status: "learning",
    blurb:
      "Starting from the question of who is allowed to do what, and how a system proves the answer.",
    items: [
      "Authentication and authorization",
      "TLS and certificates",
      "Least privilege",
      "Threat modeling",
      "System hardening",
    ],
    span: "lg:col-span-5",
    surface: "textured",
  },
  {
    id: "software",
    title: "Software I build with",
    status: "building",
    blurb:
      "This column is not aspirational. Everything here is in CodeLock, which runs an API, a database, a sandboxed execution service, and a desktop shell.",
    items: [
      "TypeScript",
      "Node and Express",
      "React and Next.js",
      "Postgres and Prisma",
      "Docker",
      "Git",
    ],
    span: "lg:col-span-5",
    surface: "raised",
  },
  {
    id: "tools",
    title: "Tools I am working with",
    status: "learning",
    blurb:
      "Learning to read what is on the wire instead of guessing from symptoms, and to run the equipment rather than only read about it.",
    items: [
      "Wireshark",
      "nmap",
      "Linux command line",
      "pfSense / OPNsense",
      "Virtual lab environments",
    ],
    span: "lg:col-span-7",
    surface: "hairline",
  },
];
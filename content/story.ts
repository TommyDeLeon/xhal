export type Story = {
  heading: string;
  paragraphs: string[];
  /** Optional short pull-quote set beside the prose. */
  aside: string | null;
};

export const story: Story = {
  heading: "Why networks",
  paragraphs: [
    "I still find it strange, in a good way, that I can type a name into a browser and reach a machine on the other side of the planet before I finish exhaling. None of that is obvious. The name has to be resolved into an address, a path has to be found across networks that nobody centrally owns, and my laptop has to agree on a shared secret with a stranger it has never spoken to. All of it lands in the time it takes to blink.",
    "What pulled me in was what that makes possible. I like meeting people. Networks are the reason a conversation with someone I have never met costs nothing and takes no time, and the reason distance mostly stopped being an argument.",
    "Sit with that a while and the other question shows up. You do not actually know what is on the other end. You know what it claims to be. Almost everything that makes the good version of this work exists to close that gap: certificates so a name can be proven, encryption so the path in between cannot read the contents, segmentation so one compromised machine does not become all of them. Identity on a wire is a claim until something proves it. That is the part I want to be good at.",
    "I am an Electronics Engineering student, so I came at this from the hardware side first and I am working toward network and security engineering from there. Building software is how I check whether I actually understand something. CodeLock taught me more about trust boundaries than reading did, because the first version let the client decide it was unlocked, and the moment I saw how easily that fell over, the whole idea of where a check belongs finally made sense.",
  ],
  aside: "Identity on a wire is a claim until something proves it.",
};

export const hasStory = story.paragraphs.length > 0;
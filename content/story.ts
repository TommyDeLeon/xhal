export type Story = {
  heading: string;
  paragraphs: string[];
  /** Optional short pull-quote set beside the prose. */
  aside: string | null;
};

export const story: Story = {
  heading: "Why networks",
  paragraphs: [
    "Type a name into a browser and you reach a machine on the other side of the world before you finish exhaling. None of that is obvious. A name has to become an address, a path has to be found across networks nobody owns, and your laptop has to agree on a secret with a stranger. All of it happens in a blink.",
    "That is what hooked me. Networks are why a conversation with someone I have never met costs nothing and takes no time. Distance stopped being an argument.",
    "Then the other question shows up. You never really know what is on the other end, only what it claims to be. Almost everything that keeps the internet safe exists to close that gap. That is the part I want to be good at.",
    "I came at this from the hardware side, as an Electronics Engineering student, and I build software to check that I really understand things. CodeLock taught me more about trust than any textbook: the first version let the app decide it was unlocked, and seeing how easily that fell apart showed me exactly where a check belongs.",
  ],
  aside: "Identity on a wire is a claim until something proves it.",
};

export const hasStory = story.paragraphs.length > 0;
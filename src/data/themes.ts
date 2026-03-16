export interface DayTheme {
  day: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const themes: DayTheme[] = [
  { day: 1, title: "Education", description: "Reimagining learning systems for the next generation", icon: "📚", color: "from-blue-500 to-blue-700" },
  { day: 2, title: "Research & Science", description: "Accelerating breakthroughs across disciplines", icon: "🔬", color: "from-purple-500 to-purple-700" },
  { day: 3, title: "Food & Agriculture", description: "Feeding 10 billion people sustainably", icon: "🌾", color: "from-green-500 to-green-700" },
  { day: 4, title: "Enterprise & Economy", description: "Building resilient economies for all", icon: "🏢", color: "from-amber-500 to-amber-700" },
  { day: 5, title: "Health & Wellbeing", description: "Universal access to health innovation", icon: "🏥", color: "from-red-500 to-red-700" },
  { day: 6, title: "Energy & Climate", description: "Transitioning to a zero-carbon future", icon: "⚡", color: "from-yellow-500 to-yellow-700" },
  { day: 7, title: "Technology & AI", description: "Harnessing tech as a force for good", icon: "🤖", color: "from-cyan-500 to-cyan-700" },
  { day: 8, title: "Culture & Arts", description: "Celebrating diversity through creative expression", icon: "🎨", color: "from-pink-500 to-pink-700" },
  { day: 9, title: "Governance & Peace", description: "Collaborative frameworks for global stability", icon: "🕊️", color: "from-indigo-500 to-indigo-700" },
  { day: 10, title: "Future Generations", description: "Designing the world our children will inherit", icon: "🌍", color: "from-teal-500 to-teal-700" },
];

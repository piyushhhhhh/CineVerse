import { useState } from "react";
import { moods } from "@/data/movies";
import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  onSelectMood: (mood: string | null) => void;
  currentMood: string | null;
}

export default function MoodSelector({
  onSelectMood,
  currentMood,
}: MoodSelectorProps) {
  const moodEmojis: Record<string, string> = {
    Excited: "🎢",
    Happy: "😊",
    Thoughtful: "🤔",
    Melancholic: "😢",
    Tense: "😰",
    Inspired: "✨",
    Nostalgic: "🕰️",
  };

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">I'm in the mood for...</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={currentMood === mood ? "default" : "outline"}
            className={`flex flex-col items-center justify-center h-24 ${
              currentMood === mood
                ? "bg-cineverse-purple hover:bg-cineverse-purple/90"
                : "hover:bg-cineverse-gray hover:text-white"
            }`}
            onClick={() => onSelectMood(currentMood === mood ? null : mood)}
          >
            <span className="text-2xl mb-2">{moodEmojis[mood]}</span>
            <span>{mood}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

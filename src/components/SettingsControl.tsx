import { Settings, AudioWaveform } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { usePlayer } from "@/contexts/PlayerContext";

type SettingsControlProps = {
  className?: string;
  iconClassName?: string;
  align?: "center" | "start" | "end";
  side?: "top" | "bottom" | "left" | "right";
};

export const SettingsControl = ({
  className = "",
  iconClassName = "w-5 h-5",
  align = "end",
  side = "bottom",
}: SettingsControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { showVisualizer, setShowVisualizer } = usePlayer();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Настройки"
          aria-expanded={isOpen}
          className={`p-2 rounded-full border border-transparent transition-all duration-300 hover:text-primary hover:border-border hover:bg-secondary ${
            isOpen ? "text-primary border-border bg-secondary" : "text-muted-foreground"
          } ${className}`}
        >
          <Settings
            className={`${iconClassName} transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} side={side} className="w-80 p-4 rounded-2xl">
        <p className="font-display text-base text-foreground mb-3">Настройки</p>
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-primary">
              <AudioWaveform className="w-4 h-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Саундбар</p>
              <p className="text-xs text-muted-foreground leading-snug">Анимация звука под плеером</p>
            </div>
          </div>
          <Switch
            checked={showVisualizer}
            onCheckedChange={setShowVisualizer}
            aria-label="Показывать саундбар"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

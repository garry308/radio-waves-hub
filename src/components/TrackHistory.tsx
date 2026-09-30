import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfDay, addHours } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Music, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { secondsToMMSS } from "@/lib/utils";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const timeIntervals = [
  { id: "00-04", label: "00:00 - 04:00", start: 0 },
  { id: "04-08", label: "04:00 - 08:00", start: 4 },
  { id: "08-12", label: "08:00 - 12:00", start: 8 },
  { id: "12-16", label: "12:00 - 16:00", start: 12 },
  { id: "16-20", label: "16:00 - 20:00", start: 16 },
  { id: "20-24", label: "20:00 - 24:00", start: 20 },
];

type HistoryItem = {
  sh_id: number;
  played_at: number;
  duration: number;
  song: { id: string; art?: string; title?: string; artist?: string };
};

const currentIntervalId = () => timeIntervals[Math.floor(new Date().getHours() / 4)].id;

const TrackHistory = () => {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedInterval, setSelectedInterval] = useState<string | null>(currentIntervalId());

  const last7Days = Array.from({ length: 7 }, (_, i) => startOfDay(subDays(new Date(), i)));
  const interval = timeIntervals.find((i) => i.id === selectedInterval);
  const start = interval ? addHours(selectedDate, interval.start) : selectedDate;
  const end = interval ? addHours(start, 4) : addHours(selectedDate, 24);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["track_history", start.toISOString(), end.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("track-history", {
        body: { start: start.toISOString(), end: end.toISOString() },
      });
      if (error) throw error;
      return (data?.items ?? []) as HistoryItem[];
    },
    staleTime: 60_000,
  });

  const tracks = data ?? [];
  const isToday = selectedDate.getTime() === startOfDay(new Date()).getTime();
  const oldest = last7Days[last7Days.length - 1];

  const pillClass = (active: boolean) =>
    `rounded-full text-sm font-medium transition-all ${
      active
        ? "bg-primary text-primary-foreground glow-primary"
        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
    }`;

  return (
    <div className="container mx-auto px-4 py-20" id="history">
      <ScrollToTopButton />
      <div className="mb-12">
        <h2 className="font-display text-3xl md:text-4xl text-gradient">История треков</h2>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Выбрать дату</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSelectedDate((d) => subDays(d, 1))}
              disabled={selectedDate <= oldest}
              aria-label="Предыдущий день"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-display text-xl text-foreground min-w-[200px] text-center">
              {format(selectedDate, "EEEE, d MMM", { locale: ru })}
            </span>
            <button
              onClick={() => setSelectedDate((d) => subDays(d, -1))}
              disabled={isToday}
              aria-label="Следующий день"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {last7Days.map((date, index) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 ${pillClass(date.getTime() === selectedDate.getTime())}`}
              >
                {index === 0 ? "Сегодня" : index === 1 ? "Вчера" : format(date, "EEE, d MMM", { locale: ru })}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Временной интервал</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <button onClick={() => setSelectedInterval(null)} className={`px-4 py-3 !rounded-xl ${pillClass(selectedInterval === null)}`}>
              Весь день
            </button>
            {timeIntervals.map((i) => (
              <button
                key={i.id}
                onClick={() => setSelectedInterval(i.id)}
                className={`px-4 py-3 !rounded-xl ${pillClass(selectedInterval === i.id)}`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isLoading && !isError && (
        <p className="mb-6 text-muted-foreground">
          Показано <span className="text-primary font-semibold">{tracks.length}</span> треков
          {interval && <> за <span className="text-foreground">{interval.label}</span></>}
        </p>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground">Загрузка...</p>
        ) : isError ? (
          <p className="text-destructive">Не удалось загрузить историю. Попробуйте позже.</p>
        ) : tracks.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl text-foreground mb-2">Треки не найдены</h3>
            <p className="text-muted-foreground">Попробуй выбрать другую дату или временной интервал.</p>
          </div>
        ) : (
          tracks.map((track) => (
            <Link
              to={`/track/${track.song.id}`}
              key={track.sh_id}
              className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/50 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-lg bg-cover bg-center bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0"
                style={track.song.art ? { backgroundImage: `url(${track.song.art})` } : undefined}
              >
                {!track.song.art && <Music className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {track.song.title || "Без названия"}
                </h4>
                <p className="text-sm text-muted-foreground truncate">{track.song.artist}</p>
              </div>
              {track.duration > 0 && (
                <span className="text-sm text-muted-foreground flex-shrink-0 hidden sm:block">
                  {secondsToMMSS(Math.round(track.duration))}
                </span>
              )}
              <span className="text-sm text-primary font-medium flex-shrink-0 min-w-[70px] text-right">
                {format(new Date(track.played_at * 1000), "HH:mm")}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TrackHistory;

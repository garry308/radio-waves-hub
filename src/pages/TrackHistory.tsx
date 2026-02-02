import { useState } from "react";
import { format, subDays, startOfDay, addHours, isWithinInterval } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Music, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

// Time intervals (4 hours each)
const timeIntervals = [
  { id: "00-04", label: "00:00 - 04:00", start: 0, end: 4 },
  { id: "04-08", label: "04:00 - 08:00", start: 4, end: 8 },
  { id: "08-12", label: "08:00 - 12:00", start: 8, end: 12 },
  { id: "12-16", label: "12:00 - 16:00", start: 12, end: 16 },
  { id: "16-20", label: "16:00 - 20:00", start: 16, end: 20 },
  { id: "20-24", label: "20:00 - 24:00", start: 20, end: 24 },
];

// Generate mock track data
const generateMockTracks = () => {
  const tracks = [
    { title: "Midnight Dreams", artist: "Aurora Sky" },
    { title: "Electric Sunrise", artist: "Synthwave Collective" },
    { title: "Velvet Storm", artist: "The Night Riders" },
    { title: "Digital Hearts", artist: "Pulse Theory" },
    { title: "Ocean Drive", artist: "Coastal Dreams" },
    { title: "Neon Lights", artist: "City Runners" },
    { title: "Starfall", artist: "Galaxy Sound" },
    { title: "Rhythm of Night", artist: "Dance Floor Heroes" },
    { title: "Crystal Waters", artist: "Ambient Waves" },
    { title: "Thunder Road", artist: "Rock Revolution" },
    { title: "Sunset Boulevard", artist: "Jazz Fusion" },
    { title: "Morning Coffee", artist: "Chill Beats" },
    { title: "Urban Jungle", artist: "Hip Hop Kings" },
    { title: "Dreamscape", artist: "Electronic Dreams" },
    { title: "Firefly", artist: "Indie Vibes" },
  ];

  const result: Array<{
    id: number;
    title: string;
    artist: string;
    playedAt: Date;
    duration: string;
  }> = [];

  let id = 1;
  // Generate tracks for the past 7 days
  for (let day = 0; day < 7; day++) {
    const date = subDays(new Date(), day);
    // Generate 20-30 tracks per day
    const tracksPerDay = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < tracksPerDay; i++) {
      const track = tracks[Math.floor(Math.random() * tracks.length)];
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const playedAt = addHours(startOfDay(date), hour);
      playedAt.setMinutes(minute);
      
      result.push({
        id: id++,
        title: track.title,
        artist: track.artist,
        playedAt,
        duration: `${3 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      });
    }
  }

  return result.sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());
};

const allTracks = generateMockTracks();

const TrackHistory = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInterval, setSelectedInterval] = useState<string | null>(null);

  // Generate last 7 days for quick selection
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));

  // Filter tracks based on selected date and interval
  const filteredTracks = allTracks.filter((track) => {
    const trackDate = startOfDay(track.playedAt);
    const selectedDateStart = startOfDay(selectedDate);
    
    // Check if track is on selected date
    if (trackDate.getTime() !== selectedDateStart.getTime()) {
      return false;
    }

    // If no interval selected, show all tracks for that day
    if (!selectedInterval) {
      return true;
    }

    // Check if track is within selected interval
    const interval = timeIntervals.find((i) => i.id === selectedInterval);
    if (!interval) return true;

    const trackHour = track.playedAt.getHours();
    return trackHour >= interval.start && trackHour < interval.end;
  });

  const handlePrevDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const tomorrow = subDays(new Date(), -1);
    if (selectedDate < tomorrow) {
      setSelectedDate((prev) => subDays(prev, -1));
    }
  };

  const isToday = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-gradient mb-4">История треков</h1>
          <p className="text-muted-foreground text-lg">
            Исследуй наш архив плейлистов. Фильтруй по дню и времени, чтобы узнать что играло.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-8">
          {/* Date Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-foreground">Выбрать дату</h3>
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handlePrevDay}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-display text-xl text-foreground min-w-[200px] text-center">
                {format(selectedDate, "EEEE, d MMM", { locale: ru })}
              </span>
              <button
                onClick={handleNextDay}
                disabled={isToday}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Date Pills */}
            <div className="flex flex-wrap gap-2">
              {last7Days.map((date, index) => {
                const isSelected = startOfDay(date).getTime() === startOfDay(selectedDate).getTime();
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground glow-primary"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    {index === 0 ? "Сегодня" : index === 1 ? "Вчера" : format(date, "EEE, d MMM", { locale: ru })}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Interval Selector */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-foreground">Временной интервал</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <button
                onClick={() => setSelectedInterval(null)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedInterval === null
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
                >
                  Весь день
                </button>
              {timeIntervals.map((interval) => (
                <button
                  key={interval.id}
                  onClick={() => setSelectedInterval(interval.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedInterval === interval.id
                      ? "bg-primary text-primary-foreground glow-primary"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Показано <span className="text-primary font-semibold">{filteredTracks.length}</span> треков
            {selectedInterval && (
              <> за <span className="text-foreground">{timeIntervals.find(i => i.id === selectedInterval)?.label}</span></>
            )}
          </p>
        </div>

        {/* Track List */}
        <div className="space-y-3">
          {filteredTracks.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-xl text-foreground mb-2">Треки не найдены</h3>
              <p className="text-muted-foreground">
                Попробуй выбрать другую дату или временной интервал.
              </p>
            </div>
          ) : (
            filteredTracks.map((track, index) => (
              <div
                key={track.id}
                className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/50 transition-all animate-slide-up group"
                style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
              >
                {/* Track Number / Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <Music className="w-5 h-5 text-primary" />
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>

                {/* Duration */}
                <span className="text-sm text-muted-foreground flex-shrink-0 hidden sm:block">
                  {track.duration}
                </span>

                {/* Time Played */}
                <span className="text-sm text-primary font-medium flex-shrink-0 min-w-[70px] text-right">
                  {format(track.playedAt, "HH:mm")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackHistory;

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Radio, Home, History } from "lucide-react";
import { Layout } from "@/components/Layout";

const NotFound = () => (
  <Layout>
    <Helmet>
      <title>Страница не найдена — Твоя волна</title>
      <meta name="description" content="Такой страницы на «Твоей волне» нет. Вернитесь на главную или посмотрите историю треков." />
      <meta property="og:title" content="Страница не найдена — Твоя волна" />
      <meta property="og:description" content="Такой страницы на «Твоей волне» нет." />
      <meta name="robots" content="noindex" />
      <link rel="canonical" href="https://audio-atlas-site.lovable.app/404" />
    </Helmet>
    <section className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30 glow-primary">
        <Radio className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>
      <p className="mb-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">Ошибка 404</p>
      <h1 className="mb-4 text-6xl md:text-8xl font-bold text-foreground animate-fade">
        4<span className="text-primary">0</span>4
      </h1>
      <p className="mb-2 max-w-md text-lg text-foreground/90">
        Кажется, эта волна ушла в эфире
      </p>
      <p className="mb-8 max-w-md text-muted-foreground">
        Страница, которую вы ищете, не найдена — возможно, её адрес устарел или введён с опечаткой.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          На главную
        </Link>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          История треков
        </Link>
      </div>
    </section>
  </Layout>
);

export default NotFound;

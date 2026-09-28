import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const API = 'https://backend.your-wave.ru/api/station/your_wave/files'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const { id } = await req.json().catch(() => ({}))
    if (typeof id !== 'string' || !/^[a-f0-9]{16,64}$/i.test(id)) return json({ error: 'Invalid id' }, 400)
    const res = await fetch(API, { headers: { Authorization: `Bearer ${Deno.env.get('AZURACAST_API_KEY')}` } })
    if (!res.ok) return json({ error: `Upstream ${res.status}` }, 502)
    const files = await res.json()
    const f = (Array.isArray(files) ? files : []).find((x: any) => x?.song_id === id)
    if (!f) return json({ track: null })
    return json({
      track: {
        id: f.song_id,
        art: f.art,
        artist: f.artist,
        title: f.title,
        album: f.album,
        genre: f.genre,
        isrc: f.isrc,
        lyrics: f.lyrics,
        duration: f.length,
      },
    })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})

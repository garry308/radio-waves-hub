import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const API = 'https://backend.your-wave.ru/api/station/your_wave/history'
const MAX_RANGE = 24 * 3600 * 1000

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const { start, end } = await req.json().catch(() => ({}))
    const s = new Date(start), e = new Date(end)
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s || e.getTime() - s.getTime() > MAX_RANGE) {
      return json({ error: 'Invalid start/end' }, 400)
    }
    const url = `${API}?start=${encodeURIComponent(s.toISOString())}&end=${encodeURIComponent(e.toISOString())}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${Deno.env.get('AZURACAST_API_KEY')}` } })
    if (!res.ok) return json({ error: `Upstream ${res.status}` }, 502)
    const data = await res.json()
    const items = (Array.isArray(data) ? data : [])
      .filter((r: any) => r?.is_visible !== false)
      .map((r: any) => ({
        sh_id: r.sh_id,
        played_at: r.played_at,
        duration: r.duration,
        song: { id: r.song?.id, art: r.song?.art, title: r.song?.title, artist: r.song?.artist },
      }))
    return json({ items })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})

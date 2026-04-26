import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('AgentSplit event:', body)

    if (body.event === "task_completed") {
      await fetch("http://178.104.210.8:8000/api/user/completed_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: body.campaign_id || body.campaignId,
          user_id: "1",
          metrics: {
            clicks: body.metrics?.clicks ?? 0,
            completed: body.metrics?.completed ?? true,
            duration_ms: body.metrics?.duration_ms ?? 0,
            friction_score: body.metrics?.friction_score ?? 0,
          },
          success_event: body.success_event || body.payload?.success_event || "checkout_completed",
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid event payload' },
      { status: 400 }
    )
  }
}
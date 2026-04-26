import { NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

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
          variant_name: body.variant_name || body.payload?.variant_name,
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

    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid event payload' },
      { status: 400, headers: corsHeaders }
    )
  }
}

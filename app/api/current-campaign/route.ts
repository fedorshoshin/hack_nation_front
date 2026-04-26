import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("http://178.104.210.8:8000/api/user/current_variant")

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status },
        { status: res.statusText ? res.status : 502 }
      )
    }

    const data = await res.json()

    return NextResponse.json({
      campaign_id: data.campaign_id,
      variant: {
        link: data.variant?.link,
        name: data.variant?.name,
      },
      success_event: data.success_event,
      task: data.task,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch current campaign" },
      { status: 502 }
    )
  }
}

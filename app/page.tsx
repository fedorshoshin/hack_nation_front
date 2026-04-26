"use client"

import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [currentCampaign, setCurrentCampaign] = useState<any>(null)
  const [isError, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const loadCampaign = () => {
    setLoading(true)
    setError(false)
    fetch("/api/current-campaign")
      .then((res) => res.json())
      .then((data) => setCurrentCampaign(data))
      .catch((err) => console.error("current-campaign error:", err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCampaign()
  }, [])

  // Listen for postMessage from SDK inside iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.source !== "agentsplit") return
      if (event.data?.type !== "event") return

      const sdkEvent = event.data.data
      console.log("[Parent] SDK event received:", sdkEvent)

      if (sdkEvent.event === "task_completed") {
        console.log("[Parent] Task completed, loading next campaign...")
        loadCampaign()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (loading) return
    if (currentCampaign.status == 404) {
      setError(true)
      return
    }

    const sessionId = new URLSearchParams(window.location.search).get("sessionId")

    if (!sessionId) {
      console.error("sessionId is missing in parent URL")
      return
    }

    if (iframeRef.current) {
      iframeRef.current.src = currentCampaign?.variant.link + "?campaignId=" + currentCampaign?.campaign_id + "&apiUrl=http://178.104.210.8:8001/api"
    }
  }, [currentCampaign])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 48,
        minHeight: 48,
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 13,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#111", letterSpacing: "-0.02em" }}>tentiq</span>

          <span style={{
            background: "#fb923c",
            color: "#fff",
            padding: "2px 10px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
          }}>E-commerce</span>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "5px 14px",
            background: "#fff",
            fontSize: 12,
            color: "#888",
            cursor: "pointer",
          }}>AI watching...</button>

          <span style={{
            background: "#dcfce7",
            color: "#16a34a",
            padding: "4px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
          }}>$1.50 earned</span>

          <button style={{
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "5px 14px",
            background: "#fff",
            fontSize: 12,
            color: "#333",
            cursor: "pointer",
            fontWeight: 500,
          }}>End session</button>

          <span style={{ color: "#aaa", fontSize: 12 }}>— Home</span>
        </div>
      </header>

      {/* ─── Task instruction bar ─── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "#fafafa",
        borderBottom: "1px solid #e5e5e5",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          {/* checkbox icon */}
          <div style={{
            width: 20,
            height: 20,
            border: "2px solid #ccc",
            borderRadius: 4,
            marginTop: 2,
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
              {currentCampaign?.task}
            </div>
          </div>
        </div>
        <button style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "6px 18px",
          background: "#fff",
          fontSize: 13,
          color: "#555",
          cursor: "pointer",
          fontWeight: 500,
          flexShrink: 0,
        }}>Skip</button>
      </div>

      {!isError && !loading && (
        <iframe
          ref={iframeRef}
          style={{ flex: 1, width: "100%", border: "none" }}
        />
      )}
      {isError && (
        <div style={{ flex: 1, width: "100%", border: "none" }}>
          <h1>Error</h1>
        </div>
      )}
    </div>
  )
}
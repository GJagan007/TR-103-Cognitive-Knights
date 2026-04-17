"use client";

import React, { useState } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ScanEntry {
  id: string;
  file: File | null;
  lat: string;
  lon: string;
}

interface ZoneRanking {
  zone: string;
  grid: string;
  debris_count: number;
  density: number;
  avg_confidence: number;
  cleanup_priority: string;
}

interface ScanResult {
  scan_index: number;      // injected by backend
  priority: string;
  count: number;
  density: string;
  taxonomy: { type: string; confidence: string }[];
  zone_rankings: ZoneRanking[];
  image: string;
  heatmap: string;
  geojson: string;
  geojson_features: any[]; // injected by backend for batch download
  _entryId: string;       // injected client-side
  _fileName: string;      // injected client-side
  _error?: string;
}

// ─────────────────────────────────────────────
// Colours
// ─────────────────────────────────────────────
const priorityColor: Record<string, string> = {
  "🔴 CRITICAL": "bg-red-600/80 text-red-100 border border-red-500",
  "🟠 HIGH":     "bg-orange-600/80 text-orange-100 border border-orange-500",
  "🟡 MODERATE": "bg-yellow-600/80 text-yellow-100 border border-yellow-400",
  "🟢 LOW":      "bg-green-700/80 text-green-100 border border-green-500",
  "⚪ CLEAR":    "bg-slate-700/60 text-slate-300 border border-slate-600",
};
const densityBarColor: Record<string, string> = {
  "🔴 CRITICAL": "bg-red-500",
  "🟠 HIGH":     "bg-orange-500",
  "🟡 MODERATE": "bg-yellow-500",
  "🟢 LOW":      "bg-green-500",
  "⚪ CLEAR":    "bg-slate-600",
};

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─────────────────────────────────────────────
// Sub-component: single result card
// ─────────────────────────────────────────────
function ResultCard({ res, rootPath }: { res: ScanResult; rootPath: string }) {
  if (res._error) {
    return (
      <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-6 slide-up">
        <p className="text-red-400 font-bold text-lg">❌ Entry: {res._fileName}</p>
        <p className="text-slate-400 mt-1 text-sm">{res._error}</p>
      </div>
    );
  }

  const displayIndex = (res.scan_index ?? 0) + 1;

  return (
    <div className="bg-black/60 border border-cyan-900/50 rounded-2xl p-6 shadow-2xl slide-up flex flex-col gap-6" style={{ animationDelay: `${(res.scan_index ?? 0) * 0.08}s` }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-700/50 pb-4">
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Scan #{displayIndex}</span>
          <h3 className="text-xl font-bold text-cyan-400 font-mono mt-0.5 truncate max-w-xs">{res._fileName}</h3>
        </div>
        <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border ${
          res.priority.includes("CRITICAL") ? "bg-red-600/70 text-red-100 border-red-500" :
          res.priority.includes("MODERATE") ? "bg-yellow-600/70 text-yellow-100 border-yellow-400" :
          "bg-green-700/60 text-green-100 border-green-500"
        }`}>
          {res.priority}
        </span>
      </div>

      {/* Image + Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div className="md:col-span-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={res.image?.startsWith("http") ? res.image : rootPath + res.image}
            alt={`Detection – ${res._fileName}`}
            className="rounded-xl border-2 border-slate-800 w-full object-cover shadow-2xl"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-800/60">
            <p className="text-slate-300 text-sm mb-1">Debris Density: <span className="font-bold text-white">{res.density}</span></p>
            <p className="text-slate-300 text-sm">Debris Count: <span className="font-bold text-white">{res.count}</span></p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-slate-800 flex-1">
            <h4 className="text-cyan-500 text-xs uppercase font-bold mb-2 tracking-widest border-b border-slate-700/50 pb-1">Taxonomy</h4>
            <ul className="space-y-2 max-h-36 overflow-y-auto pr-1 text-sm text-slate-300">
              {res.taxonomy && res.taxonomy.length > 0 ? res.taxonomy.map((item, i) => (
                <li key={i}>• <span className="font-bold text-white">{item.type}</span>
                  <span className="text-slate-500 text-xs ml-2">({item.confidence})</span>
                </li>
              )) : <li className="text-slate-500">No objects detected.</li>}
            </ul>
          </div>

          <div className="flex gap-2">
            <a href={rootPath + res.heatmap} target="_blank" rel="noreferrer"
              className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 font-bold transition">
              🗺️ Heatmap
            </a>
            <a href={rootPath + res.geojson} download target="_blank" rel="noreferrer"
              className="flex-1 text-center py-2 bg-blue-900/80 hover:bg-blue-800 border border-blue-600/80 rounded-lg text-xs text-blue-100 font-bold transition">
              📡 GeoJSON
            </a>
          </div>
        </div>
      </div>

      {/* Zone Rankings */}
      {res.zone_rankings && res.zone_rankings.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-cyan-400 font-mono mb-1 flex items-center gap-2">
            🛰️ Cleanup Priority Zone Rankings
          </h4>
          <p className="text-slate-500 text-xs mb-4">9-sector grid ranked by estimated debris density.</p>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-widest">
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Sector</th>
                  <th className="px-3 py-2">Grid</th>
                  <th className="px-3 py-2">Items</th>
                  <th className="px-3 py-2 min-w-[140px]">Est. Density</th>
                  <th className="px-3 py-2">Confidence</th>
                  <th className="px-3 py-2">Priority</th>
                </tr>
              </thead>
              <tbody>
                {res.zone_rankings.map((zone, i) => {
                  const pLabel = zone.cleanup_priority ?? "⚪ CLEAR";
                  const badgeCls = priorityColor[pLabel] ?? "bg-slate-700/60 text-slate-300 border border-slate-600";
                  const barCls   = densityBarColor[pLabel] ?? "bg-slate-600";
                  return (
                    <tr key={i} className={`border-t border-slate-800/60 transition-colors ${
                      i === 0 ? "bg-red-950/20 hover:bg-red-950/30" :
                      i === 1 ? "bg-orange-950/15 hover:bg-orange-950/25" :
                      "bg-slate-900/30 hover:bg-slate-800/40"
                    }`}>
                      <td className="px-3 py-2 font-mono font-bold text-slate-300">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </td>
                      <td className="px-3 py-2 font-semibold text-white">{zone.zone}</td>
                      <td className="px-3 py-2 font-mono text-slate-500 text-[10px]">{zone.grid}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="bg-slate-700/60 px-2 py-0.5 rounded-full text-white font-bold">{zone.debris_count}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full density-bar-fill ${barCls}`} style={{ width: `${Math.min(zone.density, 100)}%` }} />
                          </div>
                          <span className="text-slate-300 font-mono w-12 text-right shrink-0">{zone.density}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-300 font-mono">{zone.avg_confidence > 0 ? `${zone.avg_confidence}%` : "—"}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${badgeCls}`}>{pLabel}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Hero
// ─────────────────────────────────────────────
export function Hero() {
  const [entries, setEntries] = useState<ScanEntry[]>([
    { id: uid(), file: null, lat: "13.0450", lon: "80.2900" },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [globalError, setGlobalError] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const rootPath = "http://127.0.0.1:8008";

  // ── Entry mutations ──────────────────────────
  const addEntry = () =>
    setEntries((prev) => [...prev, { id: uid(), file: null, lat: "13.0450", lon: "80.2900" }]);

  const removeEntry = (id: string) =>
    setEntries((prev) => (prev.length > 1 ? prev.filter((e) => e.id !== id) : prev));

  const patchEntry = (id: string, patch: Partial<ScanEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  // ── Scan all images ──────────────────────────
  const handleExecute = async () => {
    if (entries.every((e) => !e.file)) {
      alert("Please attach at least one image before scanning.");
      return;
    }
    setLoading(true);
    setGlobalError("");
    setResults([]);

    // Single batch_id shared across all images in this Execute click
    const batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const scanEntry = async (entry: ScanEntry, index: number): Promise<ScanResult> => {
      if (!entry.file) {
        return {
          _entryId: entry.id,
          _fileName: "(no file)",
          _error: "No file selected for this slot.",
        } as unknown as ScanResult;
      }
      const fd = new FormData();
      fd.append("file", entry.file);
      fd.append("lat", entry.lat || "13.0450");
      fd.append("lon", entry.lon || "80.2900");
      fd.append("batch_id",   batchId);          // ← links images in Cloudinary & MongoDB
      fd.append("scan_index", String(index));     // ← position within the batch
      try {
        const res = await fetch(`${rootPath}/analyze`, { method: "POST", body: fd });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { ...data, _entryId: entry.id, _fileName: entry.file.name };
      } catch (err: any) {
        return {
          _entryId: entry.id,
          _fileName: entry.file.name,
          _error: err.message ?? "Unknown error",
        } as unknown as ScanResult;
      }
    };

    const allResults = await Promise.all(entries.map((e, i) => scanEntry(e, i)));
    setResults(allResults);
    if (allResults.length > 0) setActiveTab(allResults[0]._entryId);
    setLoading(false);
  };

  const activeResult = results.find((r) => r._entryId === activeTab) ?? null;

  return (
    <div
      className="flex flex-col items-center py-12 px-4 w-full text-white min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(-45deg, #020617, #082f49, #0b4e54, #0f172a)",
        backgroundSize: "400% 400%",
        animation: "oceanFlow 15s ease infinite",
      }}
    >
      <style>{`
        @keyframes oceanFlow {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .slide-up         { animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .density-bar-fill { transition: width 1s cubic-bezier(.22,1,.36,1); }
      `}</style>

      {/* ── Header ── */}
      <h1 className="text-5xl font-extrabold mb-2 text-cyan-400 tracking-wide text-center drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
        Oceanic Fleet Dispatch API
      </h1>
      <p className="mb-10 text-slate-300 text-center">
        Satellite Aerial Debris Classification &amp; Heatmap Tool
      </p>

      {/* ── Upload Panel ── */}
      <div className="w-full max-w-2xl flex flex-col gap-4">

        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-2xl p-5 shadow-xl relative slide-up"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            {/* Entry header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">
                📡 Image Slot #{idx + 1}
              </span>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  title="Remove slot"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-red-900/50 hover:bg-red-700/70 border border-red-700/50 text-red-300 hover:text-white transition text-sm font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* File picker */}
            <label className="block mb-1 text-xs text-slate-400 font-medium">Satellite Feed:</label>
            <div className="flex items-center gap-3 mb-4">
              <label className="flex-1 cursor-pointer">
                <div className={`rounded-lg border px-4 py-2.5 text-sm transition flex items-center gap-2 ${
                  entry.file
                    ? "bg-cyan-950/40 border-cyan-700/60 text-cyan-300"
                    : "bg-black/30 border-slate-700 text-slate-500 hover:border-slate-500"
                }`}>
                  <span className="text-base">{entry.file ? "🖼️" : "📂"}</span>
                  <span className="truncate max-w-[260px]">
                    {entry.file ? entry.file.name : "Click to choose image…"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => patchEntry(entry.id, { file: e.target.files?.[0] ?? null })}
                />
              </label>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-xs text-slate-400">Latitude:</label>
                <input
                  type="text"
                  value={entry.lat}
                  onChange={(e) => patchEntry(entry.id, { lat: e.target.value })}
                  placeholder="13.0450"
                  className="w-full p-2 rounded-lg bg-white/5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs text-slate-400">Longitude:</label>
                <input
                  type="text"
                  value={entry.lon}
                  onChange={(e) => patchEntry(entry.id, { lon: e.target.value })}
                  placeholder="80.2900"
                  className="w-full p-2 rounded-lg bg-white/5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add slot button */}
        <button
          onClick={addEntry}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-cyan-800/60 hover:border-cyan-500/80 bg-cyan-950/10 hover:bg-cyan-950/25 text-cyan-500 hover:text-cyan-300 font-bold text-sm transition-all duration-200"
        >
          <span className="text-xl leading-none">＋</span> Add Another Image Slot
        </button>

        {/* Execute button */}
        <button
          onClick={handleExecute}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-base bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02] active:scale-100 transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] disabled:opacity-50 disabled:hover:scale-100 mt-1"
        >
          {loading
            ? `⏳ Scanning ${entries.filter((e) => e.file).length} image(s)…`
            : `🛰️ Execute Aerial Scan (${entries.filter((e) => e.file).length} image${entries.filter((e) => e.file).length !== 1 ? "s" : ""})`}
        </button>
      </div>

      {/* ── Global error ── */}
      {globalError && (
        <div className="mt-6 w-full max-w-2xl text-center text-red-400 bg-red-900/30 border border-red-800/50 p-4 rounded-xl animate-pulse font-bold">
          {globalError}
        </div>
      )}

      {/* ── Results ── */}
      {results.length > 0 && !loading && (
        <div className="mt-10 w-full max-w-5xl flex flex-col gap-4">

          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3 bg-black/60 border border-slate-700/50 rounded-2xl px-5 py-4 slide-up">
            <div className="flex-1 flex flex-wrap items-center gap-3 min-w-[300px]">
                <span className="text-slate-400 text-sm font-semibold mr-2">
                {results.length} Scan{results.length !== 1 ? "s" : ""} Complete
                </span>
                {results.map((r) => (
                <span
                    key={r._entryId}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                    r._error ? "bg-red-900/50 text-red-300 border-red-700" :
                    r.priority?.includes("CRITICAL") ? "bg-red-600/60 text-red-100 border-red-500" :
                    r.priority?.includes("MODERATE") ? "bg-yellow-600/60 text-yellow-100 border-yellow-400" :
                    "bg-green-700/50 text-green-100 border-green-600"
                    }`}
                >
                    {r._error ? "❌" : r.priority?.includes("CRITICAL") ? "🔴" : r.priority?.includes("MODERATE") ? "🟡" : "🟢"} {r._fileName}
                </span>
                ))}
            </div>

            {/* Batch Export Aggregator */}
            {results.length > 1 && !results.some(r => r._error) && (
                <button
                    onClick={() => {
                        const allFeatures = results.flatMap(r => r.geojson_features || []);
                        const batchGeoJSON = {
                            type: "FeatureCollection",
                            features: allFeatures
                        };
                        const blob = new Blob([JSON.stringify(batchGeoJSON, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `fleet_batch_${Date.now().toString(36)}.geojson`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-900/60 hover:bg-blue-800 border border-blue-500/50 rounded-xl text-xs font-bold text-blue-100 transition shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                    📋 Download Integrated Batch GeoJSON
                </button>
            )}
          </div>

          {/* Tab strip */}
          {results.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 slide-up">
              {results.map((r, i) => (
                <button
                  key={r._entryId}
                  onClick={() => setActiveTab(r._entryId)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                    activeTab === r._entryId
                      ? "bg-cyan-600/80 border-cyan-500 text-white shadow-[0_0_12px_rgba(8,145,178,0.4)]"
                      : "bg-black/30 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  #{i + 1} {r._fileName.length > 18 ? r._fileName.slice(0, 16) + "…" : r._fileName}
                </button>
              ))}
              <button
                onClick={() => setActiveTab("all")}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                  activeTab === "all"
                    ? "bg-slate-600/80 border-slate-400 text-white"
                    : "bg-black/30 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                📋 All
              </button>
            </div>
          )}

          {/* Result cards */}
          {(activeTab === "all" || results.length === 1
            ? results
            : results.filter((r) => r._entryId === activeTab)
          ).map((res) => (
            <ResultCard key={res._entryId} res={res} rootPath={rootPath} />
          ))}
        </div>
      )}
    </div>
  );
}

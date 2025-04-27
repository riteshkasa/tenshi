// src/app/page.tsx
'use client';

import React from "react";
import { Space_Grotesk } from "next/font/google";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DynamicMap = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p>Loading map...</p>
    </div>
  )
});

const hospitals = [
  {
    id: 1,
    name: "Ronald Reagan UCLA Medical Center",
    lat: 34.066242,
    lng: -118.445328,
  },
  {
    id: 2,
    name: "UCLA Santa Monica Medical Center",
    lat: 34.02754,
    lng: -118.48659,
  },
  {
    id: 3,
    name: "West Los Angeles VA Medical Center",
    lat: 34.05000,
    lng: -118.45250,
  },
  {
    id: 4,
    name: "Cedars-Sinai Medical Center",
    lat: 34.075198,
    lng: -118.380676,
  },
  {
    id: 5,
    name: "Kaiser Permanente West Los Angeles Medical Center",
    lat: 34.038611,
    lng: -118.375278,
  },
  {
    id: 6,
    name: "Providence Saint John’s Health Center",
    lat: 34.0307,
    lng: -118.4791,
  },
];

export default function HomePage() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className={`${space.className} h-screen bg-canvas p-8 flex flex-col`}>
      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-3xl font-medium text-gray-900">Map Application</h1>
      </header>

      {/* 3) Main area fills remaining space */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* LEFT column: 2 boxes in 6:4 ratio */}
        <div className="flex flex-col gap-6 h-full">
          <div className="basis-0 grow-[6] border border-stroke rounded-lg flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">
              Live Video / Replay
            </span>
          </div>
          <div className="basis-0 grow-[4] border border-stroke rounded-lg relative overflow-hidden">
            {/* Map container - using the dynamic import component */}
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
              <DynamicMap center={[34.05, -118.43]} zoom={12} markers={hospitals} />
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-6 h-full">
          {/* fixed-height cards */}
          <div className="h-40 border border-stroke rounded-lg flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-800">
              Patient Snapshot Card
            </span>
          </div>
          <div className="h-20 border border-stroke rounded-lg flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-800">
              Coordinates
            </span>
          </div>

          {/* chat window flex-grows */}
          <div className="flex-1 border border-stroke rounded-lg flex flex-col p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              AI First Response Assistant Chat Window
            </h2>
            <div className="flex-1 border border-stroke rounded-md p-4 overflow-y-auto mb-4">
              {/* …chat messages… */}
            </div>
            <input
              type="text"
              placeholder="Type a message…"
              className="w-full rounded-full border border-stroke px-4 py-2 focus:outline-none focus:ring-2 focus:ring-olive"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

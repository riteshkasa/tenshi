// src/app/page.tsx
'use client';

import React, { useEffect } from "react";
import { Space_Grotesk } from "next/font/google";
import dynamic from 'next/dynamic';
import Link from "next/link";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DynamicMap = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-800 rounded-lg">
      <p className="text-slate-400">Loading map...</p>
    </div>
  )
});

const hospitals = [
  { id: 1, name: "Ronald Reagan UCLA Medical Center",             lat: 34.066242, lng: -118.445328 },
  { id: 2, name: "UCLA Santa Monica Medical Center",              lat: 34.02754,  lng: -118.48659  },
  { id: 3, name: "West Los Angeles VA Medical Center",            lat: 34.05,     lng: -118.4525   },
  { id: 4, name: "Cedars-Sinai Medical Center",                   lat: 34.075198, lng: -118.380676 },
  { id: 5, name: "Kaiser Permanente West Los Angeles Medical Center", lat: 34.038611, lng: -118.375278 },
  { id: 6, name: "Providence Saint John’s Health Center",         lat: 34.0307,   lng: -118.4791   },
];

const Page = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-…';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className={`${space.className} min-h-screen bg-slate-900 text-slate-200 p-8 flex flex-col`}>
      {/* HEADER */}
      <header className="mb-6 flex items-center">
        <img
          src="/assets/tenshi.png"
          alt="Tenshi Logo"
          className="h-8 w-auto mr-3"
        />
        <h1 className="text-3xl font-bold text-red-400">Tenshi</h1>
      </header>

      {/* MAIN */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 h-full">
          {/* Live Video */}
          <div className="basis-0 grow-[6] border border-slate-700 rounded-lg overflow-hidden relative bg-slate-800">
            <video
              src="/assets/sample_vid.mp4"
              controls
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {/* Map */}
          <div className="basis-0 grow-[4] border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
              <DynamicMap center={[34.05, -118.43]} zoom={13} markers={hospitals} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 h-full">
          {/* Patient & Incident Card */}
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-800 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-red-300">Patient Information</h2>

            {/* Photo + Info */}
            <div className="flex items-start gap-6">
              <div className="w-36 h-36 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="/assets/IMG_2931.png"
                  alt="Patient snapshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-300">
                <p>Name: Johnny Zheng</p>
                <p>Blood Type: O+</p>
                <p>Age: 18</p>
                <p>Weight: 183 lbs</p>
                <p>Allergies: Soy, Shellfish</p>
                <p>Height: 5’11.5″</p>
                <p>Conditions: Hypertension</p>
                <p>Insurance: Bruin Health</p>
              </div>
            </div>

            {/* Incident Info */}
            <div className="border-t border-slate-700 pt-4 text-sm text-slate-300">
              <h3 className="font-semibold mb-2 text-red-300">Incident Information</h3>
              <p>Coordinates: 34.070211°N 118.446775°W</p>
              <p>Approximate Location: UCLA Pauley Pavilion</p>
            </div>
          </div>

          {/* Medical History Card */}
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-800">
            <h3 className="text-lg font-semibold mb-2 text-red-300">Medical History</h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Johnny Zheng has a history of stage 1 hypertension, managed on a low-sodium diet and daily ACE inhibitors.  
              He has no known drug allergies but does report occasional seasonal allergies.  
              Last blood pressure reading (one week ago) was 138/88 mmHg.
            </p>
          </div>

          {/* Chat Window */}
          <div className="flex-1 border border-slate-700 rounded-lg flex flex-col p-6 bg-slate-800">
            <h2 className="text-lg font-semibold mb-2 text-red-300">
              Gemini First Response Assistant Chat
            </h2>
            <div className="flex-1 border border-slate-700 rounded-md p-4 overflow-y-auto mb-4 bg-slate-900">
              {/* …chat messages… */}
            </div>
            <input
              type="text"
              placeholder="Type a message…"
              className="w-full rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
'use client';

import React from 'react';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-3 text-emerald-400">Something went wrong</h2>
          <p className="text-slate-300 mb-6 text-sm">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

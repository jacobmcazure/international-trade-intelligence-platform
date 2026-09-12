"use client";

import Link from "next/link";

export default function DetailsDrawer({ isOpen, country, onClose, children }) {
  return (
    <div className={`fixed inset-0 z-40 transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <button
        type="button"
        aria-label="Close details drawer"
        className={`absolute inset-0 bg-black/20 transition ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-12 flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">{country?.name}</h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 mt-2 text-sm text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-8">
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-600">
          {children}
        </div>

          <Link
            href={`/sanctions/${country.iso_code}`}
            className="self-start rounded-full border border-gray-200 bg-gray-50 p-4 py-3 text-sm text-gray-600 hover:border-gray-500 hover:bg-sky-100"
          >
            View Full Sanctions List
          </Link>
        </div>
      </aside>
    </div>
  );
}

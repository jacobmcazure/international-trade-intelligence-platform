"use client"

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button className="w-fit self-start rounded-full border border-gray-500 bg-slate-500 px-4 py-2 text-sm hover:bg-sky-300 hover:cursor-pointer" 
        type="button" 
        onClick={() => router.back()}>
            Go Back
        </button>
    );
}

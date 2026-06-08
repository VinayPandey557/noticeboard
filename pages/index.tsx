import { useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import NoticeCard from "@/components/NoticeCard";
import { Notice } from "@/lib/types";
import { prisma } from "@/lib/prisma";

interface Props {
  initialNotices: Notice[];
}

const FILTERS = ["All", "Exam", "Event", "General"] as const;

export default function Home({ initialNotices }: Props) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const handleDeleted = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notices.filter((n) => {
    const matchCat = filter === "All" || n.category === filter;
    const matchSearch =
      search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const urgentCount = notices.filter((n) => n.priority === "Urgent").length;

  return (
    <Layout title="NoticeBoard — All Notices">
      {/* Hero / header section */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Notice Board
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {notices.length} notice{notices.length !== 1 ? "s" : ""} posted
              {urgentCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-red-600 font-semibold">
                  · {urgentCount} urgent
                </span>
              )}
            </p>
          </div>
          <Link
            href="/notices/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Notice
          </Link>
        </div>

        {/* Search & filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search notices…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-slate-700 font-semibold text-lg mb-1">
            {search || filter !== "All" ? "No results found" : "No notices yet"}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {search || filter !== "All"
              ? "Try adjusting your search or filter."
              : "Create your first notice to get started."}
          </p>
          {!search && filter === "All" && (
            <Link
              href="/notices/new"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Create First Notice
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notices = await prisma.$queryRaw<Notice[]>`
    SELECT * FROM "Notice"
    ORDER BY
     CASE priority WHEN 'Urgent' THEN 0 ELSE 1 END ASC,
     "createdAt" DESC
  `;

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
};

import { useState } from "react";
import { Notice } from "@/lib/types";
import { useRouter } from "next/router";

const CATEGORY_COLORS: Record<string, string> = {
  Exam: "bg-violet-100 text-violet-700 border border-violet-200",
  Event: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  General: "bg-sky-100 text-sky-700 border border-sky-200",
};

const CATEGORY_DOT: Record<string, string> = {
  Exam: "bg-violet-500",
  Event: "bg-emerald-500",
  General: "bg-sky-500",
};

interface Props {
  notice: Notice;
  onDeleted: (id: number) => void;
}

export default function NoticeCard({ notice, onDeleted }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isUrgent = notice.priority === "Urgent";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted(notice.id);
      } else {
        alert("Failed to delete notice. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isUrgent
            ? "shadow-md ring-2 ring-red-400 ring-offset-2"
            : "shadow-sm border border-slate-100"
        }`}
      >
        {/* Urgent accent stripe */}
        {isUrgent && (
          <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-400" />
        )}

        {/* Image */}
        {notice.imageUrl && (
          <div className="relative h-44 w-full overflow-hidden bg-slate-100">
            <img
              src={notice.imageUrl}
              alt={notice.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-5">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {isUrgent && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                URGENT
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                CATEGORY_COLORS[notice.category]
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${CATEGORY_DOT[notice.category]}`}
              />
              {notice.category}
            </span>
            <span className="ml-auto text-xs text-slate-400 font-medium tabular-nums">
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-slate-900 font-bold text-lg leading-snug mb-2 line-clamp-2">
            {notice.title}
          </h2>

          {/* Body */}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-5">
            {notice.body}
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => router.push(`/notices/${notice.id}/edit`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-modal">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-bold text-lg text-center mb-1">
              Delete Notice?
            </h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              &ldquo;{notice.title}&rdquo; will be permanently removed and cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

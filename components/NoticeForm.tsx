import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { Notice } from "@/lib/types";

interface Props {
  initialData?: Partial<Notice>;
  noticeId?: number;
}

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

export default function NoticeForm({ initialData, noticeId }: Props) {
  const router = useRouter();
  const isEditing = !!noticeId;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    body: initialData?.body || "",
    category: initialData?.category || "General",
    priority: initialData?.priority || "Normal",
    publishDate: initialData?.publishDate
      ? new Date(initialData.publishDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    imageUrl: initialData?.imageUrl || "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const url = isEditing ? `/api/notices/${noticeId}` : "/api/notices";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.message || "Something went wrong"]);
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch {
      setErrors(["Network error. Please check your connection."]);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-red-700">
              Please fix the following:
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-sm text-red-600">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Mid-Semester Examination Schedule"
          className={INPUT_CLASS}
          maxLength={200}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Body <span className="text-red-500">*</span>
        </label>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Describe the notice in detail…"
          rows={5}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {/* Category & Priority (side by side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={INPUT_CLASS}
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Priority
          </label>
          <div className="flex gap-3">
            {(["Normal", "Urgent"] as const).map((p) => (
              <label
                key={p}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                  form.priority === p
                    ? p === "Urgent"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={form.priority === p}
                  onChange={handleChange}
                  className="sr-only"
                />
                {p === "Urgent" && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Publish Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Publish Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </div>

      {/* Image URL (bonus) */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Image URL{" "}
          <span className="text-xs font-normal text-slate-400 ml-1">optional</span>
        </label>
        <input
          type="url"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={INPUT_CLASS}
        />
        {form.imageUrl && (
          <div className="mt-2 rounded-xl overflow-hidden h-32 bg-slate-100">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isEditing ? "Saving…" : "Creating…"}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Notice"
          )}
        </button>
      </div>
    </form>
  );
}

import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import Link from "next/link";

export default function NewNoticePage() {
  return (
    <Layout title="NoticeBoard — New Notice">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-700 transition-colors">
            Notice Board
          </Link>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-700 font-medium">New Notice</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Notice</h1>
            <p className="text-slate-500 text-sm">
              Fill in the details to post a new notice on the board.
            </p>
          </div>
          <NoticeForm />
        </div>
      </div>
    </Layout>
  );
}

import type { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import Link from "next/link";
import { Notice } from "@/lib/types";
import { prisma } from "@/lib/prisma";

interface Props {
  notice: Notice;
}

export default function EditNoticePage({ notice }: Props) {
  return (
    <Layout title={`NoticeBoard — Edit: ${notice.title}`}>
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-slate-700 transition-colors">
            Notice Board
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-700 font-medium truncate max-w-[200px]">
            {notice.title}
          </span>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-700 font-medium">Edit</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Notice</h1>
            <p className="text-slate-500 text-sm">
              Update the details below and save your changes.
            </p>
          </div>
          <NoticeForm initialData={notice} noticeId={notice.id} />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id as string, 10);

  if (isNaN(id)) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
};

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Category, Priority } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const noticeId = parseInt(id as string, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ message: "Invalid notice ID" });
  }

  // GET single notice
  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!notice) return res.status(404).json({ message: "Notice not found" });
      return res.status(200).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch notice" });
    }
  }

  // PUT (update)
  if (req.method === "PUT") {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    const errors: string[] = [];

    if (!title || typeof title !== "string" || title.trim() === "") {
      errors.push("Title is required");
    }
    if (!body || typeof body !== "string" || body.trim() === "") {
      errors.push("Body is required");
    }
    if (!publishDate) {
      errors.push("Publish date is required");
    } else {
      const d = new Date(publishDate);
      if (isNaN(d.getTime())) {
        errors.push("Publish date must be a valid date");
      }
    }
    if (category && !Object.values(Category).includes(category)) {
      errors.push("Category must be one of: Exam, Event, General");
    }
    if (priority && !Object.values(Priority).includes(priority)) {
      errors.push("Priority must be Normal or Urgent");
    }

    if (errors.length > 0) {
      return res.status(422).json({ message: "Validation failed", errors });
    }

    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ message: "Notice not found" });

      const updated = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category || Category.General,
          priority: priority || Priority.Normal,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl?.trim() || null,
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update notice" });
    }
  }

  // DELETE
  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ message: "Notice not found" });

      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete notice" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Category, Priority } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          // Urgent notices always on top — done in DB, not browser
          { priority: "asc" }, // Urgent < Normal alphabetically (U < N is false), need raw sort trick
          { createdAt: "desc" },
        ],
      });

      // Prisma orderBy on enum: "Urgent" sorts after "Normal" alphabetically.
      // We'll use a raw query approach via a workaround — sort by FIELD in MySQL.
      // Actually re-fetch using raw for correct ordering:
      const orderedNotices = await prisma.$queryRaw`
       SELECT * FROM "Notice"
       ORDER BY
        CASE priority WHEN 'Urgent' THEN 0 ELSE 1 END ASC,
        "createdAt" DESC
      `;

      return res.status(200).json(orderedNotices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // Server-side validation
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
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category || Category.General,
          priority: priority || Priority.Normal,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl?.trim() || null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}

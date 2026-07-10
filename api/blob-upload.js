// Authorises a direct browser-to-Blob upload (Vercel "client upload" pattern),
// so PDFs never pass through the function body-size limit. Only signed-in
// admins can obtain an upload token, and only PDFs up to 10 MB are allowed.
import { handleUpload } from "@vercel/blob/client";
import { isAuthed } from "../server/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!isAuthed(req)) {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Metadata is recorded by the admin client via POST /api/notices.
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error?.message || "Upload failed" });
  }
}

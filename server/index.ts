import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@notionhq/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notion = new Client({ 
  auth: "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" 
});
const DATABASE_ID = "31ff0a7df0a580c089ccdf8089721d15";



async function startServer() {
  const app = express();
  
  app.use(express.json());

  const server = createServer(app);
app.post("/api/notion-save", async (req, res) => {
   console.log("Data received on server:", req.body);
  const { firstName, email } = req.body;

  try {
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        "Name": {
          title: [{ text: { content: firstName || "N/A" } }]
        },
        "Email": {
          email: email
        }
      },
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Notion API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = 5000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
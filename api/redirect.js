export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Extract JSON body
  let data;
  try {
    data = req.body;
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Confirm receipt for debugging
  return res.status(200).json({
    ok: true,
    message: "Data received",
    received: data
  });
}

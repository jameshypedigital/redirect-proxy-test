export default async function handler(req, res) {
  try {
    // --- 1. Extract Query Parameters ---
    const { offer, club, ...rest } = req.query;

    if (!offer || !club) {
      return res.status(400).json({
        ok: false,
        error: "Missing required params: offer or club"
      });
    }

    // --- 2. Build Payload for n8n ---
    const payload = {
      offer,
      club,
      timestamp: Date.now(),
      utm: rest
    };

    // --- 3. SEND DATA TO n8n ---
    const webhookUrl = "https://your-n8n-url.com/webhook/xxxxx"; // <-- YOUR REAL WEBHOOK
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // --- 4. Offer → Destination Mapping ---
    const redirectMap = {
      "join-for-1-dollar": "https://af-promo.com/commerce-joinfor1-page-3639",
      "free-7-day-pass": "https://af-promo.com/commerce-7dayfree-page-1111",
      "training-session": "https://af-promo.com/training-offer",
      // add any others here
    };

    const finalUrl = redirectMap[offer] || "https://default-url.com";

    // --- 5. Redirect User ---
    return res.redirect(302, finalUrl);

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}

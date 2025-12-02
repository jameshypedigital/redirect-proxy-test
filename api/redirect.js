export default async function handler(req, res) {
  try {
    const { offer, club, ...rest } = req.query;

    if (!offer || !club) {
      return res.status(400).json({
        ok: false,
        error: "Missing required params: offer or club"
      });
    }

    // Build payload for n8n
    const payload = {
      offer,
      club,
      utm: rest,
      timestamp: Date.now()
    };

    // Send to n8n webhook
    await fetch("YOUR_N8N_WEBHOOK_URL_HERE", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Redirect user to your universal redirect page
    const redirectUrl = `https://af-promo.com/redirect?offer=${encodeURIComponent(
      offer
    )}&club=${encodeURIComponent(club)}`;

    return res.redirect(302, redirectUrl);

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}


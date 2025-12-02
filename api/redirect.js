export default async function handler(req, res) {
  try {
    const { offer, club, ...utm } = req.query;

    if (!offer || !club) {
      return res.status(400).json({
        ok: false,
        error: "Missing required params: offer or club"
      });
    }

    // Send to n8n webhook
    await fetch("https://dashtraq.app.n8n.cloud/webhook/redirect-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offer,
        club,
        utm,
        timestamp: Date.now()
      })
    });

    // 🎯 DIRECT OFFER REDIRECT
    // Customize your offer URLs below
    const offerMap = {
      "join-for-1-dollar": "https://anytimefitness.com/join/?offer=1-dollar",
      "7-day-pass": "https://anytimefitness.com/pass/7-day",
      "paid-trial": "https://anytimefitness.com/trial"
    };

    const finalUrl = offerMap[offer];

    if (!finalUrl) {
      return res.status(400).json({
        ok: false,
        error: `Unknown offer: ${offer}`
      });
    }

    return res.redirect(302, finalUrl);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

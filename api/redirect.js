export default async function handler(req, res) {
  try {
    const { offer, club, landing_page, location_id, ...utm } = req.query;

    // Determine club ID — prefer explicit club param, fallback to location_id
    const clubId = club || location_id;

    if (!landing_page || !clubId) {
      return res.status(400).json({
        ok: false,
        error: "Missing required params: landing_page or club"
      });
    }

    const slug = landing_page.trim().toLowerCase();

    // Send data to n8n
    await fetch("https://dashtraq.app.n8n.cloud/webhook/redirect-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offer,
        club: clubId,
        slug,
        utm,
        timestamp: Date.now()
      })
    });

    // Build final URL dynamically
    let finalUrl = null;

    if (slug === "online-signup") {
      // Online Signup format
      finalUrl = `https://join.anytimefitness.com/${clubId}/plans`;
    }
    else if (slug === "no-offer") {
      // No Offer format
      finalUrl = `https://www.anytimefitness.com/membership-inquiry?location_id=${clubId}`;
    }
    else {
      // Standard offer format
      finalUrl = `https://www.anytimefitness.com/offer/local/${slug}?club=${clubId}`;
    }

    return res.redirect(302, finalUrl);

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

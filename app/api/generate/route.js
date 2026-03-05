import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { address, price, beds, baths, sqft, propertyType, tone, neighborhood, extras, features } = await req.json();

    const prompt =
      "You are an expert real estate copywriter. Write marketing content for this property.\n\n" +
      "Property details:\n" +
      "Address: " + (address || "Beautiful Home") + "\n" +
      "Price: " + (price ? "$" + price : "Call for price") + "\n" +
      "Type: " + propertyType + "\n" +
      "Beds: " + (beds || "?") + " | Baths: " + (baths || "?") + " | Sqft: " + (sqft || "?") + "\n" +
      "Neighborhood: " + (neighborhood || "Prime location") + "\n" +
      "Features: " + (features && features.length ? features.join(", ") : "Great features throughout") + "\n" +
      "Notes: " + (extras || "None") + "\n" +
      "Tone: " + tone + "\n\n" +
      "Reply using ONLY this exact structure:\n" +
      "---MLS---\n" +
      "Write a compelling 150-200 word MLS listing description here.\n" +
      "---IG---\n" +
      "Write an Instagram caption with 2-3 emojis and 8 hashtags here.\n" +
      "---FB---\n" +
      "Write a Facebook post ending with an engaging question and 4 hashtags here.\n" +
      "---END---";

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content.map((b) => b.text || "").join("");

    const between = (a, b) => {
      const i = raw.indexOf(a);
      if (i === -1) return "";
      const j = raw.indexOf(b, i + a.length);
      if (j === -1) return raw.slice(i + a.length).trim();
      return raw.slice(i + a.length, j).trim();
    };

    return Response.json({
      listing: between("---MLS---", "---IG---") || raw,
      instagram: between("---IG---", "---FB---"),
      facebook: between("---FB---", "---END---"),
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

const NOTIFICATION_EMAIL = PropertiesService.getScriptProperties().getProperty("NOTIFICATION_EMAIL");

function doPost(e) {
  if (!NOTIFICATION_EMAIL) return json({ ok: false, error: "Missing NOTIFICATION_EMAIL" });
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    if (!data.name || !data.email || !data.message) return json({ ok: false, error: "Missing required fields" });
    const subject = `New DevCatalyst proposal from ${data.name}`;
    const body = ["You have a new proposal from the DevCatalyst website.", "", `Name: ${data.name}`, `Company: ${data.company || "Not provided"}`, `Email: ${data.email}`, `Message: ${data.message}`, `Source: ${data.source || "Unknown"}`, `Submitted: ${data.submittedAt || new Date().toISOString()}`].join("\n");
    MailApp.sendEmail({ to: NOTIFICATION_EMAIL, subject, body, replyTo: String(data.email) });
    return json({ ok: true });
  } catch (error) { return json({ ok: false, error: String(error) }); }
}

function json(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }

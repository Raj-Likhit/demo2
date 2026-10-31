export const CONTACT_EMAIL = "contact@devcatalyst.in";
export const PARTNERSHIPS_EMAIL = "partnerships@devcatalyst.in";
export const TEAM_CC_EMAIL = "devcatalyst.2025@gmail.com";

export function emailHref(address: string = CONTACT_EMAIL, subject?: string) {
  const query = new URLSearchParams({ cc: TEAM_CC_EMAIL });
  if (subject) query.set("subject", subject);
  return `mailto:${address}?${query.toString().replace(/\+/g, "%20")}`;
}

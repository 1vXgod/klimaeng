/**
 * Branded transactional email templates (inline-styled HTML + plain text).
 * Colors follow the KlimaENG brand: teal #1b7d9e, navy #243b52.
 */

const TEAL = "#1b7d9e";
const NAVY = "#243b52";

function layout(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="sq">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#eef2f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:${NAVY};padding:20px 28px;">
            <span style="font-size:20px;font-weight:800;letter-spacing:-0.3px;">
              <span style="color:#5cc0de;">Klima</span><span style="color:#ffffff;">ENG</span><span style="color:#8fa3b8;font-size:11px;vertical-align:top;">&reg;</span>
            </span>
          </td>
        </tr>
        <tr><td style="padding:28px;">${bodyHtml}</td></tr>
        <tr>
          <td style="background:#f6f9fb;border-top:1px solid #e2e8f0;padding:18px 28px;font-size:12px;line-height:1.6;color:#68758d;">
            KlimaENG &middot; Rr. Fahri Fazliu Nr-326, Kodra e Trimave, Prishtin&euml;, Kosov&euml;<br>
            044-111-051 / 049-111-051 &middot; avnibunjaku@hotmail.com<br>
            <span style="color:#9aa7bd;">Ky email u d&euml;rgua automatikisht &mdash; ju lutemi mos u p&euml;rgjigjeni direkt.</span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function codeBlock(code: string) {
  return `<div style="margin:20px 0;text-align:center;">
    <span style="display:inline-block;background:#eaf6fa;border:1px solid #bfe3ef;border-radius:12px;padding:14px 28px;font-size:30px;font-weight:800;letter-spacing:10px;color:${TEAL};">${code}</span>
  </div>`;
}

export function verificationCodeEmail(name: string, code: string) {
  const firstName = name.split(" ")[0];
  return {
    subject: `${code} është kodi juaj i verifikimit — KlimaENG`,
    html: layout(
      "Verifikoni email-in",
      `<h1 style="margin:0 0 8px;font-size:20px;color:${NAVY};">Mirë se erdhët, ${firstName}!</h1>
       <p style="margin:0;font-size:14px;line-height:1.7;color:#45526b;">
         Faleminderit që u regjistruat në KlimaENG. Përdorni kodin më poshtë për të
         verifikuar adresën tuaj të email-it:
       </p>
       ${codeBlock(code)}
       <p style="margin:0;font-size:13px;line-height:1.7;color:#68758d;">
         Kodi vlen <strong>15 minuta</strong>. Nëse nuk keni krijuar llogari te ne,
         mund ta injoroni këtë email.
       </p>`
    ),
    text: `Mirë se erdhët, ${firstName}!\n\nKodi juaj i verifikimit në KlimaENG: ${code}\n\nKodi vlen 15 minuta. Nëse nuk keni krijuar llogari, injoroni këtë email.`,
  };
}

export function resetCodeEmail(name: string, code: string) {
  const firstName = name.split(" ")[0];
  return {
    subject: `${code} është kodi për rivendosjen e fjalëkalimit — KlimaENG`,
    html: layout(
      "Rivendosni fjalëkalimin",
      `<h1 style="margin:0 0 8px;font-size:20px;color:${NAVY};">Përshëndetje, ${firstName}</h1>
       <p style="margin:0;font-size:14px;line-height:1.7;color:#45526b;">
         Morëm një kërkesë për rivendosjen e fjalëkalimit të llogarisë suaj.
         Përdorni këtë kod për të vazhduar:
       </p>
       ${codeBlock(code)}
       <p style="margin:0;font-size:13px;line-height:1.7;color:#68758d;">
         Kodi vlen <strong>15 minuta</strong>. Nëse nuk e keni kërkuar ju këtë
         ndryshim, fjalëkalimi juaj mbetet i pandryshuar — thjesht injoroni këtë email.
       </p>`
    ),
    text: `Përshëndetje, ${firstName}\n\nKodi për rivendosjen e fjalëkalimit në KlimaENG: ${code}\n\nKodi vlen 15 minuta. Nëse nuk e kërkuat ju, injoroni këtë email.`,
  };
}

export type ReceiptItem = {
  name: string;
  code: string;
  qty: number;
  price: number;
};

export type ReceiptData = {
  customerName: string;
  orderNo: string;
  date: Date;
  items: ReceiptItem[];
  total: number;
  city: string;
  street: string;
  withInstallation: boolean;
};

const eur = (n: number) => `${n.toLocaleString("de-DE")} €`;

export function receiptEmail(data: ReceiptData) {
  const firstName = data.customerName.split(" ")[0];
  const dateStr = data.date.toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rowsHtml = data.items
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #edf1f6;font-size:13px;color:${NAVY};">
          <strong>${item.name}</strong><br>
          <span style="font-size:11px;color:#8b98b0;">Kodi: ${item.code}</span>
        </td>
        <td align="center" style="padding:10px 8px;border-bottom:1px solid #edf1f6;font-size:13px;color:#45526b;">${item.qty}×</td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #edf1f6;font-size:13px;font-weight:700;color:${NAVY};white-space:nowrap;">${eur(item.price * item.qty)}</td>
      </tr>`
    )
    .join("");

  const rowsText = data.items
    .map((i) => `  ${i.qty}× ${i.name} (kodi: ${i.code}) — ${eur(i.price * i.qty)}`)
    .join("\n");

  return {
    subject: `Fatura e porosisë ${data.orderNo} — KlimaENG`,
    html: layout(
      `Fatura ${data.orderNo}`,
      `<h1 style="margin:0 0 8px;font-size:20px;color:${NAVY};">Faleminderit, ${firstName}!</h1>
       <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#45526b;">
         Porosia juaj u pranua me sukses. Do t'ju kontaktojmë brenda 24 orëve për
         konfirmim${data.withInstallation ? " dhe terminin e montimit" : ""}.
       </p>

       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fb;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:20px;">
         <tr>
           <td style="padding:14px 18px;">
             <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b98b0;">Numri i porosisë</span><br>
             <span style="font-size:18px;font-weight:800;color:${TEAL};">${data.orderNo}</span>
           </td>
           <td align="right" style="padding:14px 18px;">
             <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b98b0;">Data</span><br>
             <span style="font-size:13px;font-weight:600;color:${NAVY};">${dateStr}</span>
           </td>
         </tr>
       </table>

       <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
         <tr>
           <td style="padding:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b98b0;">Produkti</td>
           <td align="center" style="padding:0 8px 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b98b0;">Sasia</td>
           <td align="right" style="padding:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8b98b0;">Çmimi</td>
         </tr>
         ${rowsHtml}
         <tr>
           <td colspan="2" style="padding:14px 0 0;font-size:15px;font-weight:800;color:${NAVY};">Totali</td>
           <td align="right" style="padding:14px 0 0;font-size:18px;font-weight:800;color:${TEAL};white-space:nowrap;">${eur(data.total)}</td>
         </tr>
       </table>

       <div style="margin-top:22px;padding:14px 18px;background:#f6f9fb;border:1px solid #e2e8f0;border-radius:12px;font-size:13px;line-height:1.7;color:#45526b;">
         <strong style="color:${NAVY};">Adresa e dërgesës/montimit:</strong><br>
         ${data.street}, ${data.city}<br>
         ${data.withInstallation ? "✔ Me montim profesional — çmimi i montimit (40–60 €) konfirmohet me telefon." : "Pa montim — vetëm dërgesa."}<br>
         Pagesa: me para në dorë ose me këste, pas ${data.withInstallation ? "montimit" : "dërgesës"}. Pa pagesë paraprake.
       </div>

       <p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#68758d;">
         Pyetje për porosinë? Na telefononi në <strong style="color:${NAVY};">044-111-051</strong> ose
         <strong style="color:${NAVY};">049-111-051</strong> duke përmendur numrin <strong>${data.orderNo}</strong>.
       </p>`
    ),
    text: `Faleminderit, ${firstName}!

Porosia juaj ${data.orderNo} u pranua me sukses (${dateStr}).

Artikujt:
${rowsText}

Totali: ${eur(data.total)}

Adresa: ${data.street}, ${data.city}
${data.withInstallation ? "Me montim profesional — çmimi i montimit (40–60 €) konfirmohet me telefon." : "Pa montim — vetëm dërgesa."}
Pagesa: me para në dorë ose me këste, pas ${data.withInstallation ? "montimit" : "dërgesës"}. Pa pagesë paraprake.

Pyetje? 044-111-051 / 049-111-051 — përmendni numrin ${data.orderNo}.
KlimaENG · Rr. Fahri Fazliu Nr-326, Kodra e Trimave, Prishtinë`,
  };
}

import { recommendBtu } from "@/lib/utils";
import type { ProductSnapshot } from "@/stores/shop";

/**
 * Rule-based product assistant. Runs fully client-side against the live
 * catalog — instant answers, zero API cost, easily swappable for an
 * LLM-backed endpoint later (same AssistantReply contract).
 */

export type AssistantReply = {
  text: string;
  products?: ProductSnapshot[];
  chips?: string[];
};

export const DEFAULT_CHIPS = [
  "Sa BTU më duhen?",
  "Më rekomando një klimë",
  "Çmimi i montimit",
  "Çfarë është inverter?",
  "Efiçienca energjetike",
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .replaceAll("ë", "e")
    .replaceAll("ç", "c")
    .trim();

function extractArea(msg: string): number | null {
  const m = msg.match(/(\d{1,3})\s*(m2|m²|metra|m\b)/i) ?? msg.match(/^(\d{1,3})$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 5 && n <= 400 ? n : null;
}

function pickByBtu(products: ProductSnapshot[], btu: number, count = 2) {
  return products
    .filter((p) => p.btu && p.btu >= btu * 0.95 && !["ACCESSORY", "BOILER"].includes(p.category))
    .sort((a, b) => (a.btu ?? 0) - (b.btu ?? 0) || a.price - b.price)
    .slice(0, count);
}

export function askAssistant(
  message: string,
  products: ProductSnapshot[]
): AssistantReply {
  const msg = norm(message);
  const area = extractArea(msg);

  // Room size → capacity + recommendation
  if (area) {
    const btu = recommendBtu(area);
    const recs = pickByBtu(products, btu);
    return {
      text: `Për një hapësirë prej ${area} m² rekomandohet kapacitet rreth ${btu.toLocaleString("de-DE")} BTU. ${
        recs.length
          ? "Ja modelet që i përshtaten më së miri:"
          : "Na kontaktoni për një ofertë të personalizuar."
      }`,
      products: recs,
      chips: ["Çmimi i montimit", "A keni pagesë me këste?", "Efiçienca energjetike"],
    };
  }

  if (/(btu|kapacitet|sa .*(klime|klima|fuqi)|cfare .*me duhet)/.test(msg)) {
    return {
      text: "Rregulli bazë është ~340 BTU për m². Më tregoni sipërfaqen e dhomës (p.sh. «25 m²») dhe ju llogaris kapacitetin e saktë bashkë me modelet e përshtatshme.",
      chips: ["20 m²", "35 m²", "50 m²", "70 m²"],
    };
  }

  if (/(rekomando|sugjero|cila klime|cilen klime|me e mira|best)/.test(msg)) {
    const featured = products
      .filter((p) => ["SPLIT", "MULTI"].includes(p.category))
      .sort((a, b) => b.price - a.price)
      .slice(0, 2);
    return {
      text: "Me kënaqësi! Për shumicën e shtëpive rekomandojmë një split inverter me Wi-Fi. Ja dy nga modelet tona më të vlerësuara — ose më tregoni sipërfaqen e dhomës për një rekomandim të saktë:",
      products: featured,
      chips: ["25 m²", "35 m²", "Krahaso produktet"],
    };
  }

  if (/(montim|instalim|montohet)/.test(msg)) {
    return {
      text: "Montimi standard kryhet brenda 48 orëve nga porosia dhe zgjat 2–4 orë. Për klimat e blera te ne, montimi bazik (deri në 3m tubacion) ofrohet me çmim preferencial 40–60€ sipas modelit. Puna mbulohet me 2 vjet garanci.",
      chips: ["Sa BTU më duhen?", "A keni pagesë me këste?"],
    };
  }

  if (/(keste|kredi|financim|pagese)/.test(msg)) {
    return {
      text: "Po! Për blerje mbi 300€ ofrojmë financim 6–24 muaj pa interes në bashkëpunim me bankat kryesore në Kosovë. Ju duhet vetëm letërnjoftimi — procedura zgjat ~15 minuta në dyqan.",
      chips: ["Më rekomando një klimë", "Çmimi i montimit"],
    };
  }

  if (/(garanci|warranty)/.test(msg)) {
    return {
      text: "Pajisjet vijnë me 2–5 vjet garanci zyrtare (modelet premium Midea dhe linja jonë Pro kanë 5 vjet). Montimi mbulohet me 2 vjet garanci pune nga KlimaENG, e zgjatshme me kontratë mirëmbajtjeje vjetore.",
      chips: ["Servisimi vjetor", "Më rekomando një klimë"],
    };
  }

  if (/(servis|mirembajtje|pastrim|defekt)/.test(msg)) {
    return {
      text: "Servisimi vjetor (pastrim kimik + kontroll gazi + diagnostikim) kushton 25–35€ dhe rezervohet me një telefonatë. Për defekte urgjente, linja 24/7: 044-111-051 / 049-111-051 — dalim edhe të dielave.",
      chips: ["Garancia", "Çmimi i montimit"],
    };
  }

  if (/(inverter)/.test(msg)) {
    return {
      text: "Teknologjia inverter e përshtat fuqinë e kompresorit në kohë reale, në vend që të ndizet e fiket vazhdimisht. Rezultati: deri në 40% më pak konsum, temperaturë stabile pa luhatje dhe punë shumë më e qetë. Të gjitha klimat tona split janë inverter.",
      chips: ["Efiçienca energjetike", "Më rekomando një klimë"],
    };
  }

  if (/(eficienc|energji|kursim|a\+\+|klase)/.test(msg)) {
    return {
      text: "Klasat energjetike shkojnë nga D (më e dobët) te A+++ (më e mira). Një A+++ harxhon ~40% më pak se një klasë C. Në çdo kartë produkti do të gjeni etiketat ❄ (ftohje) dhe ☀ (ngrohje). Për dimrat tanë, kërkoni SCOP ≥ 4.0.",
      chips: ["Më rekomando një klimë", "Sa BTU më duhen?"],
    };
  }

  if (/(krahaso|compare|dallimi)/.test(msg)) {
    return {
      text: "Në çdo kartë produkti klikoni ikonën e peshores për ta shtuar në krahasim (deri në 3 produkte), pastaj hapni faqen «Krahaso» nga menyja — specifikat vendosen krah për krah automatikisht.",
      chips: ["Më rekomando një klimë", "Efiçienca energjetike"],
    };
  }

  if (/(oferte|zbritje|aksion|discount)/.test(msg)) {
    const discounted = products
      .filter((p) => p.oldPrice && p.oldPrice > p.price)
      .sort(
        (a, b) =>
          (b.oldPrice! - b.price) / b.oldPrice! - (a.oldPrice! - a.price) / a.oldPrice!
      )
      .slice(0, 2);
    return {
      text: "Ja ofertat më të forta aktive këtë muaj:",
      products: discounted,
      chips: ["Më rekomando një klimë", "A keni pagesë me këste?"],
    };
  }

  if (/(cmim|kushton|price|sa kushton)/.test(msg)) {
    return {
      text: "Klimat tona nisin nga 305€ (Pro Inverter 9000 BTU) deri te modelet premium ~1.190€. Montimi bazik 40–60€. Më tregoni sipërfaqen e dhomës dhe buxhetin, dhe ju gjej opsionin ideal.",
      chips: ["25 m²", "35 m²", "Ofertat aktive"],
    };
  }

  if (/(pershendetje|tung|hello|hi|mire ?dita|ckemi|c ?kemi)/.test(msg)) {
    return {
      text: "Përshëndetje! 👋 Jam asistenti i KlimaENG. Mund t'ju ndihmoj të gjeni klimën e duhur, të llogarisni kapacitetin BTU, ose t'ju përgjigjem për montim, çmime dhe garanci. Si mund t'ju ndihmoj?",
      chips: DEFAULT_CHIPS,
    };
  }

  if (/(kontakt|telefon|adrese|ku ndodheni|orari)/.test(msg)) {
    return {
      text: "Na gjeni në Rr. Fahri Fazliu Nr-326, Kodra e Trimave, Prishtinë. ☎ 044-111-051 / 049-111-051 · ✉ avnibunjaku@hotmail.com · E Hënë–E Shtunë 08:00–18:00. Për urgjenca teknike jemi 24/7.",
      chips: ["Më rekomando një klimë", "Çmimi i montimit"],
    };
  }

  return {
    text: "Nuk jam i sigurt që e kuptova saktë — por një nga temat më poshtë ndihmon pothuajse gjithmonë. Ose më shkruani sipërfaqen e dhomës (p.sh. «30 m²») dhe nis nga aty!",
    chips: DEFAULT_CHIPS,
  };
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const f = (features: string[]) => JSON.stringify(features);

const products = [
  {
    slug: "midea-black-crystal-12000",
    name: "Midea Black Crystal 12000 BTU",
    brand: "Midea",
    category: "SPLIT",
    price: 891,
    oldPrice: 990,
    shortDesc:
      "Dizajn ikonik me xham të zi dhe teknologji inverter të gjeneratës së fundit.",
    description:
      "Black Crystal është kulmi i dizajnit të Midea-s: panel prej xhami të zi të kalitur, ftohje ultra e qetë dhe kontroll i plotë nga telefoni. Kompresori inverter DC përshtat fuqinë në kohë reale duke ulur konsumin deri në 40% dhe duke mbajtur temperaturën stabile pa luhatje. Ideal për dhoma ndenje dhe zyra premium ku dizajni ka rëndësi.",
    btu: 12000,
    coverageM2: 35,
    energyCool: "A++",
    energyHeat: "A+++",
    seer: 7.4,
    scop: 4.6,
    refrigerant: "R32",
    noiseDb: 19,
    wifi: true,
    inverter: true,
    warrantyYears: 5,
    stock: 14,
    featured: true,
    badge: "Më i shituri",
    render: "wall",
    accent: "graphite",
    features: f([
      "Panel xhami i zi i kalitur",
      "Modaliteti i gjumit me 8 kurba temperature",
      "Vetëpastrim me jonizim",
      "Kontroll Wi-Fi + asistentë zanorë",
      "Rrjedhje ajri 3D pa erë të drejtpërdrejtë",
    ]),
  },
  {
    slug: "midea-xtreme-eco-9000",
    name: "Midea Xtreme Eco 9000 BTU",
    brand: "Midea",
    category: "SPLIT",
    price: 426,
    oldPrice: 520,
    shortDesc: "Efikasitet maksimal me çmim të arritshëm — zgjedhja e mençur.",
    description:
      "Xtreme Eco ofron raportin më të mirë çmim–performancë në klasën e vet. Me kompresor inverter dhe gaz ekologjik R32, ftoh dhe ngroh me kosto minimale energjie. Funksioni ECO ul konsumin gjatë natës ndërsa filtri me densitet të lartë mban ajrin e pastër.",
    btu: 9000,
    coverageM2: 25,
    energyCool: "A++",
    energyHeat: "A+",
    seer: 6.5,
    scop: 4.0,
    refrigerant: "R32",
    noiseDb: 22,
    wifi: true,
    inverter: true,
    warrantyYears: 3,
    stock: 22,
    featured: true,
    badge: "Ofertë",
    render: "wall",
    accent: "pearl",
    features: f([
      "Modaliteti ECO për kursim nate",
      "Filtër me densitet të lartë",
      "Ndezje e shpejtë në 3 sekonda",
      "Kontroll Wi-Fi nga aplikacioni",
    ]),
  },
  {
    slug: "klimaeng-arctic-split-12000",
    name: "KlimaENG Arctic Split 12000 BTU",
    brand: "KlimaENG",
    category: "SPLIT",
    price: 395,
    oldPrice: 449,
    shortDesc: "Linja jonë më e besuar — performancë solide për çdo shtëpi.",
    description:
      "Arctic Split është zgjedhja e mijëra familjeve në Kosovë. I projektuar për klimën tonë kontinentale, ngroh në mënyrë efikase deri në −15°C dhe ftoh pa zhurmë edhe në pikun e verës. Montimi kryhet brenda 48 orëve nga teknikët tanë të certifikuar.",
    btu: 12000,
    coverageM2: 32,
    energyCool: "A++",
    energyHeat: "A+",
    seer: 6.8,
    scop: 4.1,
    refrigerant: "R32",
    noiseDb: 24,
    wifi: false,
    inverter: true,
    warrantyYears: 3,
    stock: 31,
    featured: false,
    badge: null,
    render: "wall",
    accent: "blue",
    features: f([
      "Ngrohje efikase deri në −15°C",
      "Timer 24-orësh",
      "Rrjedhje ajri me 4 shpejtësi",
      "Funksion Turbo për ftohje të shpejtë",
    ]),
  },
  {
    slug: "klimaeng-arctic-split-18000",
    name: "KlimaENG Arctic Split 18000 BTU",
    brand: "KlimaENG",
    category: "SPLIT",
    price: 539,
    oldPrice: 599,
    shortDesc: "Fuqi e shtuar për hapësira të mëdha deri në 50 m².",
    description:
      "Versioni 18000 BTU i linjës Arctic mbulon me lehtësi dhoma të mëdha ndenjeje, lokale dhe zyra të hapura. Ventilatori me diametër të zgjeruar shpërndan ajrin njëtrajtësisht në çdo cep të hapësirës pa krijuar rryma të pakëndshme.",
    btu: 18000,
    coverageM2: 50,
    energyCool: "A++",
    energyHeat: "A+",
    seer: 6.6,
    scop: 4.0,
    refrigerant: "R32",
    noiseDb: 27,
    wifi: false,
    inverter: true,
    warrantyYears: 3,
    stock: 18,
    featured: false,
    badge: null,
    render: "wall",
    accent: "blue",
    features: f([
      "Mbulim deri në 50 m²",
      "Ventilator me diametër të zgjeruar",
      "Funksion kundër mykut",
      "Rinisje automatike pas ndërprerjes së rrymës",
    ]),
  },
  {
    slug: "klimaeng-pro-inverter-9000",
    name: "KlimaENG Pro Inverter 9000 BTU",
    brand: "KlimaENG",
    category: "SPLIT",
    price: 305,
    oldPrice: 359,
    shortDesc: "Hyrja më e volitshme në botën e teknologjisë inverter.",
    description:
      "Pro Inverter 9000 sjell teknologjinë inverter në çdo buxhet. Perfekt për dhoma gjumi dhe zyra të vogla, punon me vetëm 19 dB në modalitetin e natës — më i qetë se një pëshpëritje. Garanci 3-vjeçare dhe servisim i garantuar nga rrjeti ynë.",
    btu: 9000,
    coverageM2: 22,
    energyCool: "A++",
    energyHeat: "A+",
    seer: 6.4,
    scop: 4.0,
    refrigerant: "R32",
    noiseDb: 19,
    wifi: false,
    inverter: true,
    warrantyYears: 3,
    stock: 40,
    featured: true,
    badge: "Ofertë",
    render: "wall",
    accent: "pearl",
    features: f([
      "Vetëm 19 dB në modalitetin e natës",
      "Kompresor inverter DC",
      "Dehumidifikim inteligjent",
      "Telekomandë me ekran LCD",
    ]),
  },
  {
    slug: "klimaeng-pro-inverter-24000-duo",
    name: "KlimaENG Pro Inverter 24000 BTU Duo",
    brand: "KlimaENG",
    category: "MULTI",
    price: 1044,
    oldPrice: 1099,
    shortDesc: "Një njësi e jashtme, dy të brendshme — zgjidhja multi-split.",
    description:
      "Sistemi Duo lidh dy njësi të brendshme 12000 BTU me një njësi të vetme të jashtme, duke kursyer hapësirë në fasadë dhe kosto montimi. Çdo dhomë kontrollohet e pavarur, me temperaturë dhe orar të veçantë. Ideal për banesa me dy dhoma ose zyra me dy ambiente.",
    btu: 24000,
    coverageM2: 70,
    energyCool: "A++",
    energyHeat: "A+",
    seer: 6.9,
    scop: 4.2,
    refrigerant: "R32",
    noiseDb: 24,
    wifi: true,
    inverter: true,
    warrantyYears: 5,
    stock: 8,
    featured: false,
    badge: null,
    render: "outdoor",
    accent: "pearl",
    features: f([
      "2 njësi të brendshme, 1 e jashtme",
      "Kontroll i pavarur për çdo dhomë",
      "Kursen hapësirë në fasadë",
      "Wi-Fi për të dyja njësitë",
    ]),
  },
  {
    slug: "klimaeng-tower-standing-24000",
    name: "KlimaENG Tower Standing 24000 BTU",
    brand: "KlimaENG",
    category: "STANDING",
    price: 827,
    oldPrice: 899,
    shortDesc: "Kolonë elegante për lokale, salla dhe hapësira komerciale.",
    description:
      "Tower Standing kombinon fuqinë e madhe me një siluetë të hollë që zë vetëm 0.16 m² dysheme. Ekrani LED me prekje dhe shpërndarja e ajrit në 360° e bëjnë zgjedhjen e parë për restorante, sallone dhe dyqane që kërkojnë klimatizim serioz me pamje përfaqësuese.",
    btu: 24000,
    coverageM2: 65,
    energyCool: "A+",
    energyHeat: "A+",
    seer: 6.1,
    scop: 3.8,
    refrigerant: "R32",
    noiseDb: 38,
    wifi: true,
    inverter: true,
    warrantyYears: 3,
    stock: 6,
    featured: false,
    badge: null,
    render: "standing",
    accent: "graphite",
    features: f([
      "Shpërndarje ajri 360°",
      "Ekran LED me prekje",
      "Vetëm 0.16 m² gjurmë në dysheme",
      "Modalitet komercial me punë 24/7",
    ]),
  },
  {
    slug: "klimaeng-tower-standing-48000-commercial",
    name: "KlimaENG Tower Standing 48000 BTU Commercial",
    brand: "KlimaENG",
    category: "STANDING",
    price: 1590,
    oldPrice: null,
    shortDesc: "Fuqia maksimale për salla eventesh, marketing dhe depo.",
    description:
      "Modeli komercial 48000 BTU është projektuar për hapësira deri në 140 m²: salla konferencash, evente, marketet dhe depo. Kompresori i dyfishtë rrotativ siguron ftohje të pandërprerë edhe në +45°C ambient, ndërsa struktura metalike e lyer me pluhur poliester i reziston përdorimit intensiv.",
    btu: 48000,
    coverageM2: 140,
    energyCool: "A+",
    energyHeat: "A",
    seer: 5.8,
    scop: 3.6,
    refrigerant: "R32",
    noiseDb: 45,
    wifi: true,
    inverter: true,
    warrantyYears: 3,
    stock: 3,
    featured: false,
    badge: "I ri",
    render: "standing",
    accent: "blue",
    features: f([
      "Mbulim deri në 140 m²",
      "Kompresor i dyfishtë rrotativ",
      "Punon deri në +45°C ambient",
      "Strukturë metalike industriale",
    ]),
  },
  {
    slug: "klimaeng-smartheat-pompe-12kw",
    name: "KlimaENG SmartHeat Pompë Termike 12kW",
    brand: "KlimaENG",
    category: "HEATPUMP",
    price: 2590,
    oldPrice: 2890,
    shortDesc: "Ngrohje qendrore me kosto 4× më të ulët se rryma direkte.",
    description:
      "SmartHeat është pompa termike ajër–ujë që zëvendëson kaldajën tradicionale: ngroh radiatorët, dyshemenë dhe ujin sanitar me koeficient efikasiteti COP 4.8 — për çdo 1 kWh rrymë prodhon 4.8 kWh ngrohje. E projektuar për dimrat e Kosovës, punon me fuqi të plotë deri në −25°C. Përfiton edhe nga skemat e subvencionimit për efiçiencë energjetike.",
    btu: null,
    coverageM2: 160,
    energyCool: "A++",
    energyHeat: "A+++",
    seer: null,
    scop: 4.8,
    refrigerant: "R290",
    noiseDb: 48,
    wifi: true,
    inverter: true,
    warrantyYears: 5,
    stock: 5,
    featured: true,
    badge: "A+++",
    render: "outdoor",
    accent: "blue",
    features: f([
      "COP 4.8 — kthim 480% i energjisë",
      "Punon deri në −25°C",
      "Ngroh radiatorë, dysheme dhe ujë sanitar",
      "Gaz natyror R290 me GWP minimal",
      "E përshtatshme për subvencione shtetërore",
    ]),
  },
  {
    slug: "klimaeng-aquaheat-120l",
    name: "KlimaENG AquaHeat 120L",
    brand: "KlimaENG",
    category: "BOILER",
    price: 224,
    oldPrice: 249,
    shortDesc: "Boiler inteligjent 120L me izolim të dyfishtë dhe ekran digjital.",
    description:
      "AquaHeat 120L mban ujin e ngrohtë deri në 72 orë falë izolimit të dyfishtë poliuretani. Ekrani digjital tregon temperaturën ekzakte dhe lejon programimin e ngrohjes në orët me tarifë të lirë. Rezistenca prej titani zgjat 3× më shumë se rezistencat standarde.",
    btu: null,
    coverageM2: null,
    energyCool: null,
    energyHeat: "B",
    seer: null,
    scop: null,
    refrigerant: null,
    noiseDb: null,
    wifi: false,
    inverter: false,
    warrantyYears: 5,
    stock: 12,
    featured: false,
    badge: null,
    render: "boiler",
    accent: "pearl",
    features: f([
      "Kapacitet 120L për familje 4–5 anëtarëshe",
      "Izolim i dyfishtë — ujë i ngrohtë 72 orë",
      "Programim në tarifën e lirë",
      "Rezistencë titani me garanci 5 vjet",
    ]),
  },
  {
    slug: "klimaeng-aquaheat-80l",
    name: "KlimaENG AquaHeat 80L",
    brand: "KlimaENG",
    category: "BOILER",
    price: 189,
    oldPrice: null,
    shortDesc: "Kompakt dhe efikas — ujë i ngrohtë për banesa dhe zyra.",
    description:
      "Versioni 80L i AquaHeat është zgjidhja kompakte për banesa dhe zyra të vogla. Forma cilindrike me diametër të reduktuar lejon montim edhe në hapësira të ngushta, ndërsa termostati i dyfishtë i sigurisë garanton mbrojtje maksimale.",
    btu: null,
    coverageM2: null,
    energyCool: null,
    energyHeat: "B",
    seer: null,
    scop: null,
    refrigerant: null,
    noiseDb: null,
    wifi: false,
    inverter: false,
    warrantyYears: 5,
    stock: 16,
    featured: false,
    badge: null,
    render: "boiler",
    accent: "pearl",
    features: f([
      "Kapacitet 80L, ideal për 2–3 anëtarë",
      "Diametër i reduktuar për hapësira të ngushta",
      "Termostat i dyfishtë sigurie",
      "Fllanxhë e zmaltuar kundër korrozionit",
    ]),
  },
  {
    slug: "tub-bakri-izoluar-3m",
    name: "Tub Bakri i Izoluar 3m",
    brand: "KlimaENG",
    category: "ACCESSORY",
    price: 45,
    oldPrice: null,
    shortDesc: "Çift tubash bakri me izolim UV-rezistent, gati për montim.",
    description:
      "Set profesional tubash bakri 1/4″ + 3/8″ me izolim kauçuku UV-rezistent, i njëjti që përdorin teknikët tanë në çdo montim. Bakër i pastër 99.9% pa saldime, i testuar në presion 45 bar.",
    btu: null,
    coverageM2: null,
    energyCool: null,
    energyHeat: null,
    seer: null,
    scop: null,
    refrigerant: null,
    noiseDb: null,
    wifi: false,
    inverter: false,
    warrantyYears: 2,
    stock: 60,
    featured: false,
    badge: null,
    render: "pipe",
    accent: "blue",
    features: f([
      "Bakër 99.9% pa saldime",
      "Izolim UV-rezistent 9mm",
      "I testuar në 45 bar",
      "Gjatësi 3m, diametra 1/4″ + 3/8″",
    ]),
  },
  {
    slug: "suport-montimi-universal",
    name: "Suport Montimi Universal",
    brand: "KlimaENG",
    category: "ACCESSORY",
    price: 29,
    oldPrice: null,
    shortDesc: "Suport i galvanizuar me amortizues vibrimesh, deri në 120kg.",
    description:
      "Suport universal për njësitë e jashtme, i prodhuar nga çelik i galvanizuar 3mm me kapacitet deri në 120kg. Amortizuesit e gomës eliminojnë vibrimet dhe zhurmën strukturore — dallimi dëgjohet menjëherë.",
    btu: null,
    coverageM2: null,
    energyCool: null,
    energyHeat: null,
    seer: null,
    scop: null,
    refrigerant: null,
    noiseDb: null,
    wifi: false,
    inverter: false,
    warrantyYears: 2,
    stock: 45,
    featured: false,
    badge: null,
    render: "bracket",
    accent: "graphite",
    features: f([
      "Çelik i galvanizuar 3mm",
      "Kapacitet deri në 120kg",
      "Amortizues gome kundër vibrimeve",
      "Bulona ankerimi të përfshirë",
    ]),
  },
  {
    slug: "midea-breezeless-e-12000",
    name: "Midea Breezeless E 12000 BTU",
    brand: "Midea",
    category: "SPLIT",
    price: 1190,
    oldPrice: null,
    shortDesc: "Ftohje pa rrymë ajri — 7928 mikrovrima shpërndajnë freskinë.",
    description:
      "Breezeless E rishkruan rregullat e klimatizimit: paneli me 7928 mikrovrima e shpërndan ajrin e ftohtë si mjegull e padukshme, pa asnjë rrymë të drejtpërdrejtë. Teknologjia fituese e çmimit Red Dot Design Award, tani e disponueshme në Kosovë ekskluzivisht nga KlimaENG.",
    btu: 12000,
    coverageM2: 35,
    energyCool: "A+++",
    energyHeat: "A+++",
    seer: 8.5,
    scop: 5.1,
    refrigerant: "R32",
    noiseDb: 18,
    wifi: true,
    inverter: true,
    warrantyYears: 5,
    stock: 7,
    featured: true,
    badge: "Premium",
    render: "wall",
    accent: "frost",
    features: f([
      "7928 mikrovrima — zero rrymë direkte",
      "Red Dot Design Award 2023",
      "SEER 8.5 — klasa më e lartë A+++",
      "Vetëm 18 dB — praktikisht i padëgjueshëm",
      "Sterilizim me dritë UV-C",
    ]),
  },
];

const reviews = [
  {
    authorName: "Arben Krasniqi",
    city: "Prishtinë",
    rating: 5,
    text: "Montimi u krye brenda ditës, pa asnjë vonesë. Teknikët ishin jashtëzakonisht profesionistë — mbuluan dyshemenë, pastruan çdo gjë pas punës dhe më shpjeguan çdo funksion të klimës. Rekomandim maksimal!",
  },
  {
    authorName: "Vlora Berisha",
    city: "Fushë Kosovë",
    rating: 5,
    text: "Pas montimit të Black Crystal, fatura e rrymës në gusht ishte 38€ më e ulët se vera e kaluar me klimën e vjetër. Investimi po kthehet më shpejt se sa prisja.",
  },
  {
    authorName: "Driton Gashi",
    city: "Podujevë",
    rating: 5,
    text: "Kisha frikë se në Podujevë nuk do të vinin për servisim, por ekipa erdhi brenda 24 orëve. Kontrata e mirëmbajtjes vjetore ia vlen çdo cent.",
  },
  {
    authorName: "Blerta Hoxha",
    city: "Prishtinë",
    rating: 5,
    text: "Konsulenca falas në shtëpi bëri gjithë dallimin — më rekomanduan 12000 BTU në vend të 18000 që doja të blija vetë. Më kursyen 150€ dhe klima punon perfekt.",
  },
  {
    authorName: "Lulzim Morina",
    city: "Obiliq",
    rating: 4,
    text: "Pompa termike SmartHeat na hoqi kaldajën me pelet përfundimisht. Shtëpia 140m² ngrohet njëtrajtësisht dhe kostoja mujore ra përgjysmë. Një yll më pak vetëm se montimi zgjati një ditë më shumë se plani.",
  },
  {
    authorName: "Fitore Rexhepi",
    city: "Prishtinë",
    rating: 5,
    text: "Si zyrë me 14 punëtorë, sistemi Duo ishte zgjidhja ideale. Secili ambient me temperaturën e vet dhe fasada mbeti e pastër me vetëm një njësi të jashtme.",
  },
];

async function main() {
  console.log("Seeding database…");

  // Clean slate (order matters for FK constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.address.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const [adminHash, demoHash] = await Promise.all([
    bcrypt.hash("Admin123!", 10),
    bcrypt.hash("Demo123!", 10),
  ]);

  const admin = await prisma.user.create({
    data: {
      name: "Admin KlimaENG",
      email: "admin@klimaeng.com",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "+383 44 000 000",
    },
  });

  const demo = await prisma.user.create({
    data: {
      name: "Arta Demolli",
      email: "demo@klimaeng.com",
      passwordHash: demoHash,
      role: "CUSTOMER",
      phone: "+383 44 123 456",
      addresses: {
        create: [
          {
            label: "Shtëpia",
            street: "Rr. Agim Ramadani 24",
            city: "Prishtinë",
            zip: "10000",
            phone: "+383 44 123 456",
            isDefault: true,
          },
          {
            label: "Zyra",
            street: "Rr. UÇK 51, Kati 3",
            city: "Prishtinë",
            zip: "10000",
            phone: "+383 44 123 456",
          },
        ],
      },
    },
  });

  const created = [] as { id: string; name: string; price: number }[];
  for (const p of products) {
    const prod = await prisma.product.create({ data: p });
    created.push({ id: prod.id, name: prod.name, price: prod.price });
  }

  for (const r of reviews) {
    await prisma.review.create({ data: { ...r, approved: true } });
  }

  // Orders spread across the last 9 months for realistic dashboard charts
  const now = new Date();
  const names = [
    ["Bekim Shala", "Prishtinë", "Rr. Luan Haradinaj 12"],
    ["Elira Kastrati", "Fushë Kosovë", "Rr. Nëna Terezë 8"],
    ["Gent Bytyqi", "Podujevë", "Rr. Zahir Pajaziti 3"],
    ["Rina Ahmeti", "Prishtinë", "Rr. Eqrem Çabej 19"],
    ["Ardian Sylejmani", "Obiliq", "Rr. Hasan Prishtina 5"],
    ["Dafina Musliu", "Prishtinë", "Lagjja Kalabria, Blloku B"],
    ["Leon Hajdari", "Graçanicë", "Rr. Kryesore 44"],
    ["Yllka Statovci", "Prishtinë", "Rr. Garibaldi 7"],
  ] as const;
  const statuses = [
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "COMPLETED",
    "CONFIRMED",
    "INSTALLING",
    "PENDING",
    "CANCELLED",
  ] as const;

  let orderCounter = 1240;
  for (let m = 8; m >= 0; m--) {
    const ordersThisMonth = m === 0 ? 7 : 3 + ((m * 7) % 5);
    for (let i = 0; i < ordersThisMonth; i++) {
      const who = names[(m * 3 + i) % names.length];
      const prod = created[(m * 5 + i * 3) % created.length];
      const second =
        (m + i) % 3 === 0
          ? created[(m * 2 + i * 5 + 4) % created.length]
          : null;
      const qty = 1;
      const total = prod.price * qty + (second ? second.price : 0);
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - m,
        Math.min(2 + i * 4, 27),
        9 + ((i * 3) % 9),
        (i * 17) % 60
      );
      const status =
        m === 0
          ? statuses[4 + (i % 4)]
          : statuses[(m + i) % 4];

      await prisma.order.create({
        data: {
          orderNo: `KE-${orderCounter++}`,
          userId: (m + i) % 4 === 0 ? demo.id : null,
          customerName: who[0],
          email: `${who[0].toLowerCase().replace(" ", ".")}@gmail.com`,
          phone: `+383 4${(4 + i) % 10} ${100 + m * 37 + i} ${200 + i * 53}`,
          city: who[1],
          street: who[2],
          withInstallation: prod.price > 100,
          status,
          total,
          createdAt: date,
          updatedAt: date,
          items: {
            create: [
              { productId: prod.id, name: prod.name, price: prod.price, qty },
              ...(second
                ? [
                    {
                      productId: second.id,
                      name: second.name,
                      price: second.price,
                      qty: 1,
                    },
                  ]
                : []),
            ],
          },
        },
      });
    }
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: demo.id,
        title: "Porosia juaj u konfirmua",
        body: "Porosia KE-1247 u konfirmua. Ekipi ynë do t'ju kontaktojë për terminin e montimit.",
        type: "order",
        read: true,
      },
      {
        userId: demo.id,
        title: "Servisimi vjetor po afron",
        body: "Klima juaj Arctic Split 12000 i afrohet afatit të servisimit vjetor. Rezervoni terminin me 15% zbritje.",
        type: "info",
        read: false,
      },
      {
        userId: demo.id,
        title: "Ofertë ekskluzive për ju",
        body: "Si klient besnik, përfitoni −10% shtesë në linjën AquaHeat deri më 31 korrik.",
        type: "promo",
        read: false,
      },
    ],
  });

  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, actor: "Admin KlimaENG", action: "Përditësoi çmimin", detail: "Midea Xtreme Eco 9000 — 520€ → 426€" },
      { userId: admin.id, actor: "Admin KlimaENG", action: "Shtoi produkt të ri", detail: "Midea Breezeless E 12000 BTU" },
      { userId: admin.id, actor: "Admin KlimaENG", action: "Konfirmoi porosinë", detail: "KE-1268 — Bekim Shala" },
      { userId: admin.id, actor: "Sistemi", action: "Stok i ulët", detail: "Tower Standing 48000 Commercial — 3 copë" },
      { userId: admin.id, actor: "Admin KlimaENG", action: "Aprovoi vlerësimin", detail: "Fitore Rexhepi — 5 yje" },
    ],
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Besnik Zeqiri",
        phone: "+383 45 222 333",
        email: "besnik.z@gmail.com",
        message:
          "Përshëndetje, kam një lokal 80m² në qendër të Prishtinës. A mund të vini për një vlerësim falas këtë javë?",
      },
      {
        name: "Adelina Peci",
        phone: "+383 49 555 111",
        email: "adelina.peci@outlook.com",
        message:
          "Interesohem për pompën termike SmartHeat. A kualifikohem për subvencionin e efiçiencës? Shtëpia është 130m² në Matiçan.",
        read: true,
      },
    ],
  });

  console.log(
    `Seeded ${created.length} products, ${reviews.length} reviews, orders across 9 months.`
  );
  console.log("Admin:  admin@klimaeng.com / Admin123!");
  console.log("Demo:   demo@klimaeng.com / Demo123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

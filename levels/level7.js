// js/levels/level7.js — Fake Scarcity / Urgency

const NOTIFICATIONS = [
  'Someone bought this 6 minutes ago',
  '14 people bought this in the last hour',
  'Someone just checked out with Wireless Earbuds',
  'M. in Austin added this to their cart just now',
];

const STYLES = `
  .l7-wrap{display:flex;flex-direction:column;background:#f0f2f2;font-family:system-ui,-apple-system,sans-serif}
  .l7-nav{background:#232f3e;padding:13px 18px;display:flex;align-items:center;gap:14px;flex-shrink:0}
  .l7-logo{color:#fff;font-size:21px;font-weight:700;letter-spacing:-.5px;white-space:nowrap;flex-shrink:0;cursor:pointer}
  .l7-logo span{color:#febd69}
  .l7-delivery{background:#232f3e;color:#e2e2e2;font-size:14px;padding:0 18px 10px;display:flex;align-items:center;gap:5px;flex-shrink:0}
  .l7-delivery b{color:#fff;font-weight:600}
  .l7-searchrow{flex:1;display:flex;min-width:0}
  .l7-searchbox{flex:1;display:flex;background:#fff;border-radius:9px;overflow:hidden;border:2px solid transparent;transition:border-color .15s,box-shadow .15s}
  .l7-catsel{background:#e9ecef;color:#444;font-size:15px;padding:0 12px;display:flex;align-items:center;border-right:1px solid #d8d8d3;flex-shrink:0;white-space:nowrap}
  .l7-searchbox:focus-within{border-color:#febd69;box-shadow:0 0 0 2px rgba(254,189,105,.25)}
  .l7-searchbox input{flex:1;border:none;outline:none;font-size:16px;color:#111;background:transparent;padding:0 14px;height:44px;min-width:0;font-family:inherit}
  .l7-sbtn{background:#febd69;border:none;padding:0 16px;height:44px;font-size:18px;cursor:pointer;flex-shrink:0}
  .l7-sbtn:hover{background:#f0a921}
  .l7-cartbtn{position:relative;background:#37475a;border:none;height:44px;padding:0 16px;border-radius:9px;cursor:pointer;display:flex;align-items:center;gap:8px;color:#fff;font-size:16px;font-family:inherit;flex-shrink:0;white-space:nowrap}
  .l7-cartbtn:hover{background:#485769}
  .l7-cartbadge{position:absolute;top:-8px;right:-8px;background:#febd69;color:#111;font-size:12px;font-weight:700;border-radius:50%;min-width:21px;height:21px;display:flex;align-items:center;justify-content:center;padding:0 3px;box-shadow:0 0 0 2px #232f3e}
  .l7-subnav{background:#37475a;padding:8px 18px;display:flex;gap:20px;overflow-x:auto;flex-shrink:0}
  .l7-subnav::-webkit-scrollbar{display:none}
  .l7-snitem{color:#fff;font-size:15px;white-space:nowrap;opacity:.82}
  .l7-goalbar{background:#1b2531;color:#febd69;font-size:15px;font-weight:500;padding:10px 18px;text-align:center;border-bottom:1px solid #37475a;flex-shrink:0}
  .l7-goalbar.done{background:#123018;color:#5fe39a}
  .l7-reservebar{background:#fbeee0;color:#7a4a14;font-size:14px;font-weight:500;padding:7px 18px;text-align:center;flex-shrink:0;border-bottom:.5px solid #f0ddc2}
  .l7-content{overflow-y:auto;overflow-x:hidden;flex:1;min-height:0}
  .l7-section{padding:22px;background:#fff;margin-bottom:10px}
  .l7-shead{font-size:18px;font-weight:600;color:#111;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
  .l7-seemore{font-size:15px;font-weight:500;color:#0C447C;cursor:default}
  .l7-seemore.active{cursor:pointer}
  .l7-seemore.active:hover{text-decoration:underline}
  .l7-row{display:flex;gap:24px;overflow-x:auto;padding-bottom:6px}
  .l7-row::-webkit-scrollbar{display:none}
  .l7-card{flex-shrink:0;width:140px;display:flex;flex-direction:column;gap:9px;cursor:pointer}
  .l7-card-img{width:140px;height:112px;background:radial-gradient(120% 120% at 50% 20%,#ffffff 0%,#f4f4f1 60%,#eaeae5 100%);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:41px;border:.5px solid #e6e6e1;position:relative;overflow:hidden;transition:box-shadow .15s,transform .15s}
  .l7-card-img::after{content:'';position:absolute;left:50%;bottom:13px;width:52%;height:10px;background:radial-gradient(closest-side,rgba(0,0,0,.16),transparent 75%);transform:translateX(-50%)}
  .l7-card:hover .l7-card-img{box-shadow:0 4px 14px rgba(0,0,0,.12);transform:translateY(-1px)}
  .l7-card-badge{position:absolute;top:7px;left:7px;background:#A32D2D;color:#fff;font-size:11px;font-weight:600;padding:3px 7px;border-radius:5px}
  .l7-card-title{font-size:14px;color:#111;line-height:1.3;min-height:36px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .l7-card-price{font-size:15px;font-weight:600;color:#111}
  .l7-card-orig{font-size:14px;color:#888;text-decoration:line-through}
  .l7-chip{flex-shrink:0;display:flex;align-items:center;gap:8px;padding:11px 16px;background:#f5f5f2;border:.5px solid #e8e8e4;border-radius:26px;cursor:pointer;font-size:15px;color:#111;white-space:nowrap;transition:background .12s,box-shadow .15s}
  .l7-chip:hover{background:#ececea;box-shadow:0 1px 5px rgba(0,0,0,.08)}
  .l7-chip span{font-size:20px}
  .l7-atc{font-size:13px;background:#febd69;border:1px solid #f0a921;border-radius:7px;padding:8px 10px;cursor:pointer;color:#111;font-family:inherit;width:100%}
  .l7-atc:hover{background:#f0a921}
  .l7-atc.added{background:#EAF3DE;color:#27500A;border-color:#27500A}
  .l7-feed{background:#f0f2f2}
  .l7-feed-head{padding:13px 18px;background:#fff;font-size:15px;color:#555;border-bottom:.5px solid #e8e8e4}
  .l7-feed-head strong{color:#111}
  .l7-banner{padding:10px 18px;font-size:15px;font-weight:500;margin-bottom:3px}
  .l7-banner.red{background:#FCEBEB;color:#A32D2D}
  .l7-banner.amber{background:#FAEEDA;color:#854F0B}
  .l7-banner.blue{background:#E6F1FB;color:#185FA5}
  .l7-notif{padding:9px 18px;font-size:14px;color:#888;background:#f9f9f7;border-bottom:.5px solid #f0f0ec;font-style:italic;margin-bottom:3px}
  .l7-product{padding:22px;display:flex;gap:20px;background:#fff;margin-bottom:3px;cursor:pointer;transition:background .12s}
  .l7-product:hover{background:#fafafa}
  .l7-pimg{width:104px;height:104px;border-radius:15px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:39px;background:radial-gradient(120% 120% at 50% 20%,#ffffff 0%,#f4f4f1 60%,#eaeae5 100%);border:.5px solid #e6e6e1;position:relative;overflow:hidden}
  .l7-pimg::after{content:'';position:absolute;left:50%;bottom:10px;width:50%;height:8px;background:radial-gradient(closest-side,rgba(0,0,0,.15),transparent 75%);transform:translateX(-50%)}
  .l7-pbody{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
  .l7-ptitle{font-size:18px;color:#0C447C;line-height:1.4;font-weight:500}
  .l7-ptitle:hover{text-decoration:underline;color:#c45500}
  .l7-pstars{font-size:15px;color:#854F0B}
  .l7-rcount{color:#0C447C;font-weight:500}
  .l7-pprice{font-size:21px;font-weight:600;color:#111}
  .l7-pprice .orig{font-size:15px;text-decoration:line-through;color:#aaa;margin-left:6px;font-weight:400}
  .l7-pbadge{font-size:14px;font-weight:500;padding:4px 10px;border-radius:5px;display:inline-block;margin-top:2px}
  .l7-br{background:#FCEBEB;color:#A32D2D}
  .l7-ba{background:#FAEEDA;color:#633806}
  .l7-bg{background:#EAF3DE;color:#27500A}
  .l7-pmeta{font-size:15px;color:#aaa;margin-top:2px}
  .l7-product .l7-atc{align-self:flex-start;width:auto;padding:10px 22px;font-size:16px;margin-top:7px}
  .l7-cart{padding:20px;display:flex;flex-direction:column;gap:14px;background:#fff;min-height:280px}
  .l7-cart-head{font-size:21px;font-weight:600;color:#111;border-bottom:1px solid #e8e8e4;padding-bottom:13px}
  .l7-crow{display:flex;justify-content:space-between;align-items:center;font-size:16px;padding:13px 0;border-bottom:.5px solid #e8e8e4;gap:11px}
  .l7-crow:last-of-type{border-bottom:none}
  .l7-cname{flex:1;color:#111;line-height:1.4}
  .l7-cremove{background:none;border:none;color:#0C447C;font-size:15px;cursor:pointer;font-family:inherit;padding:4px 7px;flex-shrink:0}
  .l7-cremove:hover{text-decoration:underline;color:#c45500}
  .l7-ctotal{display:flex;justify-content:space-between;font-size:18px;font-weight:600;padding-top:13px;border-top:1px solid #ccc}
  .l7-obtn{background:#febd69;border:1px solid #f0a921;border-radius:9px;padding:14px;font-size:18px;font-weight:500;cursor:pointer;width:100%;color:#111;font-family:inherit}
  .l7-obtn:hover{background:#f0a921}
  .l7-obtn:disabled{opacity:.55;cursor:default}
  .l7-backbtn{background:none;border:none;color:#0C447C;font-size:15px;cursor:pointer;font-family:inherit;text-align:left;padding:0;align-self:flex-start}
  .l7-backbtn:hover{text-decoration:underline}
  .l7-empty{padding:40px;text-align:center;color:#aaa;font-size:16px}
  .l7-pdp{padding:20px;background:#fff;display:flex;flex-direction:column;gap:15px}
  .l7-pdp-top{display:flex;gap:20px;align-items:flex-start}
  .l7-pdp-img{width:126px;height:126px;background:radial-gradient(120% 120% at 50% 20%,#ffffff 0%,#f4f4f1 60%,#eaeae5 100%);border-radius:17px;display:flex;align-items:center;justify-content:center;font-size:56px;border:.5px solid #e6e6e1;flex-shrink:0;position:relative;overflow:hidden}
  .l7-pdp-img::after{content:'';position:absolute;left:50%;bottom:14px;width:48%;height:11px;background:radial-gradient(closest-side,rgba(0,0,0,.16),transparent 75%);transform:translateX(-50%)}
  .l7-pdp-info{flex:1;display:flex;flex-direction:column;gap:6px}
  .l7-pdp-title{font-size:20px;font-weight:600;color:#111;line-height:1.4}
  .l7-pdp-stars{font-size:15px;color:#854F0B}
  .l7-pdp-price{font-size:25px;font-weight:700;color:#111}
  .l7-pdp-orig{font-size:15px;color:#888;text-decoration:line-through;margin-left:6px;font-weight:400}
  .l7-pdp-desc{font-size:16px;color:#555;line-height:1.6;border-top:.5px solid #e8e8e4;padding-top:13px}
  .l7-pdp-meta{font-size:15px;color:#555;display:flex;flex-direction:column;gap:6px}
  .l7-pdp-meta span{display:flex;gap:7px;align-items:center}
  .l7-pdp .l7-atc{padding:13px 20px;font-size:18px}
`;

function injectStyles() {
  document.getElementById('l7-style')?.remove();
  const s = document.createElement('style');
  s.id = 'l7-style';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function fmt(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}
function randViewers() { return Math.floor(Math.random() * 120) + 780; }
const VIEWER_PHRASES = n => Math.random() < 0.5 ? n + ' people viewed today' : n + ' people have this in their cart right now';
function starsHTML(s) { return s ? s.replace(/\(([\d,]+)\)/, '(<span class="l7-rcount">$1</span>)') : ''; }

// ── Catalog — only what's actually shown ───────────────────────────────────
const PRODUCTS = {
  AdventureBackpack: { img: '🎒', title: 'Adventure Backpack — 40L', price: 39.99, orig: null,   stars: '★★★★☆ (4,892)', desc: 'Versatile 40L adventure backpack with padded back panel, laptop sleeve, rain cover, and multiple organizer pockets. Built for weekend trips and everyday carry.', meta: ['Ships today', 'Eligible for free shipping'] },
  MiniDaypack:       { img: '🎒', title: 'Mini Daypack — 12L',        price: 17.99, orig: null,   stars: '★★★☆☆ (1,447)', desc: 'Compact 12L daypack for day hikes, city commutes, or gym visits. Lightweight at 0.4 lbs.', meta: ['Usually ships within 2 days'] },
  SchoolBackpack:    { img: '🎒', title: 'School Backpack — 20L',     price: 16.49, orig: null,   stars: '★★★☆☆ (980)',   desc: 'Roomy 20L school backpack with padded straps, organizer pocket, and laptop sleeve up to 15".', meta: ['Usually ships within 2 days'] },
  LaptopBackpack:    { img: '🎒', title: 'Laptop Backpack — 25L',     price: 28.99, orig: 34.99,  stars: '★★★★☆ (3,310)', desc: '25L backpack with padded sleeve up to 16", USB charging port, TSA-friendly layout.', meta: ['Ships today'] },
  TrekkingPack:      { img: '🎒', title: 'Trekking Backpack — 35L',   price: 32.99, orig: 44.99,  stars: '★★★★☆ (2,105)', desc: '35L trekking pack with waterproof zipper, adjustable hip belt, integrated rain cover.', meta: ['Ships today'] },
  WirelessEarbuds:   { img: '🎧', title: 'Wireless Earbuds',          price: 24.99, orig: 49.99,  stars: '★★★★☆ (12,481)', desc: 'True wireless earbuds with ANC, 8-hour battery, and a charging case.', meta: ['Ships today'] },
  Smartwatch:        { img: '⌚', title: 'Smartwatch',                 price: 149.99, orig: 199.99, stars: '★★★★☆ (5,820)', desc: 'Heart rate monitoring, GPS, sleep tracking, 7-day battery life.', meta: ['Sold by TechGear Direct'] },
  Charger65W:        { img: '🔌', title: '65W Charger',                price: 14.99, orig: 29.99,  stars: '★★★★☆ (8,320)', desc: 'Universal 65W GaN charger with 3 ports.', meta: ['Ships today'] },
  SmartBulb:         { img: '💡', title: 'Smart Bulb 4-pack',          price: 12.99, orig: 24.99,  stars: '★★★★☆ (6,540)', desc: 'Works with Alexa and Google Home. 16 million colors, dimmable.', meta: ['Sold by SmartHome Co'] },
  OutdoorCamping:    { img: '🏕️', title: 'Outdoor & Camping',          price: null,  orig: null,   stars: null, desc: 'Tents, sleeping bags, camp stoves, and more.', meta: ['Browse hundreds of products'] },
  Travel:            { img: '🧳', title: 'Travel',                     price: null,  orig: null,   stars: null, desc: 'Suitcases, travel pillows, packing cubes, passport holders.', meta: ['Browse hundreds of products'] },
  Electronics:       { img: '🔌', title: 'Electronics',                price: null,  orig: null,   stars: null, desc: 'Headphones, wearables, chargers, and smart home gadgets.', meta: ['Browse hundreds of products'] },
  Tent2Person:       { img: '⛺', title: '2-Person Tent',               price: 79.99, orig: 99.99,  stars: '★★★★☆ (2,240)', desc: 'Weatherproof 2-person tent with rainfly and a freestanding pole design. Sets up in under 5 minutes.', meta: ['Ships today'] },
  HikingBoots:       { img: '🥾', title: 'Waterproof Hiking Boots',    price: 64.99, orig: 89.99,  stars: '★★★★☆ (3,105)', desc: 'Waterproof hiking boots with ankle support and a grippy outsole built for rocky trails.', meta: ['Ships today'] },
  SleepingBag:       { img: '🛌', title: '3-Season Sleeping Bag',      price: 44.99, orig: 59.99,  stars: '★★★★☆ (1,830)', desc: 'Rated to 20°F and compresses down to the size of a football for easy packing.', meta: ['Usually ships within 2 days'] },
  CampStove:         { img: '🔥', title: 'Portable Camp Stove',        price: 29.99, orig: null,   stars: '★★★★☆ (960)',   desc: 'Compact folding stove with piezo ignition. Boils a liter of water in under 3 minutes.', meta: ['Ships today'] },
  Headlamp:          { img: '🔦', title: 'Rechargeable Headlamp',      price: 18.99, orig: 24.99,  stars: '★★★★☆ (2,510)', desc: '350-lumen rechargeable headlamp with a red night-vision mode and adjustable strap.', meta: ['Ships today'] },
  CampChair:         { img: '🪑', title: 'Folding Camp Chair',         price: 34.99, orig: 44.99,  stars: '★★★★☆ (1,675)', desc: 'Lightweight folding camp chair with a cup holder and side pocket. Packs into its own bag.', meta: ['Ships today'] },
  WaterFilter:       { img: '💧', title: 'Portable Water Filter',      price: 24.99, orig: null,   stars: '★★★★☆ (3,920)', desc: 'Filters up to 1,500 gallons of water, removing 99.9% of bacteria and protozoa.', meta: ['Ships today'] },
  Hammock:           { img: '🪢', title: 'Camping Hammock',            price: 27.99, orig: 34.99,  stars: '★★★★☆ (2,240)', desc: 'Parachute-nylon hammock with tree straps included. Holds up to 400 lbs.', meta: ['Usually ships within 2 days'] },
  Cooler:            { img: '🧊', title: '20-Quart Cooler',            price: 49.99, orig: 64.99,  stars: '★★★★☆ (1,340)', desc: 'Keeps ice for up to 3 days. Bear-resistant latch and non-slip feet.', meta: ['Ships today'] },
  PackingCubes:      { img: '🧳', title: 'Packing Cubes (6-Set)',      price: 19.99, orig: 26.99,  stars: '★★★★☆ (4,410)', desc: 'Compress and organize a suitcase with six zippered cubes in graduated sizes.', meta: ['Ships today'] },
  TravelPillow:      { img: '💤', title: 'Memory Foam Travel Pillow',  price: 15.99, orig: 22.99,  stars: '★★★☆☆ (2,780)', desc: 'Ergonomic memory foam neck pillow with a washable cover. Compresses for storage.', meta: ['Ships today'] },
  PassportHolder:    { img: '🛂', title: 'RFID Passport Holder',       price: 12.99, orig: 16.99,  stars: '★★★★☆ (2,860)', desc: 'RFID-blocking passport wallet with card slots and a pen holder.', meta: ['Ships today'] },
  LuggageScale:      { img: '⚖️', title: 'Digital Luggage Scale',      price: 9.99,  orig: 14.99,  stars: '★★★★☆ (5,120)', desc: 'Handheld digital scale for weighing checked bags before you get to the airport.', meta: ['Ships today'] },
  TSALocks:          { img: '🔒', title: 'TSA-Approved Locks (2-Pack)', price: 8.99, orig: 12.99,  stars: '★★★★☆ (3,340)', desc: 'TSA-approved combination locks for zippered luggage. Airport security can open them without cutting.', meta: ['Ships today'] },
  ToiletryBag:       { img: '🧴', title: 'Hanging Toiletry Bag',       price: 17.99, orig: 23.99,  stars: '★★★★☆ (2,110)', desc: 'Water-resistant hanging toiletry bag with a metal hook and a clear TSA-friendly pouch.', meta: ['Ships today'] },
  PowerBank:         { img: '🔋', title: '10,000mAh Power Bank',       price: 19.99, orig: 29.99,  stars: '★★★★☆ (7,230)', desc: 'Slim 10,000mAh power bank with USB-C fast charging. Fits in a pocket.', meta: ['Ships today'] },
  BluetoothSpeaker:  { img: '🔊', title: 'Portable Bluetooth Speaker', price: 22.99, orig: 34.99,  stars: '★★★★☆ (4,050)', desc: 'Waterproof portable speaker with a 12-hour battery and punchy bass.', meta: ['Ships today'] },
  PhoneCase:         { img: '📱', title: 'Shockproof Phone Case',      price: 11.99, orig: 16.99,  stars: '★★★★☆ (3,610)', desc: 'Shockproof case with raised edges to protect the screen and camera.', meta: ['Ships today'] },
  USBCHub:           { img: '🖧', title: '7-in-1 USB-C Hub',           price: 26.99, orig: 34.99,  stars: '★★★★☆ (2,470)', desc: '7-in-1 USB-C hub with HDMI, an SD card reader, and 100W pass-through charging.', meta: ['Ships today'] },
};

const HOME_DEALS = ['WirelessEarbuds', 'Smartwatch', 'Charger65W', 'SmartBulb', 'PowerBank', 'BluetoothSpeaker', 'Tent2Person', 'HikingBoots'];
const HOME_CATS  = ['OutdoorCamping', 'Travel', 'Electronics'];
const CATEGORY_PRODUCTS = {
  OutdoorCamping: ['TrekkingPack', 'Tent2Person', 'HikingBoots', 'SleepingBag','MiniDaypack', 'CampStove', 'Headlamp', 'CampChair', 'WaterFilter', 'Hammock', 'Cooler'],
  Travel:         ['LaptopBackpack', 'SchoolBackpack', 'TrekkingPack', 'PackingCubes', 'TravelPillow', 'PassportHolder', 'LuggageScale', 'TSALocks', 'ToiletryBag'],
  Electronics:    ['WirelessEarbuds', 'Smartwatch', 'Charger65W', 'SmartBulb', 'PowerBank', 'BluetoothSpeaker', 'PhoneCase', 'USBCHub'],
};

const FEED_ITEMS = [
  { t: 'banner', cls: 'red', txt: '⚡ Lightning Deal ends in 02:13', id: 'l7-dealtimer' },
  { t: 'product', key: 'WirelessEarbuds', badges: [['l7-ba', 'Sponsored']], meta: '' },
  { t: 'notif', txt: NOTIFICATIONS[0] },
  { t: 'banner', cls: 'amber', txt: 'Results for "backpack" — 1,284 items' },
  { t: 'product', key: 'MiniDaypack',    badges: [['l7-bg', 'Compact & lightweight']], meta: '' },
  { t: 'product', key: 'SchoolBackpack', badges: [['l7-bg', 'Budget pick']], meta: '' },
  { t: 'notif', txt: NOTIFICATIONS[1] },
  { t: 'product', key: 'LaptopBackpack', badges: [['l7-ba', 'Padded laptop sleeve']], meta: '' },
  { t: 'banner', cls: 'blue', txt: 'Free shipping on orders over $35' },
  { t: 'product', key: 'TrekkingPack',   badges: [['l7-ba', 'Waterproof zipper']], meta: '' },
  { t: 'notif', txt: NOTIFICATIONS[2] },
  { t: 'product', key: 'AdventureBackpack', badges: [['l7-ba', "Editor's pick"], ['l7-br', 'Only 1 left in stock!']], meta: VIEWER_PHRASES(randViewers()), isTarget: true },
  { t: 'notif', txt: NOTIFICATIONS[3] },
];

const TARGET_NAME  = PRODUCTS.AdventureBackpack.title;
const TARGET_PRICE = PRODUCTS.AdventureBackpack.price;

const level7 = {
  id: 'l7',
  title: 'Level 7',
  isAI: false,
  goal: 'Buy only the Adventure Backpack — 40L',
  hints: [
    "Search for 'backpack' using the search bar at the top to find what you need.",
    "Several backpacks are in the results — only one is the exact target: 'Adventure Backpack — 40L'. Read titles carefully.",
    "Add it to your cart, then open your cart from the top-right and remove anything that snuck in before placing your order.",
  ],
  pattern: 'Fake Scarcity / Urgency',
  manip: 82,
  brief: "Fake scarcity and urgency are designed to impair your decision-making with a false deadline to rush you into decisions. Countdown timers, 'Only 1 left!', and 'X people viewing' create a sense of panic that makes you act before you think. Almost none of it is real.",
  goalDetail: "You want to buy one specific item: the Adventure Backpack — 40L. Start from the home screen and search for it. Several other backpacks are mixed into the results as decoys. Add the right one to your cart and check out with only that item.",
  dollars: {
    label: 'If every urgency signal worked on you',
    amount: 47.97,
    period: 'one-time',
    note: "$47.97 in impulse purchases triggered by fake scarcity — plus a sneaked warranty you never agreed to",
  },
  desc: 'Countdown timers, fake stock warnings, and social proof pressure combine to make you act before you think. Studies show urgency increases conversion by up to 332% — almost none of the scarcity is real.',
  rw: {
    company: 'Booking.com',
    detail: 'Fined by the UK CMA in 2019 for fake "Only 1 room left!" and "8 people looking at this" messages. Internal data showed the stock counts were fabricated. The practice remains widespread.',
    link: 'https://www.deceptive.design/hall-of-shame',
  },
  replay: [
    { trap: true,  note: 'The "Lightning Deal ends in 02:13" banner ticks down then quietly resets. It never expires into anything — the urgency is manufactured.' },
    { trap: true,  note: '"Only 1 left in stock!" on the target item is a static number that never changes regardless of how many people add it to their cart.' },
    { trap: true,  note: 'The viewer count ("X people viewed today") fluctuates randomly. No real data underlies it.' },
    { trap: true,  note: '"Items reserved for X:XX" implies your cart will be released to someone else. Nothing is actually being held.' },
    { trap: true,  note: 'Multiple near-identical backpacks fill the results. Picking any except the exact target counts as a miss — read titles fully, not just the icon.' },
    { trap: true,  note: 'A warranty item sneaks into your cart automatically once you add the backpack. You have to actively notice and remove it.' },
    { trap: false, note: 'The winning move: ignore all timers and counters, read each title in full, and double-check your cart contents before placing the order.' },
  ],

  render(el) {
    injectStyles();

    let cart = [];
    let view = 'home';
    let prevView = 'home';
    let cartTimer = 300;
    let cartInterval = null;
    let sneakInjected = false;
    let dealSecsLeft = 133;
    let extraIntervals = [];

    const trackInterval = id => extraIntervals.push(id);
    const clearExtraIntervals = () => { extraIntervals.forEach(clearInterval); extraIntervals = []; };

    // ── Cart helpers ─────────────────────────────────────────────────────
    const inCart = name => cart.some(c => c.name === name);

    const updateCartBadge = () => {
      const b = document.getElementById('l7-cartbadge');
      if (!b) return;
      b.textContent = cart.length;
      b.style.display = cart.length > 0 ? 'flex' : 'none';
    };

    const updateReserveBar = () => {
      const r = document.getElementById('l7-reservebar');
      if (!r) return;
      r.style.display = cart.length ? 'block' : 'none';
      if (cart.length) r.textContent = '⏳ Items in your cart are reserved for ' + fmt(cartTimer);
    };

    const refreshATCButtons = (name, added) => {
      document.querySelectorAll(`[data-atc="${CSS.escape(name)}"]`).forEach(btn => {
        btn.textContent = added ? '✓ Added' : 'Add to cart';
        btn.classList.toggle('added', added);
      });
    };

    const addToCart = (name, price) => {
      if (inCart(name)) return;
      if (cart.length === 0) cartTimer = 300;
      cart.push({ name, price, sneaky: false });
      updateCartBadge(); updateReserveBar(); refreshATCButtons(name, true);
    };

    const removeFromCart = name => {
      cart = cart.filter(c => c.name !== name);
      updateCartBadge(); updateReserveBar(); refreshATCButtons(name, false);
      if (view === 'cart') renderCart();
    };

    // ── Timer ────────────────────────────────────────────────────────────
    const clearTimer = () => { clearInterval(cartInterval); cartInterval = null; };
    const startTimer = () => {
      clearTimer();
      cartInterval = setInterval(() => {
        dealSecsLeft = dealSecsLeft <= 1 ? 133 : dealSecsLeft - 1;
        const dealEl = document.getElementById('l7-dealtimer');
        if (dealEl) dealEl.textContent = '⚡ Lightning Deal ends in ' + fmt(dealSecsLeft);

        if (cart.length) {
          cartTimer = cartTimer <= 1 ? 300 : cartTimer - 1;
          updateReserveBar();
        }
        if (!sneakInjected && inCart(TARGET_NAME)) {
          sneakInjected = true;
          cart.push({ name: 'Extended warranty (1yr)', price: 9.99, sneaky: true });
          updateCartBadge(); updateReserveBar();
          if (view === 'cart') renderCart();
        }
      }, 1000);
    };

    // ── Shared button/card HTML ─────────────────────────────────────────
    const atcBtn = (name, price) => {
      const already = inCart(name);
      return `<button class="l7-atc${already ? ' added' : ''}" data-atc="${name}" data-price="${price}">${already ? '✓ Added' : 'Add to cart'}</button>`;
    };
    const bindATCButtons = () => {
      document.querySelectorAll('[data-atc]').forEach(btn => {
        btn.onclick = e => {
          e.stopPropagation();
          const name = btn.dataset.atc, price = parseFloat(btn.dataset.price);
          inCart(name) ? removeFromCart(name) : addToCart(name, price);
        };
      });
    };
    const bindPDPLinks = () => {
      document.querySelectorAll('[data-pdp]').forEach(node => {
        node.onclick = e => { if (!e.target.closest('[data-atc]')) openPDP(node.dataset.pdp); };
      });
    };

    // Shared "full-width product row" markup — used by category list, deals list, and search feed
    const productItemHTML = (key, { badges = [], meta = '', isTarget = false } = {}) => {
      const p = PRODUCTS[key];
      const bdgHTML = badges.length
        ? `<div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px">${badges.map(([cls, txt]) => `<span class="l7-pbadge ${cls}">${txt}</span>`).join(' ')}</div>`
        : '';
      return `
        <div class="l7-product" data-pdp="${key}">
          <div class="l7-pimg">${p.img}</div>
          <div class="l7-pbody">
            <div class="l7-ptitle">${p.title}</div>
            <div class="l7-pstars">${starsHTML(p.stars)}</div>
            <div class="l7-pprice">$${p.price.toFixed(2)}${p.orig ? `<span class="orig">$${p.orig.toFixed(2)}</span>` : ''}</div>
            ${bdgHTML}
            ${meta ? `<div class="l7-pmeta"${isTarget ? ' id="l7-viewers"' : ''}>${meta}</div>` : ''}
            ${atcBtn(p.title, p.price)}
          </div>
        </div>`;
    };

    // Shared list-view renderer — used by category and deals screens (product list + header + back button)
    const renderProductListPage = (viewName, headerHTML, items, onBack) => {
      clearExtraIntervals();
      view = viewName;
      document.getElementById('l7-content').innerHTML = `
        <div class="l7-feed-head">
          <button class="l7-backbtn" id="l7-list-back">← Back</button><br>
          ${headerHTML}
        </div>
        <div class="l7-feed">${items.map(key => productItemHTML(key)).join('')}</div>`;
      document.getElementById('l7-list-back').onclick = onBack;
      bindPDPLinks();
      bindATCButtons();
    };

    const cardHTML = key => {
      const p = PRODUCTS[key];
      return `<div class="l7-card" data-pdp="${key}">
        <div class="l7-card-img">${p.img}${p.orig ? `<span class="l7-card-badge">-${Math.round((1 - p.price / p.orig) * 100)}%</span>` : ''}</div>
        <div class="l7-card-title">${p.title}</div>
        ${p.price !== null ? `<div class="l7-card-price">$${p.price.toFixed(2)}</div>` : ''}
        ${p.orig ? `<div class="l7-card-orig">$${p.orig.toFixed(2)}</div>` : ''}
        ${p.price !== null ? atcBtn(p.title, p.price) : ''}
      </div>`;
    };

    // ── Product detail page ─────────────────────────────────────────────
    const openPDP = key => {
      clearExtraIntervals();
      prevView = view;
      view = 'pdp';
      const p = PRODUCTS[key];
      document.getElementById('l7-content').innerHTML = `
        <div class="l7-pdp">
          <button class="l7-backbtn" id="l7-pdp-back">← Back</button>
          <div class="l7-pdp-top">
            <div class="l7-pdp-img">${p.img}</div>
            <div class="l7-pdp-info">
              <div class="l7-pdp-title">${p.title}</div>
              ${p.stars ? `<div class="l7-pdp-stars">${starsHTML(p.stars)}</div>` : ''}
              ${p.price !== null
                ? `<div class="l7-pdp-price">$${p.price.toFixed(2)}${p.orig ? `<span class="l7-pdp-orig">$${p.orig.toFixed(2)}</span>` : ''}</div>`
                : '<div style="font-size:12px;color:#555;margin-top:4px">Browse category</div>'}
            </div>
          </div>
          <div class="l7-pdp-desc">${p.desc}</div>
          <div class="l7-pdp-meta">${p.meta.map(m => `<span>✓ ${m}</span>`).join('')}</div>
          ${p.price !== null ? atcBtn(p.title, p.price) : ''}
        </div>`;
      document.getElementById('l7-pdp-back').onclick = () => prevView === 'feed' ? renderFeed() : renderHome();
      bindATCButtons();
    };

    // ── Shell ────────────────────────────────────────────────────────────
    const renderShell = () => {
      el.innerHTML = `
        <div class="l7-wrap">
          <div class="l7-reservebar" id="l7-reservebar" style="display:none"></div>
          <div class="l7-nav">
            <div class="l7-logo" id="l7-logo">QuickCart</div>
            <div class="l7-searchrow">
              <div class="l7-searchbox">
                <div class="l7-catsel">All</div>
                <input id="l7-searchinput" placeholder="Search QuickCart" autocomplete="off">
                <button class="l7-sbtn" id="l7-sbtn">🔍</button>
              </div>
            </div>
            <button class="l7-cartbtn" id="l7-cartbtn">🛒 Cart<span class="l7-cartbadge" id="l7-cartbadge" style="display:none">0</span></button>
          </div>
          <div class="l7-delivery">📍 Deliver to <b>New York 10001</b></div>
          <div class="l7-subnav">
            <span class="l7-snitem">All</span><span class="l7-snitem">Today's Deals</span>
            <span class="l7-snitem">Electronics</span><span class="l7-snitem">Outdoors</span>
            <span class="l7-snitem">Travel</span>
          </div>
          <div class="l7-content" id="l7-content"></div>
        </div>`;

      const doSearch = () => {
        const val = document.getElementById('l7-searchinput').value.trim().toLowerCase();
        if (val === 'backpack') { renderFeed(); return; }
        if (!val) return;
        clearExtraIntervals();
        document.getElementById('l7-content').innerHTML = `
          <div style="padding:24px;text-align:center;color:#555;font-size:13px;display:flex;flex-direction:column;gap:8px;align-items:center">
            <div style="font-size:24px">🔍</div>
            <div>No results for "<strong>${val}</strong>"</div>
            <div style="font-size:11px;color:#aaa">Try searching for "backpack"</div>
          </div>`;
      };
      document.getElementById('l7-sbtn').onclick = doSearch;
      document.getElementById('l7-searchinput').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
      document.getElementById('l7-cartbtn').onclick = () => { clearExtraIntervals(); prevView = view; renderCart(); };
      document.getElementById('l7-logo').onclick = () => {
        const inp = document.getElementById('l7-searchinput');
        if (inp) inp.value = '';
        renderHome();
      };

      updateCartBadge();
      startTimer();
      renderHome();
    };

    const chipHTML = key => {
      const p = PRODUCTS[key];
      return `<div class="l7-chip" data-cat="${key}"><span>${p.img}</span>${p.title}</div>`;
    };
    const bindCatLinks = () => {
      document.querySelectorAll('[data-cat]').forEach(node => {
        node.onclick = () => renderCategory(node.dataset.cat);
      });
    };

    // ── Category screen (filtered product list) ─────────────────────────
    const renderCategory = key => {
      const cat = PRODUCTS[key];
      const items = CATEGORY_PRODUCTS[key] || [];
      renderProductListPage('category',
        `Showing <strong>${items.length}</strong> product${items.length !== 1 ? 's' : ''} in <strong>${cat.title}</strong>`,
        items, renderHome);
    };

    // ── Home screen ──────────────────────────────────────────────────────
    const renderHome = () => {
      clearExtraIntervals();
      view = 'home';
      document.getElementById('l7-content').innerHTML = `
        <div class="l7-section">
          <div class="l7-shead">Today's Deals<span class="l7-seemore active" id="l7-deals-more">See more ›</span></div>
          <div class="l7-row">${HOME_DEALS.map(cardHTML).join('')}</div>
        </div>
        <div class="l7-section">
          <div class="l7-shead">Shop by category<span class="l7-seemore">See more ›</span></div>
          <div class="l7-row">${HOME_CATS.map(chipHTML).join('')}</div>
        </div>`;
      bindPDPLinks();
      bindATCButtons();
      bindCatLinks();
      document.getElementById('l7-deals-more').onclick = renderDeals;
    };

    // ── Full deals list (all discounted products) ───────────────────────
    const renderDeals = () => {
      const items = Object.keys(PRODUCTS).filter(k => PRODUCTS[k].price !== null && PRODUCTS[k].orig !== null);
      renderProductListPage('deals', `Showing <strong>${items.length}</strong> deals today`, items, renderHome);
    };

    // ── Feed (search results) ───────────────────────────────────────────
    const renderFeed = () => {
      clearExtraIntervals();
      view = 'feed';
      const inp = document.getElementById('l7-searchinput');
      if (inp) inp.value = 'backpack';

      let html = `<div class="l7-feed-head">Showing results for <strong>"backpack"</strong></div><div class="l7-feed">`;
      FEED_ITEMS.forEach(item => {
        if (item.t === 'banner') {
          html += `<div class="l7-banner ${item.cls}"${item.id ? ` id="${item.id}"` : ''}>${item.txt}</div>`;
        } else if (item.t === 'notif') {
          html += `<div class="l7-notif">${item.txt}</div>`;
        } else if (item.t === 'product') {
          html += productItemHTML(item.key, { badges: item.badges, meta: item.meta, isTarget: item.isTarget });
        }
      });
      html += `</div>`;
      document.getElementById('l7-content').innerHTML = html;

      bindPDPLinks();
      bindATCButtons();

      trackInterval(setInterval(() => {
        const v = document.getElementById('l7-viewers');
        if (v) v.textContent = VIEWER_PHRASES(randViewers());
      }, 3000));

      let ni = 0;
      trackInterval(setInterval(() => {
        ni = (ni + 1) % NOTIFICATIONS.length;
        const notifs = document.querySelectorAll('.l7-notif');
        if (notifs.length) notifs[ni % notifs.length].textContent = NOTIFICATIONS[ni];
      }, 4000));
    };

    // ── Cart view ────────────────────────────────────────────────────────
    const renderCart = () => {
      clearExtraIntervals();
      view = 'cart';
      const total = cart.reduce((a, c) => a + c.price, 0);
      document.getElementById('l7-content').innerHTML = `
        <div class="l7-cart">
          <button class="l7-backbtn" id="l7-back">← Continue shopping</button>
          <div class="l7-cart-head">Shopping Cart (${cart.length} item${cart.length !== 1 ? 's' : ''})</div>
          <div>
            ${cart.length === 0 ? '<div class="l7-empty">Your cart is empty.</div>' : cart.map(c => `
              <div class="l7-crow">
                <span class="l7-cname">${c.name}${c.sneaky ? ' <span style="color:#A32D2D;font-size:10px;display:block">(added for you)</span>' : ''}</span>
                <span style="font-weight:600;flex-shrink:0;margin-right:4px">$${c.price.toFixed(2)}</span>
                <button class="l7-cremove" data-name="${c.name}">Remove</button>
              </div>`).join('')}
          </div>
          ${cart.length > 0 ? `
            <div class="l7-ctotal"><span>Order total</span><span>$${total.toFixed(2)}</span></div>
            <button class="l7-obtn" id="l7-place">Place your order →</button>
            <div style="font-size:10px;color:#aaa;text-align:center">By placing your order you agree to our Conditions of Use</div>` : ''}
        </div>`;

      document.getElementById('l7-back').onclick = () => {
        const inp = document.getElementById('l7-searchinput');
        inp?.value.toLowerCase() === 'backpack' ? renderFeed() : renderHome();
      };
      document.querySelectorAll('.l7-cremove').forEach(b => { b.onclick = () => removeFromCart(b.dataset.name); });
      const placeBtn = document.getElementById('l7-place');
      if (placeBtn) placeBtn.onclick = placeOrder;

      updateReserveBar();
    };

    // ── Order validation ────────────────────────────────────────────────
    const placeOrder = () => {
      const placeBtn = document.getElementById('l7-place');
      if (placeBtn) placeBtn.disabled = true;

      const hasBackpack = cart.some(c => c.name === TARGET_NAME);
      const onlyBackpack = cart.length === 1 && hasBackpack;

      if (!hasBackpack) {
        G.fail("Your cart doesn't have the backpack in it!");
        setTimeout(renderCart, 1700);
        return;
      }
    
      if (!onlyBackpack) {
        G.fail('Extra items snuck into your order — check your cart before placing it!');
        setTimeout(renderCart, 1700);
        return;
      }

      clearTimer();
      clearExtraIntervals();
      const gb = document.getElementById('l7-goalbar');
      if (gb) { gb.className = 'l7-goalbar done'; gb.textContent = '✓ Done — Adventure Backpack purchased for $' + TARGET_PRICE.toFixed(2); }
      const reserveBar = document.getElementById('l7-reservebar');
      if (reserveBar) reserveBar.style.display = 'none';

      document.getElementById('l7-content').innerHTML = `
        <div style="padding:32px 12px;text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center;background:#fff">
          <div style="font-size:32px">✓</div>
          <div style="font-size:15px;font-weight:600;color:#111">Order placed!</div>
          <div style="font-size:12px;color:#555">${TARGET_NAME}</div>
          <div style="font-size:14px;font-weight:600;color:#111">$${TARGET_PRICE.toFixed(2)}</div>
          <div style="font-size:11px;color:#aaa">Estimated delivery: 2–3 business days</div>
        </div>`;
      G.succeed();
    };

    renderShell();
  },
};

export default level7;
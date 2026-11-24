// Culbute : une bouteille saute de meuble en meuble en faisant des tours sur elle-même, et doit se poser debout.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Culbute</span><span class="hint">Maintiens le doigt sur le jeu pour charger, lâche pour sauter · en mode expert, maintiens en l'air pour tourner plus vite</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="cbCanvas" width="160" height="150" role="img" aria-label="Culbute"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="cbStats"></div></div>
      <div class="row"><button class="btn main" id="cbNew">NOUVELLE PARTIE</button><button class="btn" id="cbPause">PAUSE</button><button class="btn" id="cbFs">PLEIN ÉCRAN</button></div>
      <div class="sysCard"><b>RÉGLAGES</b><div class="row"><button class="btn" id="cbMode"></button></div><div class="hint" id="cbModeHint"></div>
        <div class="hint">Objet :</div><div class="cbOpts" id="cbObjs"></div><div class="hint">Pièce de départ :</div><div class="cbOpts" id="cbRooms"></div></div>
      <div class="hint">Le fantôme de la bouteille montre où elle va retomber et dans quel sens : vert, elle se posera debout ; orange, maintiens pour la faire tourner plus vite ; rouge, elle tombe à côté. Trois bouteilles par partie.</div>
      <div class="hint">Plus tu maintiens, plus la bouteille saute loin et haut : les points blancs montrent tout le saut, jusqu'au meuble où elle retombe. En l'air, elle tourne toute seule ; maintiens pour qu'elle tourne deux fois plus vite. Elle doit retomber debout sur le dessus d'un meuble, à 46° près ; presque droite, c'est PARFAIT et ça compte double. Sauter par-dessus un meuble rapporte plus. Si elle se renverse ou tombe par terre, tu perds une bouteille et tu repars du même meuble ; si elle retombe sur le même meuble, tu peux réessayer. Tous les 15 meubles, on change de pièce : salon, cuisine, chambre, jardin. Deux tours complets en l'air : DOUBLE (points ×2) ; trois : TRIPLE (×3).</div>
    </div></div>
</div>`;
const CSS = `.cbOpts{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin:4px 0 8px}.cbOpts .btn{padding:6px 4px;font-size:12px}
.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:max(300px,min(calc(100vh - 210px),1050px));width:auto;max-width:calc(100vw - 40px);aspect-ratio:160/150;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{height:min(100vh,calc(100vw * 150 / 160));max-width:none}
/*PHONE*/
.pxk.pxk .gMain{gap:12px}
.pxk.pxk .gameBox{padding:4px;flex:1 1 100%;min-width:0}
.pxk.pxk .gameBox canvas{height:auto;width:100%;max-width:calc((100vh - 200px) * 160 / 150)}
.pxk.pxk .gSide{max-width:none;min-width:0;width:100%}
.pxk.pxk .gSide>.row{display:grid;grid-template-columns:1fr 1fr;gap:8px;order:-1}
.pxk.pxk .gSide>.row .btn{min-height:46px;min-width:0;padding:0 6px;justify-content:center}
.pxk.pxk .gSide>.row .btn:first-child{grid-column:1/-1}
.pxk.pxk .gameBox:fullscreen canvas{height:min(100vh,calc(100vw * 150 / 160));width:auto;max-width:none}
.pxk.pxk .cbOpts .btn{min-width:0;min-height:40px;justify-content:center}
.pxk.pxk .cbOpts .btn .pxV{white-space:normal;text-align:center}
.pxk.pxk .sysCard>.row .btn{min-height:44px}
.pxk.pxk .gSide>.row{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)}
/*/PHONE*/`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "CULBUTE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#7ac8f0", "accL": "#c8e8f8", "accS": "#3a8ad8", "accD": "#0a2a4a", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#ffd84a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#1a3a5a", "spark2": "#7ac8f0", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkk.....", "....bbb.....", "....kkk.....", "...kwwwk....", "..kwwwwwk...", "..kwbbbwk...", "..krrrrrk...", "..kwbbbwk...", "..kwbbbwk...", "...kkkkk....", "oooooooooooo"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Culbute : une bouteille saute de meuble en meuble dans un salon. Maintenir charge le saut, lâcher la lance ;
   maintenir pendant le vol la fait tourner plus vite. Elle doit se poser debout (à 40° près) sur le dessus d'un meuble ---------- */
const CB = {W: 160, H: 150, HUD: 12, FLOOR: 140, G: .16, SPIN: .11, TUCK: .23, OK: .8, PERFECT: .25, CHARGE: 50, LIVES: 3};  // 46° de marge pour tenir debout, 14° pour PARFAIT
const cbs = gstore('culbute', {games: 0, flips: 0, perfect: 0}); cbs.easy ??= true; cbs.obj ??= 0; cbs.start ??= 0; cbs.roomMax ??= 0; cbs.doubles ??= 0;
// les objets : rotation libre et rotation rapide (par image), élan, marge pour tenir (radians), demi-hauteur, sym 2 = tient aussi à l'envers ; débloqués au nombre de culbutes
const CB_OBJ = [
  {name: 'Bouteille', spin: .11, tuck: .23, launch: 1, ok: .8, hh: 8, sym: 1, need: 0},
  {name: 'Canette', spin: .14, tuck: .27, launch: 1.06, ok: .9, hh: 6, sym: 2, need: 15, rows: ['.kkkkk.', 'kssssSk', 'krrrrrk', 'krwwrrk', 'krrrrrk', 'krrrrrk', 'krwwrrk', 'krrrrrk', 'krrrrrk', 'kssssSk', '.kkkkk.'], pal: {k: '#1a2a3a', s: '#a8a8b8', S: '#ffffff', r: '#d83a3a', w: '#ffffff'}},
  {name: 'Livre', spin: .08, tuck: .18, launch: 1, ok: 1, hh: 3, sym: 2, need: 40, rows: ['kkkkkkkkkkkk', 'kGGGGGGGGGyk', 'kwwwwwwwwwwk', 'kGGGGGGGGGyk', 'kkkkkkkkkkkk'], pal: {k: '#1a2a3a', G: '#3a8a4a', y: '#ffd84a', w: '#f0e8d8'}},
  {name: 'Téléphone', spin: .13, tuck: .27, launch: 1, ok: .5, hh: 6, sym: 1, need: 80, rows: ['kkkkkk', 'kbbbbk', 'kblbbk', 'kbbbbk', 'kbbbbk', 'kbbbbk', 'kbbbbk', 'kbbbbk', 'kbbbbk', 'kbbbbk', 'kkwwkk', '.kkkk.'], pal: {k: '#1a1a22', b: '#3a5a9a', l: '#a8c8ff', w: '#8a8a9a'}},
];
const cbObj = () => CB_OBJ[cb?.obj || 0];
const cbTilt = a => cbObj().sym === 2 ? ((a % Math.PI) + Math.PI * 1.5) % Math.PI - Math.PI / 2 : cbAngle(a);  // l'écart à « debout » (à l'envers compte pour la canette et le livre)
const cbOk = () => cbObj().ok + (cb?.easy ? .3 : 0);
let cb = null, cbac = null, cbMute = false;
// la bouteille (7 x 16) : bouchon, goulot, eau, étiquette ; 32 images tournées d'avance, au pixel près
const CB_BOTTLE = ['..kkk..', '..bbb..', '..kkk..', '..kwk..', '.kwwwk.', 'kwwwwwk', 'kwlllwk', 'kwlllwk', 'krrrrrk', 'kryyrrk', 'krrrrrk', 'kwlllwk', 'kwlllwk', 'kwlllwk', 'kwlllwk', '.kkkkk.'];
const CB_PAL = {k: '#1a2a3a', b: '#3a7ad8', w: '#c8e8f8', l: '#7ac8f0', r: '#d83a3a', y: '#ffd84a'};
const cbRotate = (rows, pal) => Array.from({length: 32}, (_, i) => {
  const a = i / 32 * Math.PI * 2, c = el('canvas'); c.width = c.height = 20; const g = c.getContext('2d'), ca = Math.cos(a), sa = Math.sin(a), mx = (rows[0].length - 1) / 2, my = (rows.length - 1) / 2;
  for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) {  // pour chaque pixel de l'image, le pixel de l'objet droit qui tombe dessus
    const dx = x - 9.5, dy = y - 9.5, sx = Math.round(dx * ca + dy * sa + mx), sy = Math.round(-dx * sa + dy * ca + my), row = rows[sy], col = row && pal[row[sx]];
    if (col) px(g, col, x, y);
  }
  return c; });
const CB_ROTS = [cbRotate(CB_BOTTLE, CB_PAL)];
const cbRot = () => CB_ROTS[cb?.obj || 0] ||= cbRotate(cbObj().rows, cbObj().pal);
// les pièces qui se suivent, 15 meubles chacune : salon, cuisine, chambre, jardin ; leurs meubles selon la hauteur du dessus (haut, moyen, bas)
const CB_ROOMS = [
  {name: 'LE SALON', tall: ['livres', 'commode'], mid: ['table', 'commode', 'caisse'], low: ['tabouret', 'caisse']},
  {name: 'LA CUISINE', tall: ['frigo'], mid: ['plan', 'frigo', 'plan'], low: ['chaise', 'tabouret']},
  {name: 'LA CHAMBRE', tall: ['armoire'], mid: ['lit', 'commode', 'lit'], low: ['chevet', 'coffre']},
  {name: 'LE JARDIN', tall: ['muret'], mid: ['banc', 'tonneau'], low: ['pot', 'souche']}];
const cbRoom = n => Math.floor(n / 15) % CB_ROOMS.length;
const CB_KINDS = ['table', 'tabouret', 'livres', 'commode', 'caisse'];
function cbFurniture(g, f, ox) {
  const x = Math.round(f.x - ox), y = Math.round(f.y), w = f.w, h = CB.FLOOR - y;
  if (x > CB.W + 4 || x + w < -4) return;
  if (f.kind === 'table' || f.kind === 'tabouret') {
    px(g, '#1a1018', x - 1, y - 1, w + 2, 6); px(g, f.kind === 'table' ? '#a86a3a' : '#c84a3a', x, y, w, 4); px(g, f.kind === 'table' ? '#d8945a' : '#e87a5a', x, y, w, 1);
    for (const lx of f.kind === 'table' ? [x + 2, x + w - 5] : [x + 3, x + w - 6]) { px(g, '#1a1018', lx - 1, y + 4, 5, h - 4); px(g, '#7a4a2a', lx, y + 4, 3, h - 4); }
    if (f.kind === 'tabouret') { px(g, '#1a1018', x + 3, y + Math.round(h * .6), w - 6, 2); }
  } else if (f.kind === 'livres') {
    let yy = y; const cols = [['#3a6ac8', '#5a8ae8'], ['#4aa84a', '#7ac87a'], ['#c83a5a', '#e86a8a'], ['#c8a03a', '#e8c86a']];
    for (let i = 0; yy < CB.FLOOR; i++) { const bh = 5 + (i % 2), dx = (i * 3) % 5 - 2, c = cols[i % 4]; px(g, '#1a1018', x + dx - 1, yy - 1, w + 2, bh + 1); px(g, c[0], x + dx, yy, w, bh - 1); px(g, c[1], x + dx, yy, w, 1); px(g, '#f0e8d8', x + dx + w - 3, yy + 1, 2, bh - 2); yy += bh; }
  } else if (f.kind === 'chaise' || f.kind === 'banc') {  // l'assise, les pieds ; le dossier de la chaise dépasse à gauche
    const top = f.kind === 'chaise' ? ['#a86a3a', '#d8945a', '#7a4a2a'] : ['#4a8a4a', '#7ac87a', '#2a2a32'];
    if (f.kind === 'chaise') { px(g, '#1a1018', x - 1, y - 14, 5, 15); px(g, top[0], x, y - 13, 3, 13); px(g, top[1], x, y - 13, 3, 1); }
    px(g, '#1a1018', x - 1, y - 1, w + 2, 5); px(g, top[0], x, y, w, 3); px(g, top[1], x, y, w, 1);
    if (f.kind === 'banc') for (let xx = x + 4; xx < x + w - 2; xx += 6) px(g, '#2a6a2a', xx, y, 1, 3);
    for (const lx of [x + 2, x + w - 5]) { px(g, '#1a1018', lx - 1, y + 3, 5, h - 3); px(g, top[2], lx, y + 3, 3, h - 3); }
  } else if (f.kind === 'pot' || f.kind === 'tonneau' || f.kind === 'souche') {  // des formes du jardin
    if (f.kind === 'pot') { for (let yy = y; yy < CB.FLOOR; yy++) { const k = Math.round((yy - y) / Math.max(1, h) * 4); px(g, '#1a1018', x - 1 + k, yy, w + 2 - k * 2, 1); px(g, yy - y < 4 ? '#e8885a' : '#c8643a', x + k, yy, w - k * 2, 1); }
      px(g, '#4a2a18', x + 1, y, w - 2, 2); px(g, '#ff6a8a', x - 1, y - 3, 3, 3); px(g, '#ffd84a', x + w - 2, y - 3, 3, 3); px(g, '#4aa84a', x + 1, y - 1, 1, 1); }
    else if (f.kind === 'tonneau') { px(g, '#1a1018', x - 1, y - 1, w + 2, h + 1); px(g, '#9a6a3a', x, y, w, h); px(g, '#7a4a2a', x, y, 2, h); px(g, '#7a4a2a', x + w - 2, y, 2, h); px(g, '#c8945a', x + 2, y, w - 4, 2);
      for (const yy of [y + 4, y + Math.round(h / 2), CB.FLOOR - 5]) px(g, '#3a3a42', x, yy, w, 2); }
    else { px(g, '#1a1018', x - 1, y - 1, w + 2, h + 1); px(g, '#6a4a2a', x, y, w, h); for (let xx = x + 3; xx < x + w; xx += 5) px(g, '#4a3018', xx, y + 3, 1, h - 3);
      px(g, '#d8b878', x, y, w, 3); px(g, '#b89858', x + 3, y + 1, w - 6, 1); px(g, '#4a8a3a', x - 2, CB.FLOOR - 3, 4, 3); }
  } else if (f.kind === 'muret') {  // un pilier de briques et sa pierre de couronnement
    px(g, '#1a1018', x - 1, y - 1, w + 2, h + 1); px(g, '#8a8a90', x, y, w, 3); px(g, '#b8b8c0', x, y, w, 1);
    for (let yy = y + 3, r = 0; yy < CB.FLOOR; yy += 5, r++) { px(g, '#c8b8a8', x, yy, w, 5); for (let xx = x + (r % 2) * 4; xx < x + w; xx += 8) px(g, '#b8503a', xx, yy + 1, Math.min(7, x + w - xx), 3); }
  } else {  // les blocs pleins : commode, caisse, plan de travail, frigo, armoire, chevet, coffre, lit
    const K = {commode: ['#8a5a3a', '#b87a4a', '#5a3a22'], caisse: ['#b8884a', '#d8a868', '#7a5a2a'], plan: ['#e8e0d0', '#ffffff', '#b8b0a0'], frigo: ['#e8eef4', '#ffffff', '#a8b4c0'],
      armoire: ['#7a4a2a', '#a86a3a', '#4a2a18'], chevet: ['#c89a6a', '#e8c08a', '#8a6a4a'], coffre: ['#c83a3a', '#e86a5a', '#8a1a1a'], lit: ['#8a5a3a', '#b87a4a', '#5a3a22']}, wood = K[f.kind] || K.commode;
    px(g, '#1a1018', x - 1, y - 1, w + 2, h + 1); px(g, wood[0], x, y, w, h); px(g, wood[1], x, y, w, 1);
    if (f.kind === 'plan') { px(g, '#8a8a98', x - 1, y, w + 2, 3); px(g, '#c8c8d8', x - 1, y, w + 2, 1); for (let xx = x + 2; xx + 10 <= x + w; xx += 12) { px(g, wood[2], xx, y + 5, 10, h - 7); px(g, wood[0], xx + 1, y + 6, 8, h - 9); px(g, '#5a5a68', xx + 7, y + 8, 1, 4); } }
    else if (f.kind === 'frigo') { px(g, wood[2], x, y + Math.round(h * .35), w, 1); px(g, '#8a94a0', x + w - 4, y + 3, 1, Math.round(h * .3) - 4); px(g, '#8a94a0', x + w - 4, y + Math.round(h * .35) + 3, 1, 8); px(g, '#ff6a6a', x + 3, y + 4, 3, 3); }
    else if (f.kind === 'armoire') { px(g, wood[2], x + Math.floor(w / 2), y + 2, 1, h - 4); px(g, '#ffd84a', x + Math.floor(w / 2) - 3, y + Math.round(h / 2), 2, 2); px(g, '#ffd84a', x + Math.floor(w / 2) + 2, y + Math.round(h / 2), 2, 2); }
    else if (f.kind === 'coffre') { px(g, '#ffd84a', x, y + 4, w, 2); px(g, '#ffd84a', x + Math.floor(w / 2) - 1, y + 4, 3, 5); px(g, wood[2], x, y + 3, w, 1); }
    else if (f.kind === 'lit') { px(g, '#f0f0f8', x, y, w, 3); px(g, '#5a8ad8', x + 9, y, w - 9, 4); px(g, '#8ab0f0', x + 9, y, w - 9, 1); px(g, '#ffffff', x + 1, y - 2, 7, 3); px(g, '#1a1018', x + 1, y - 3, 7, 1);
      px(g, wood[2], x, y + 5, w, 1); for (const lx of [x, x + w - 3]) px(g, wood[2], lx, y + 5, 3, h - 5); }
    else for (let yy = y + 6; yy < CB.FLOOR - 2; yy += 9) { px(g, wood[2], x + 2, yy, w - 4, 1); if (f.kind === 'commode' || f.kind === 'chevet') px(g, '#ffd84a', x + Math.floor(w / 2) - 1, yy + 4, 2, 1); }
    if (f.kind === 'caisse') { px(g, wood[2], x + 1, y + 1, 1, h - 2); px(g, wood[2], x + w - 2, y + 1, 1, h - 2); }
  }
  if (f.n && f.n % 10 === 0) pxFont(g, String(f.n), x + w / 2, y - 4, '#ffd84a', 8, 'center');
}
// le salon : papier peint à rayures, plinthe, parquet ; une fenêtre et un cadre qui défilent plus lentement
const CB_WALL0 = (() => { const c = el('canvas'); c.width = 64; c.height = CB.FLOOR; const g = c.getContext('2d');
  px(g, '#4a3a5a', 0, 0, 64, CB.FLOOR); for (let x = 0; x < 64; x += 8) { px(g, '#54446a', x, 0, 3, CB.FLOOR); for (let y = 4; y < CB.FLOOR; y += 12) px(g, '#6a5a82', x + 1, y, 1, 1); }
  px(g, '#2a1e30', 0, CB.FLOOR - 7, 64, 1); px(g, '#e8e0d8', 0, CB.FLOOR - 6, 64, 6); px(g, '#b8b0a8', 0, CB.FLOOR - 1, 64, 1); return c; })();
const CB_DECOR = (() => { const c = el('canvas'); c.width = 240; c.height = 70; const g = c.getContext('2d');
  px(g, '#1a1018', 20, 10, 44, 50); px(g, '#2a3a6a', 22, 12, 40, 46); px(g, '#e8e0d8', 41, 12, 2, 46); px(g, '#e8e0d8', 22, 33, 40, 2); px(g, '#f0e8d8', 28, 18, 2, 2); px(g, '#f0e8d8', 52, 42, 1, 1); px(g, '#ffd84a', 50, 18, 4, 4);
  px(g, '#1a1018', 140, 20, 34, 26); px(g, '#c8a03a', 141, 21, 32, 24); px(g, '#4a8a5a', 144, 24, 26, 18); px(g, '#7ac87a', 150, 30, 8, 6); px(g, '#3a6ac8', 144, 36, 26, 6);
  return c; })();
const cbTile = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); fn(g); return c; };
const CB_WALLS = [CB_WALL0,
  cbTile(64, CB.FLOOR, g => {  // la cuisine : carrelage blanc, une frise bleue
    px(g, '#b8b8b0', 0, 0, 64, CB.FLOOR); for (let y = 0; y < CB.FLOOR; y += 8) for (let x = 0; x < 64; x += 8) { px(g, '#e8e8e0', x + 1, y + 1, 7, 7); px(g, '#f8f8f0', x + 1, y + 1, 7, 1); }
    for (let x = 0; x < 64; x += 8) { px(g, '#3a6ac8', x + 1, 57, 7, 7); px(g, '#8ab0f0', x + 3, 59, 3, 3); }
    px(g, '#2a1e30', 0, CB.FLOOR - 7, 64, 1); px(g, '#d8d0c8', 0, CB.FLOOR - 6, 64, 6); }),
  cbTile(64, CB.FLOOR, g => {  // la chambre : papier peint rose à petites étoiles
    px(g, '#a86a8a', 0, 0, 64, CB.FLOOR); for (let y = 6; y < CB.FLOOR; y += 16) for (let x = (y / 16 % 2) * 8 + 4; x < 64; x += 16) { px(g, '#d8a0c0', x, y - 1, 1, 3); px(g, '#d8a0c0', x - 1, y, 3, 1); }
    px(g, '#2a1e30', 0, CB.FLOOR - 7, 64, 1); px(g, '#f0e0e8', 0, CB.FLOOR - 6, 64, 6); px(g, '#c8b0b8', 0, CB.FLOOR - 1, 64, 1); }),
  cbTile(64, CB.FLOOR, g => {  // le jardin : le ciel, la haie, la palissade
    const sky = ['#5aa8e8', '#6ab4ec', '#7ac0f0', '#8acaf2', '#9ad4f4', '#aadcf6']; for (let y = 0; y < CB.FLOOR; y++) px(g, sky[Math.min(5, Math.floor(y / 18))], 0, y, 64, 1);
    for (let x = 0; x < 64; x += 2) { const t = 92 + Math.round(Math.sin(x / 5) * 3 + Math.sin(x / 2.3)); px(g, '#2a6a3a', x, t, 2, CB.FLOOR - t); px(g, '#4a9a4a', x, t, 2, 1); }
    for (let x = 2; x < 64; x += 8) { px(g, '#1a1018', x - 1, 108, 7, 32); px(g, '#e8d8b8', x, 110, 5, 30); px(g, '#e8d8b8', x + 1, 107, 3, 3); px(g, '#c8b898', x + 4, 110, 1, 30); }
    px(g, '#1a1018', 0, 116, 64, 4); px(g, '#d8c8a8', 0, 117, 64, 2); })];
const CB_DECORS = [CB_DECOR,
  cbTile(240, 70, g => {  // la cuisine : une horloge, une étagère de pots
    px(g, '#1a1018', 30, 8, 22, 22); px(g, '#ffffff', 31, 9, 20, 20); px(g, '#1a1018', 40, 12, 2, 8); px(g, '#1a1018', 41, 18, 6, 2); px(g, '#e83a4a', 31, 9, 20, 1);
    px(g, '#1a1018', 120, 40, 70, 4); px(g, '#8a5a3a', 120, 40, 70, 3); [[124, '#e8a03a'], [140, '#5ab84a'], [156, '#e83a4a'], [172, '#5a8ad8']].forEach(([x, c]) => { px(g, '#1a1018', x - 1, 27, 12, 13); px(g, c, x, 28, 10, 12); px(g, '#ffffff', x + 2, 31, 6, 4); }); }),
  cbTile(240, 70, g => {  // la chambre : une fenêtre de nuit à rideaux, un poster
    px(g, '#1a1018', 20, 8, 46, 48); px(g, '#1a2a5a', 22, 10, 42, 44); px(g, '#fff4c0', 50, 16, 6, 6); px(g, '#1a2a5a', 52, 15, 5, 5); for (const [sx, sy] of [[28, 20], [36, 40], [56, 44], [30, 34]]) px(g, '#ffffff', sx, sy, 1, 1);
    px(g, '#e85a8a', 16, 6, 8, 52); px(g, '#e85a8a', 62, 6, 8, 52); px(g, '#ff8ab0', 17, 6, 2, 52); px(g, '#ff8ab0', 63, 6, 2, 52);
    px(g, '#1a1018', 140, 14, 30, 38); px(g, '#ffd84a', 141, 15, 28, 36); px(g, '#e83a4a', 146, 22, 18, 18); px(g, '#ffffff', 151, 27, 8, 8); }),
  cbTile(240, 70, g => {  // le jardin : le soleil, des nuages
    for (let y = -8; y <= 8; y++) for (let x = -8; x <= 8; x++) if (x * x + y * y <= 64) px(g, x * x + y * y > 49 ? '#ffc84a' : '#fff07a', 40 + x, 14 + y);
    for (const [cx, cy] of [[110, 12], [190, 24]]) { px(g, '#ffffff', cx, cy, 26, 6); px(g, '#ffffff', cx + 5, cy - 4, 12, 4); px(g, '#d8e8f8', cx, cy + 5, 26, 1); } })];
function cbBeep(f, d, type = 'square', slide = 0, vol = .04) { if (cbMute) return; try { cbac ??= new AudioContext(); const o = cbac.createOscillator(), g = cbac.createGain(), t = cbac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(cbac.destination); o.start(t); o.stop(t + d); } catch {} }
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function cbNew() {
  const g = cb?.g, start = Math.min(cbs.start, cbs.roomMax), lm = cbs.easy ? 5 : CB.LIVES;
  cb = renew(cb, {g, easy: !!cbs.easy, obj: CB_OBJ[cbs.obj] && cbs.flips >= CB_OBJ[cbs.obj].need ? cbs.obj : 0, base: start * 15, livesMax: lm, furn: [{x: 10, y: 100, w: 30, kind: CB_ROOMS[start].mid[0], n: 0}], mode: 'ready', tick: 0, seen: 0, at: 0, score: 0, flips: 0, perfect: 0, streak: 0, charge: 0, hold: false, cam: 0, dead: 0, record: false, rnd: seeded(Date.now() % 1e9), pop: null, drops: [], lives: lm, respawn: 0, slow: 0, sk: 0, near: false, stars: [], flash: 0, room: start, doubles: 0});
  cbGen(8); cbPlace(); cbInfo(); cbOpts();
}
function cbGen(n) {
  while (cb.furn.length < n) {
    const p = cb.furn[cb.furn.length - 1], k = cb.furn.length, r = cb.rnd, d = Math.min(1, (k + cb.base) / 40) * (cb.easy ? .55 : 1);
    const w = Math.round(32 - d * 6 + r() * 10), gap = Math.round(14 + r() * (18 + d * 24)), y = Math.round(Math.max(60, Math.min(124, p.y + (r() - .5) * (34 + d * 26))));  // un peu plus proches et moins de dénivelé qu'avant
    const R = CB_ROOMS[cbRoom(k + cb.base)], list = y < 80 ? R.tall : y > 108 ? R.low : R.mid;
    cb.furn.push({x: p.x + p.w + gap, y, w, kind: list[Math.floor(r() * list.length)], n: k});
  }
}
const cbPlace = () => { const f = cb.furn[cb.at]; Object.assign(cb, {x: f.x + Math.min(10, f.w / 2), y: f.y - cbObj().hh, vx: 0, vy: 0, a: 0, w: 0, fly: false}); };
// un pas de vol (partagé avec la vérification) : la gravité, la rotation (plus rapide si on maintient), et l'atterrissage
function cbStep(b, tuck, furn) {
  const O = cbObj(), prevBottom = b.y + O.hh;
  b.vy += CB.G; b.x += b.vx; b.y += b.vy; b.a += tuck ? O.tuck : O.spin;
  const bx = b.x, bottom = b.y + O.hh;
  if (b.vy > 0) for (let i = 0; i < furn.length; i++) { const f = furn[i]; if (prevBottom <= f.y && bottom >= f.y && bx >= f.x - 3 && bx <= f.x + f.w + 3) { b.y = f.y - O.hh; return {land: i}; } }
  if (bottom >= CB.FLOOR) return {floor: true};
  return null;
}
const cbAngle = a => { a %= Math.PI * 2; if (a > Math.PI) a -= Math.PI * 2; return a; };
// où la bouteille va retomber si on ne maintient plus : le meuble, l'endroit, l'angle (null si rien dans les max pas)
function cbPredict(src, max = 200) { const b = {x: src.x, y: src.y, vx: src.vx, vy: src.vy, a: src.a}, pts = [];
  for (let t = 0; t < max; t++) { const r = cbStep(b, false, cb.furn); if (t % 3 === 2) pts.push([b.x, b.y + 8]); if (r) return {land: r.land, floor: r.floor, x: b.x, y: b.y, a: b.a, pts}; } return null; }
const cbLaunch = (b, p) => { const L = cbObj().launch; b.vx = (1 + p * 2.2) * L; b.vy = -(2 + p * 3.2) * L; b.w = 0; b.fly = true; };
const cbAuto = b => { const p = cbPredict(b); return !!p && p.land !== undefined && cbTilt(p.a) < -.12; };  // le mode facile : tourner plus vite tant que l'arrivée prévue est en retard sur « debout »
function cbLanded(i) {
  const a = Math.abs(cbTilt(cb.a));
  if (i === cb.at) return cbFail('pareil');  // retombée sur le même meuble : rien gagné, rien perdu
  if (a > cbOk() || i < cb.at) return cbFail('renversée');
  const turns = Math.floor(cb.a / (Math.PI * 2) + .15), fig = turns >= 3 ? 3 : turns >= 2 ? 2 : 1, perfect = a < CB.PERFECT, jump = i - cb.at, gain = jump * (perfect ? 2 : 1) * fig;
  cb.streak++; cb.flips++; if (perfect) cb.perfect++; if (fig > 1) cb.doubles++;
  cb.score += gain * 10 + Math.min(5, cb.streak) * 2;
  cb.at = i; cb.a = 0; cb.fly = false; cb.vx = cb.vy = 0; cbGen(cb.at + 8);
  cb.pop = {text: fig > 1 ? (fig > 2 ? 'TRIPLE' : 'DOUBLE') + (perfect ? ' PARFAIT !' : ' !') : perfect ? 'PARFAIT !' : jump > 1 ? 'SAUT DE ' + jump : 'DEBOUT !', t: perfect || fig > 1 ? 70 : 50, big: perfect || fig > 1};
  if (perfect) { cb.slow = 40; cb.flash = 8; for (let k = 0; k < 16; k++) { const an = k / 16 * Math.PI * 2; cb.stars.push({x: cb.x, y: cb.y + 6, vx: Math.cos(an) * 1.6, vy: Math.sin(an) * 1.6 - .6, t: 34}); } }
  if (cbRoom(cb.at + cb.base) !== cb.room) { cb.room = cbRoom(cb.at + cb.base); if (cb.at + cb.base < 60 && cb.room > cbs.roomMax) { cbs.roomMax = cb.room; saveGames(); cbOpts(); } setTimeout(() => { if (cb.mode === 'play') cb.pop = {text: CB_ROOMS[cb.room].name, t: 70, room: true}; }, perfect ? 900 : 500); }
  cbBeep(perfect ? 990 : 660, .08); if (!cbMute) setTimeout(() => cbBeep(perfect ? 1320 : 880, .12), 80);
}
function cbFail(how) {
  if (how === 'pareil') { cb.a = 0; cb.fly = false; cb.vx = cb.vy = 0; cbPlace(); cb.streak = 0; cbBeep(300, .06); return; }
  for (let i = 0; i < 12; i++) cb.drops.push({x: cb.x, y: cb.y + 4, vx: (cb.rnd() - .5) * 2, vy: -cb.rnd() * 2, t: 40});
  cb.how = how; cb.fly = false; cb.hold = false; cb.near = false;
  if (--cb.lives > 0) { cb.respawn = 60; cb.streak = 0; cb.pop = {text: 'OUPS ! ENCORE ' + cb.lives, t: 60}; cbBeep(220, .3, 'sawtooth', 90, .05); return; }
  cb.mode = 'over'; cb.dead = 0;
  cbs.games++; cbs.flips += cb.flips; cbs.perfect += cb.perfect; cbs.doubles += cb.doubles; cb.record = best(cb.easy ? 'culbuteFacile' : 'culbute', cb.score); saveGames(); cbInfo(); cbOpts();
  cbBeep(180, .5, 'sawtooth', 50, .06);
}
function cbUpdate() {
  for (const d of cb.drops) { d.x += d.vx; d.y += d.vy; d.vy += .15; if (d.y > CB.FLOOR) { d.y = CB.FLOOR; d.vy = 0; d.vx *= .6; } d.t--; } cb.drops = cb.drops.filter(d => d.t > 0);
  if (cb.pop && --cb.pop.t <= 0) cb.pop = null;
  for (const st of cb.stars) { st.x += st.vx; st.y += st.vy; st.vy += .05; st.t--; } cb.stars = cb.stars.filter(st => st.t > 0); if (cb.flash) cb.flash--;
  if (cb.mode === 'over') { cb.dead++; if (cb.dead < 30 && cb.how === 'renversée') { cb.a += .2; cb.y = Math.min(cb.y + 2, CB.FLOOR - 4); } return; }
  if (cb.mode !== 'play') return;
  if (cb.respawn) { if (cb.respawn > 30 && cb.how === 'renversée') { cb.a += .2; cb.y = Math.min(cb.y + 2, CB.FLOOR - 4); } if (--cb.respawn === 0) cbPlace(); return; }
  if (cb.slow > 0 || cb.near) { if (cb.slow > 0) cb.slow--; if (++cb.sk % 2) return; }  // le ralenti : à l'approche d'une bonne réception, et après un PARFAIT
  if (!cb.fly) { if (cb.hold) cb.charge = Math.min(1, cb.charge + 1 / CB.CHARGE); }
  else { const r = cbStep(cb, cb.easy ? cbAuto(cb) : cb.hold, cb.furn); if (r?.land !== undefined) { cb.near = false; cbLanded(r.land); } else if (r?.floor) { cb.near = false; cbFail('tombée'); } else { const p = cbPredict(cb, 12); cb.near = !!p && p.land > cb.at && Math.abs(cbTilt(p.a)) < cbOk(); } }
  // la caméra garde la bouteille au premier tiers
  cb.cam += (Math.max(0, cb.x - 50) - cb.cam) * .08;
}
function cbPress() {
  if (cb.mode === 'ready' || cb.mode === 'pause') cb.mode = 'play';
  if (cb.mode === 'over') { if (cb.dead > 60) { cbNew(); cb.mode = 'play'; } return; }
  if (cb.respawn) return;
  cb.hold = true; if (!cb.fly) cb.charge = 0;
}
function cbRelease() {
  if (!cb.hold) return; cb.hold = false;
  if (cb.mode === 'play' && !cb.fly && cb.charge > .05) { cbLaunch(cb, .15 + cb.charge * .85); cbBeep(240 + cb.charge * 300, .1, 'triangle', 600, .04); cb.charge = 0; }
}
function cbDraw() {
  const g = cb.g, {W, H, HUD, FLOOR} = CB, ox = Math.round(cb.cam);
  for (; cb.seen < cb.tick; cb.seen++) if (cb.mode !== 'play') cbUpdate();
  g.imageSmoothingEnabled = false;
  // les pièces : chacune entre deux portes (à mi-chemin du 15e meuble et du précédent), avec son mur, son décor et son sol
  const bounds = [-1e9]; for (let n = 15; n < cb.furn.length; n += 15) bounds.push((cb.furn[n - 1].x + cb.furn[n - 1].w + cb.furn[n].x) / 2); bounds.push(1e9);
  for (let k = 0; k < bounds.length - 1; k++) {
    const x0 = Math.max(0, Math.round(bounds[k] - ox)), x1 = Math.min(W, Math.round(bounds[k + 1] - ox)); if (x1 <= x0) continue;
    const room = (k + cb.base / 15) % CB_ROOMS.length; g.save(); g.beginPath(); g.rect(x0, 0, x1 - x0, H); g.clip();
    const wo = ((-ox % 64) + 64) % 64; for (let x = wo - 64; x < W; x += 64) g.drawImage(CB_WALLS[room], x, 0);
    const dofs = ((-Math.round(ox * .5) % 240) + 240) % 240; for (let x = dofs - 240; x < W; x += 240) g.drawImage(CB_DECORS[room], x, 26);
    if (room === 1) { for (let x = ((-ox % 8) + 8) % 8 - 8, i = Math.floor(ox / 8); x < W; x += 8, i++) for (let y = FLOOR; y < H; y += 5) px(g, (i + (y - FLOOR) / 5) % 2 ? '#e8e8e0' : '#2a2a32', x, y, 8, 5); }  // le carrelage
    else if (room === 3) { px(g, '#4a9a3a', 0, FLOOR, W, H - FLOOR); px(g, '#7ac85a', 0, FLOOR, W, 1); for (let x = ((-ox % 7) + 7) % 7 - 7; x < W; x += 7) px(g, '#3a7a2a', x + 3, FLOOR + 3, 1, 2); }  // l'herbe
    else { px(g, room === 2 ? '#8a5a48' : '#6a4028', 0, FLOOR, W, H - FLOOR); for (let x = ((-ox % 16) + 16) % 16 - 16; x < W; x += 16) { px(g, '#4a2a18', x, FLOOR, 1, H - FLOOR); px(g, room === 2 ? '#aa7a68' : '#8a5a38', x + 1, FLOOR, 14, 1); } }  // le parquet
    g.restore();
    if (k > 0 && x0 > 0) { px(g, '#1a1018', x0 - 3, 14, 6, FLOOR - 14); px(g, '#e8e0d8', x0 - 2, 15, 4, FLOOR - 15); px(g, '#b8b0a8', x0 + 1, 15, 1, FLOOR - 15); }  // l'encadrement de la porte
  }
  for (const f of cb.furn) cbFurniture(g, f, ox);
  // la trajectoire pendant la charge, jusqu'à l'atterrissage (sans la rotation : à toi de choisir quand maintenir)
  // la prédiction : pendant la charge, tout le saut ; en vol, la suite si on lâche maintenant. Le meuble visé s'éclaire, une flèche marque
  // l'endroit, et le fantôme de la bouteille montre dans quel sens elle arrivera : vert = debout, rouge = il faut tourner plus (maintenir)
  if (cb.mode === 'play' && !cb.respawn && (cb.fly || cb.hold)) {
    const src = cb.fly ? cb : (() => { const b = {x: cb.x, y: cb.y, a: 0}; cbLaunch(b, .15 + cb.charge * .85); return b; })(), p = cbPredict(src);
    if (p) {
      if (!cb.fly) for (const [x, y] of p.pts) { px(g, '#1a1018', Math.round(x - ox) - 1, Math.round(y) - 1, 3, 3); px(g, '#ffffff', Math.round(x - ox), Math.round(y), 1, 1); }
      if (cb.easy && !cb.fly) { const b = {...src}; let r; for (let t = 0; t < 200 && !(r = cbStep(b, cbAuto(b), cb.furn)); t++); if (r) Object.assign(p, {a: b.a, x: b.x, y: b.y, land: r.land, floor: r.floor}); }  // en facile, l'arrivée avec la rotation automatique
      const ok = p.land > cb.at && Math.abs(cbTilt(p.a)) < cbOk(), col = p.floor || p.land <= cb.at ? '#ff4a4a' : ok ? '#7ee07a' : '#ff8a3a', lx = Math.round(p.x - ox);
      if (p.land !== undefined && p.land !== cb.at) { const f = cb.furn[p.land]; px(g, col, Math.round(f.x - ox) - 1, Math.round(f.y) - 2, f.w + 2, 1); }
      const bob = (cb.tick >> 3) % 2; px(g, '#1a1018', lx - 3, Math.round(p.y) - 19 - bob, 7, 1); px(g, col, lx - 2, Math.round(p.y) - 19 - bob, 5, 1); px(g, col, lx - 1, Math.round(p.y) - 18 - bob, 3, 1); px(g, col, lx, Math.round(p.y) - 17 - bob, 1, 1);  // la flèche
      const gf = ((Math.round(cbAngle(p.a) / (Math.PI * 2) * 32) % 32) + 32) % 32; g.globalAlpha = .45; g.drawImage(cbRot()[gf], lx - 10, Math.round(p.y) - 10); g.globalAlpha = 1;
      if (!cb.easy && cb.fly && !ok && !p.floor && p.land > cb.at && !cb.hold && (cb.tick >> 2) % 2) pxFont(g, 'MAINTIENS !', W / 2, CB.HUD + 38, '#ff8a3a', 8, 'center');
    }
  }
  for (const d of cb.drops) px(g, '#7ac8f0', d.x - ox, d.y, 2, 1);
  const fr = ((Math.round(cbAngle(cb.a) / (Math.PI * 2) * 32) % 32) + 32) % 32;
  g.drawImage(cbRot()[fr], Math.round(cb.x - ox) - 10, Math.round(cb.y) - 10 + (cb.hold && !cb.fly ? Math.round(cb.charge * 2) : 0));
  // la jauge de charge à côté de la bouteille
  if (cb.mode === 'play' && !cb.fly && cb.hold) { const n = Math.round(cb.charge * 10), bx = Math.round(cb.x - ox) + 8, by = Math.round(cb.y) - 10; px(g, '#1a1018', bx, by - 1, 4, 22); for (let i = 0; i < 10; i++) px(g, i < n ? (i < 4 ? '#7ee07a' : i < 8 ? '#ffd84a' : '#ff8a3a') : '#3a2a32', bx + 1, by + 19 - i * 2, 2, 1); }
  for (const st of cb.stars) px(g, st.t > 20 ? '#ffffff' : '#ffd84a', st.x - ox, st.y, st.t > 12 ? 2 : 1, st.t > 12 ? 2 : 1);
  if (cb.flash) { g.globalAlpha = cb.flash / 16; px(g, '#ffffff', 0, 0, W, H); g.globalAlpha = 1; }
  if (cb.pop?.big) { const age = 70 - cb.pop.t, sz = age < 6 ? 10 + age : age < 10 ? 16 - (age - 6) : 12;  // PARFAIT ! : grossit, rebondit, clignote or et blanc
    gameText(g, W, [[cb.pop.text, (cb.tick >> 2) % 2 ? '#ffd84a' : '#ffffff', sz]], HUD + 30); }
  else if (cb.pop?.room) gameText(g, W, [[cb.pop.text, '#c8e8ff', 10]], HUD + 30);
  else if (cb.pop) pxFont(g, cb.pop.text, W / 2, HUD + 24 - Math.round((50 - Math.min(50, cb.pop.t)) / 8), '#ffd84a', 8, 'center');
  px(g, '#140e18', 0, 0, W, HUD);
  pxFont(g, String(cb.score), 4, 9, '#ffffff', 8); pxFont(g, 'Meuble ' + cb.at, W / 2, 9, '#c8b0d8', 8, 'center');
  for (let i = 0; i < cb.livesMax; i++) { const lx = W - 16 - cb.livesMax * 6 + i * 6; px(g, '#1a1018', lx, 2, 5, 9); px(g, i < cb.lives ? '#7ac8f0' : '#3a2a3a', lx + 1, 4, 3, 6); px(g, i < cb.lives ? '#3a7ad8' : '#3a2a3a', lx + 2, 2, 1, 2); }  // les bouteilles qui restent
  if (cb.streak > 1) pxFont(g, '×' + Math.min(5, cb.streak), W - 4, 9, '#ffd84a', 8, 'right');
  const rec = games.best[cb.easy ? 'culbuteFacile' : 'culbute'] || 0;
  if (cb.mode === 'ready') gameText(g, W, cb.easy ? [['CULBUTE', '#7ac8f0', 16], ['MODE FACILE', '#7ee07a'], ['Maintiens, lâche : saut', '#ffffff'], ['Elle tourne toute seule', '#ffffff'], ['Fantôme vert = c\'est bon', '#7ee07a'], ['Record ' + rec, '#ffd84a']]
    : [['CULBUTE', '#7ac8f0', 16], ['Maintiens, lâche : saut', '#ffffff'], ['Maintiens en l\'air :', '#ffffff'], ['elle tourne plus vite', '#ffffff'], ['Pose-la debout !', '#b8b0c8'], ['Fantôme vert = debout', '#7ee07a'], ['Record ' + rec, '#ffd84a']], 46);
  if (cb.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Touche : reprendre', '#b8b0c8']], 70);
  if (cb.mode === 'over' && cb.dead > 40) gameText(g, W, [[cb.how === 'tombée' ? 'PAR TERRE !' : 'RENVERSÉE !', '#ff8a3a', 12], [cb.score + ' points · ' + cb.flips + (cb.flips > 1 ? ' culbutes' : ' culbute'), '#ffffff'], [cb.record ? 'NOUVEAU RECORD !' : 'Record ' + rec, '#ffd84a'], [cb.dead > 60 ? 'Touche : recommencer' : '', '#b8b0c8']], 58);
  if (cb.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Culbute : ' + (cb.mode === 'play' ? cb.score + ' points, meuble ' + cb.at + ', ' + cb.flips + ' culbutes' : cb.mode === 'over' ? 'partie finie, ' + cb.score + ' points' : cb.mode === 'pause' ? 'pause' : 'prêt'));
}
function cbOpts() {  // le mode, l'objet (débloqué au nombre de culbutes) et la pièce de départ (débloquée en y arrivant)
  $('cbMode').textContent = 'MODE : ' + (cbs.easy ? 'FACILE' : 'EXPERT');
  $('cbModeHint').textContent = cbs.easy ? 'Un seul geste : maintiens pour viser, lâche pour sauter ; la rotation se règle toute seule. Cinq essais, meubles plus proches.' : 'Tu règles aussi la rotation : maintiens en l\'air pour tourner plus vite. Trois essais.';
  $('cbObjs').replaceChildren(...CB_OBJ.map((o, i) => { const open = cbs.flips >= o.need, b = el('button', 'btn' + ((cb?.obj ?? cbs.obj) === i ? ' main' : ''), open ? o.name : o.name + ' (' + o.need + ' culbutes)'); b.disabled = !open; b.onclick = () => { cbs.obj = i; saveGames(); cbNew(); b.blur(); }; return b; }));
  $('cbRooms').replaceChildren(...CB_ROOMS.map((r, i) => { const b = el('button', 'btn' + (Math.min(cbs.start, cbs.roomMax) === i ? ' main' : ''), r.name.replace(/^L[EA] |^L'/, '')); b.disabled = i > cbs.roomMax; b.onclick = () => { cbs.start = i; saveGames(); cbNew(); b.blur(); }; return b; }));
}
$('cbMode').onclick = () => { cbs.easy = !cbs.easy; saveGames(); cbNew(); $('cbMode').blur(); };
function cbInfo() {
  $('cbStats').replaceChildren(...[['Meilleur score', games.best.culbute || 0], ['Record facile', games.best.culbuteFacile || 0], ['Parties', cbs.games], ['Culbutes', cbs.flips], ['Parfaites', cbs.perfect], ['Doubles et triples', cbs.doubles]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
const CB_KEYS = [' ', 'ArrowUp', 'Enter', 'z', 'w'];
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !cb || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (CB_KEYS.includes(e.key)) { e.preventDefault(); if (!e.repeat) cbPress(); }
  if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && cb.mode === 'play' && !cb.fly) { cb.mode = 'pause'; cb.hold = false; }
});
document.addEventListener('keyup', e => { if (cb && CB_KEYS.includes(e.key)) cbRelease(); });
$('cbCanvas').onpointerdown = e => { e.preventDefault(); if (cb) cbPress(); };
document.addEventListener('pointerup', () => { if (cb) cbRelease(); });
// au doigt : un toucher interrompu (le téléphone qui reprend la main) lâche aussi ; PAUSE sous le jeu (pas de touche P),
// et la pause toute seule quand on quitte l'appli (un appel, l'écran qui s'éteint), sauf en plein saut : elle vient à l'arrivée
document.addEventListener('pointercancel', () => { if (cb) cbRelease(); });
$('cbCanvas').oncontextmenu = e => e.preventDefault();
const cbPauseNow = () => { if (cb?.mode === 'play' && !cb.fly) { cb.mode = 'pause'; cb.hold = false; return true; } return false; };
$('cbPause').onclick = () => { $('cbPause').blur(); if (!cbPauseNow() && cb?.mode === 'pause') cb.mode = 'play'; };
document.addEventListener('visibilitychange', () => { if (document.hidden && cb) { cbRelease(); cbPauseNow(); } });
$('cbNew').onclick = () => { cbNew(); $('cbNew').blur(); };
$('cbFs').onclick = () => { $('cbFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else $('cbCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
{  // la manette : A, B, RB, RT ou croix haut maintenu = charger puis tourner ; Start = pause / reprendre
  const HOLD = [0, 1, 5, 7, 12]; let prev = [];
  const loop = () => {
    requestAnimationFrame(loop);
    const p = [...(navigator.getGamepads?.() || [])].find(Boolean);
    if (!p || !cb || !view.classList.contains('on')) { prev = []; return; }
    const now = p.buttons.map(b => b.pressed), held = HOLD.some(i => now[i]), was = HOLD.some(i => prev[i]), start = now[9] && !prev[9]; prev = now;
    if (held && !was) cbPress(); else if (!held && was) cbRelease();
    if (start) { if (cb.mode === 'play' && !cb.fly) { cb.mode = 'pause'; cb.hold = false; } else if (cb.mode !== 'play') { cbPress(); cbRelease(); } }
  };
  requestAnimationFrame(loop);
}
function cbCheck() {  // vérification : depuis chaque meuble, il existe une charge et une durée de rotation rapide qui posent la bouteille debout sur le suivant ; pièces, vies
  const keep = cb, ks = {easy: cbs.easy, obj: cbs.obj, start: cbs.start, flips: cbs.flips}; Object.assign(cbs, {easy: false, obj: 0, start: 0}); cb = null; cbMute = true; cbNew(); cbGen(40);
  let reach = 0, total = 0;
  const bad = [];
  for (let o = 1; o < CB_OBJ.length; o++) { cb.obj = o; let n = 0;  // chaque objet peut aussi passer les 6 premiers meubles
    for (let i = 0; i < 6; i++) { const f = cb.furn[i]; let ok = false;
      for (let p = .15; p <= 1 && !ok; p += .03) for (let tuck = 0; tuck < 90 && !ok; tuck += 3) { const b = {x: f.x + Math.min(10, f.w / 2), y: f.y - cbObj().hh, a: 0}; cbLaunch(b, p);
        for (let t = 0; t < 200; t++) { const r = cbStep(b, t < tuck, cb.furn); if (r) { if (r.land === i + 1 && Math.abs(cbTilt(b.a)) < cbOk()) ok = true; break; } } }
      if (ok) n++; }
    if (n < 6) bad.push(CB_OBJ[o].name + ' ' + n + '/6'); }
  cb.obj = 0; cb.easy = true; { let n = 0;  // le mode facile : en ne choisissant que l'élan, la rotation automatique pose la bouteille debout
    for (let i = 0; i < 8; i++) { const f = cb.furn[i]; let ok = false;
      for (let p = .15; p <= 1 && !ok; p += .05) { const b = {x: f.x + Math.min(10, f.w / 2), y: f.y - 8, a: 0}; cbLaunch(b, p); for (let t = 0; t < 200; t++) { const r = cbStep(b, cbAuto(b), cb.furn); if (r) { if (r.land === i + 1 && Math.abs(cbTilt(b.a)) < cbOk()) ok = true; break; } } }
      if (ok) n++; }
    if (n < 8) bad.push('mode facile ' + n + '/8'); }
  cb.easy = false; cb.obj = 1; if (Math.abs(cbTilt(Math.PI)) > .01 || Math.abs(cbTilt(Math.PI * 2.1)) > .4) bad.push('canette à l’envers'); cb.obj = 0; if (Math.abs(cbTilt(Math.PI)) < 3) bad.push('bouteille à l’envers');
  cb.at = 0; cb.a = Math.PI * 4.02; cb.score = 0; cbLanded(1); if (!(cb.doubles === 1 && cb.pop.text.startsWith('DOUBLE') && cb.score >= 40)) bad.push('double : ' + cb.pop?.text + ' ' + cb.score);
  cb.a = Math.PI * 6.05; cbLanded(2); if (!cb.pop.text.startsWith('TRIPLE')) bad.push('triple');
  cbNew(); cbGen(40);
  for (let i = 0; i < 12; i++) {  // les 12 premiers suffisent au démarrage (la simulation complète a été faite sur 5 parties de 40 meubles)
    total++; const f = cb.furn[i]; let ok = false;
    for (let p = .15; p <= 1 && !ok; p += .03) for (let tuck = 0; tuck < 90 && !ok; tuck += 3) {
      const b = {x: f.x + Math.min(10, f.w / 2), y: f.y - 8, a: 0}; cbLaunch(b, p);
      for (let t = 0; t < 200; t++) { const r = cbStep(b, t < tuck, cb.furn); if (r) { if (r.land === i + 1 && Math.abs(cbAngle(b.a)) < CB.OK) ok = true; break; } }
    }
    if (ok) reach++;
  }
  if (reach !== total) bad.push('meubles atteignables ' + reach + '/' + total);
  if (!(cbRoom(0) === 0 && cbRoom(15) === 1 && cbRoom(30) === 2 && cbRoom(45) === 3 && cbRoom(60) === 0)) bad.push('pièces');
  if (!cb.furn.slice(15, 30).every(f => [...CB_ROOMS[1].tall, ...CB_ROOMS[1].mid, ...CB_ROOMS[1].low].includes(f.kind))) bad.push('meubles de la cuisine');
  cb.mode = 'play'; cb.fly = true; cbFail('tombée'); if (cb.mode !== 'play' || cb.lives !== CB.LIVES - 1 || !cb.respawn) bad.push('une vie perdue');
  Object.assign(cbs, ks); cb = keep; cbMute = false;
  return bad.length ? bad.join(', ') : 'ok';
}
{ const c = cbCheck(); console.assert(c === 'ok', 'culbute', c); }
$('cbCanvas').__cb = {st: () => cb, CB, check: cbCheck, predict: cbPredict, room: cbRoom, cbs, opts: cbOpts};
ctx.onOpen(() => {
  if (!cb || !cb.g) { cbNew(); cb.g = $('cbCanvas').getContext('2d'); }
  gameLoop(cb, 'culbute', cbUpdate, cbDraw); cbInfo();
});
}

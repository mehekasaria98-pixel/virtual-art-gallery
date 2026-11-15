import type { RegionId } from './regions';

/**
 * Art styles / movements / traditions.
 *
 * "Modern art" is deliberately split into its movements, and non-Western
 * traditions are first-class citizens rather than a single "World art" bucket.
 *
 * `aic` ids come from the Art Institute of Chicago category-terms API and
 * `wikidata` ids are movement items used with property P135 (movement). Both
 * were checked against the live APIs on 2026-11-15.
 */

export type StyleFamily = 'european' | 'modern' | 'asian' | 'african' | 'americas' | 'contemporary';

export interface StyleFamilyInfo {
  id: StyleFamily;
  label: string;
}

export const STYLE_FAMILIES: StyleFamilyInfo[] = [
  { id: 'european', label: 'European traditions' },
  { id: 'modern', label: 'Modern movements' },
  { id: 'asian', label: 'Asian traditions' },
  { id: 'african', label: 'African & diasporic' },
  { id: 'americas', label: 'The Americas' },
  { id: 'contemporary', label: 'Contemporary' },
];

export interface Style {
  id: string;
  label: string;
  family: StyleFamily;
  /** Typical active years (used for compatibility hints, not hard filtering). */
  from: number;
  to: number;
  /** Regions where the style is primarily found. Empty = global. */
  regions: readonly RegionId[];
  blurb: string;
  /** Art Institute of Chicago style term ids (`style_ids`). */
  aic?: readonly string[];
  /** Wikidata movement QIDs (P135). */
  wikidata?: readonly string[];
  /** Search keyword(s) sent to keyword-based sources (first is primary). */
  keywords: readonly string[];
}

export const STYLES = [
  // ── European traditions ────────────────────────────────────────────────
  { id: 'gothic', label: 'Gothic', family: 'european', from: 1150, to: 1500, regions: ['europe'], blurb: 'Luminous altarpieces, illuminated manuscripts and elongated, elegant figures.', aic: ['TM-5817', 'TM-5820'], wikidata: ['Q46825'], keywords: ['gothic'] },
  { id: 'early-renaissance', label: 'Early Renaissance', family: 'european', from: 1400, to: 1490, regions: ['europe'], blurb: 'Linear perspective and classical revival in 15th-century Italy and Flanders.', aic: ['TM-5897'], wikidata: ['Q1472236'], keywords: ['early renaissance', 'renaissance'] },
  { id: 'high-renaissance', label: 'High Renaissance', family: 'european', from: 1490, to: 1530, regions: ['europe'], blurb: 'Leonardo, Raphael, Michelangelo: harmony, balance and idealised form.', aic: ['TM-5898', 'TM-5891'], wikidata: ['Q1474884', 'Q4692'], keywords: ['renaissance'] },
  { id: 'northern-renaissance', label: 'Northern Renaissance', family: 'european', from: 1430, to: 1580, regions: ['europe'], blurb: 'Van Eyck, Dürer, Bruegel: oil-paint detail and everyday life north of the Alps.', wikidata: ['Q610877'], keywords: ['northern renaissance', 'flemish'] },
  { id: 'mannerism', label: 'Mannerism', family: 'european', from: 1520, to: 1600, regions: ['europe'], blurb: 'Artifice, twisting figures and unusual colour after the High Renaissance.', aic: ['TM-5903'], wikidata: ['Q131808'], keywords: ['mannerism', 'mannerist'] },
  { id: 'baroque', label: 'Baroque', family: 'european', from: 1600, to: 1730, regions: ['europe', 'latin-america'], blurb: 'Drama, movement and chiaroscuro: Caravaggio, Rubens, Rembrandt, Velázquez.', aic: ['TM-5894', 'TM-5900', 'TM-5901', 'TM-5902'], wikidata: ['Q37853', 'Q2352880'], keywords: ['baroque'] },
  { id: 'rococo', label: 'Rococo', family: 'european', from: 1720, to: 1780, regions: ['europe'], blurb: 'Pastel colours, playful ornament and aristocratic leisure.', aic: ['TM-5895'], wikidata: ['Q122960'], keywords: ['rococo'] },
  { id: 'neoclassicism', label: 'Neoclassicism', family: 'european', from: 1760, to: 1840, regions: ['europe', 'north-america'], blurb: 'A return to Greek and Roman order, clarity and civic virtue.', aic: ['TM-5983'], wikidata: ['Q14378'], keywords: ['neoclassical', 'neoclassicism'] },
  { id: 'romanticism', label: 'Romanticism', family: 'european', from: 1780, to: 1860, regions: ['europe', 'north-america'], blurb: 'Emotion, the sublime and untamed nature: Turner, Friedrich, Delacroix.', wikidata: ['Q37068'], keywords: ['romanticism', 'romantic'] },
  { id: 'realism', label: 'Realism', family: 'european', from: 1840, to: 1890, regions: ['europe', 'north-america'], blurb: 'Ordinary people and unidealised life: Courbet, Millet, Repin.', aic: ['TM-7548'], wikidata: ['Q10857409', 'Q143357'], keywords: ['realism', 'barbizon'] },
  { id: 'pre-raphaelite', label: 'Pre-Raphaelite', family: 'european', from: 1848, to: 1900, regions: ['europe'], blurb: 'Jewel-like colour and medieval subjects in Victorian Britain.', wikidata: ['Q184814'], keywords: ['pre-raphaelite'] },
  { id: 'impressionism', label: 'Impressionism', family: 'european', from: 1865, to: 1900, regions: ['europe', 'north-america'], blurb: 'Light, atmosphere and the fleeting moment: Monet, Morisot, Renoir.', aic: ['TM-7543', 'TM-16386'], wikidata: ['Q40415'], keywords: ['impressionism', 'impressionist'] },
  { id: 'post-impressionism', label: 'Post-Impressionism', family: 'european', from: 1885, to: 1910, regions: ['europe'], blurb: 'Structure and expressive colour: Cézanne, Van Gogh, Gauguin, Seurat.', aic: ['TM-7547'], wikidata: ['Q166713'], keywords: ['post-impressionism', 'post-impressionist'] },
  { id: 'symbolism', label: 'Symbolism', family: 'european', from: 1880, to: 1910, regions: ['europe'], blurb: 'Dreams, myth and the mystical: Moreau, Redon, Klimt.', aic: ['TM-7552'], wikidata: ['Q164800'], keywords: ['symbolism', 'symbolist'] },
  { id: 'art-nouveau', label: 'Art Nouveau', family: 'european', from: 1890, to: 1914, regions: ['europe', 'north-america'], blurb: 'Organic lines and decorative unity: Mucha, Tiffany, the Vienna Secession.', aic: ['TM-5977'], wikidata: ['Q34636'], keywords: ['art nouveau'] },

  // ── Modern movements (what is often loosely called "modern art") ────────
  { id: 'fauvism', label: 'Fauvism', family: 'modern', from: 1904, to: 1910, regions: ['europe'], blurb: 'Wild, unmixed colour: Matisse and Derain.', aic: ['TM-7628'], wikidata: ['Q166593'], keywords: ['fauvism', 'fauve'] },
  { id: 'expressionism', label: 'Expressionism', family: 'modern', from: 1905, to: 1935, regions: ['europe'], blurb: 'Inner feeling over appearance: Die Brücke, Der Blaue Reiter, Munch, Kirchner.', aic: ['TM-5979'], wikidata: ['Q80113'], keywords: ['expressionism', 'expressionist'] },
  { id: 'cubism', label: 'Cubism', family: 'modern', from: 1907, to: 1925, regions: ['europe'], blurb: 'Fractured, multi-viewpoint form: Picasso, Braque, Gris.', aic: ['TM-7539', 'TM-14351'], wikidata: ['Q42934'], keywords: ['cubism', 'cubist'] },
  { id: 'futurism', label: 'Futurism', family: 'modern', from: 1909, to: 1930, regions: ['europe'], blurb: 'Speed, machines and dynamism from Italy and Russia.', aic: ['TM-7649'], wikidata: ['Q131221'], keywords: ['futurism', 'futurist'] },
  { id: 'dada', label: 'Dada', family: 'modern', from: 1915, to: 1925, regions: ['europe', 'north-america'], blurb: 'Anti-art provocation, collage and readymades.', aic: ['TM-7542'], wikidata: ['Q6034'], keywords: ['dada'] },
  { id: 'constructivism-bauhaus', label: 'Constructivism & Bauhaus', family: 'modern', from: 1915, to: 1940, regions: ['europe'], blurb: 'Geometry, design and art for a new industrial society.', aic: ['TM-7667', 'TM-14421', 'TM-7634'], wikidata: ['Q207103', 'Q124354'], keywords: ['constructivism', 'bauhaus'] },
  { id: 'surrealism', label: 'Surrealism', family: 'modern', from: 1924, to: 1966, regions: ['europe', 'latin-america', 'north-america'], blurb: 'The unconscious and the dream: Dalí, Magritte, Kahlo, Carrington.', aic: ['TM-7551'], wikidata: ['Q39427'], keywords: ['surrealism', 'surrealist'] },
  { id: 'abstract-expressionism', label: 'Abstract Expressionism', family: 'modern', from: 1943, to: 1965, regions: ['north-america'], blurb: 'Gesture and colour field in post-war New York: Pollock, Rothko, Krasner.', aic: ['TM-7190'], wikidata: ['Q177725'], keywords: ['abstract expressionism'] },
  { id: 'pop-art', label: 'Pop Art', family: 'modern', from: 1955, to: 1975, regions: ['north-america', 'europe'], blurb: 'Mass culture and consumer imagery: Warhol, Lichtenstein, Hamilton.', aic: ['TM-7221'], wikidata: ['Q134147'], keywords: ['pop art'] },
  { id: 'minimalism', label: 'Minimalism', family: 'modern', from: 1960, to: 1980, regions: ['north-america', 'europe'], blurb: 'Reduction to essential forms and materials.', aic: ['TM-7208'], wikidata: ['Q173436'], keywords: ['minimalism', 'minimalist'] },

  // ── Asian traditions ──────────────────────────────────────────────────
  { id: 'chinese-literati', label: 'Chinese literati painting', family: 'asian', from: 1000, to: 1911, regions: ['east-asia'], blurb: 'Scholar-amateur ink painting that unites poetry, calligraphy and image.', keywords: ['literati', 'chinese painting'] },
  { id: 'shan-shui', label: 'Shan shui landscape', family: 'asian', from: 700, to: 1911, regions: ['east-asia'], blurb: '"Mountain-water" ink landscapes from the Tang to the Qing.', keywords: ['landscape ink', 'shan shui'] },
  { id: 'kano-rinpa', label: 'Kanō & Rinpa schools', family: 'asian', from: 1450, to: 1868, regions: ['east-asia'], blurb: 'Gold-leaf screens and bold decorative design of Japanese court and merchant patrons.', wikidata: ['Q252801'], keywords: ['kano school', 'rinpa'] },
  { id: 'ukiyo-e', label: 'Ukiyo-e', family: 'asian', from: 1670, to: 1900, regions: ['east-asia'], blurb: 'Edo-period woodblock prints of the "floating world": Hokusai, Hiroshige, Utamaro.', aic: ['TM-5310'], wikidata: ['Q185905'], keywords: ['ukiyo-e', 'woodblock print'] },
  { id: 'nihonga', label: 'Nihonga', family: 'asian', from: 1880, to: 1980, regions: ['east-asia'], blurb: 'Modern Japanese painting using traditional mineral pigments and silk.', wikidata: ['Q1989975'], keywords: ['nihonga'] },
  { id: 'persian-miniature', label: 'Persian miniature', family: 'asian', from: 1250, to: 1850, regions: ['west-central-asia', 'south-asia'], blurb: 'Jewel-toned manuscript painting from the Ilkhanid, Timurid and Safavid courts.', keywords: ['persian', 'shahnama'] },
  { id: 'mughal', label: 'Mughal painting', family: 'asian', from: 1550, to: 1850, regions: ['south-asia'], blurb: 'Imperial court painting blending Persian, Indian and European ideas.', aic: ['TM-5452'], wikidata: ['Q1049336'], keywords: ['mughal'] },
  { id: 'rajput-pahari', label: 'Rajput & Pahari painting', family: 'asian', from: 1600, to: 1900, regions: ['south-asia'], blurb: 'Vivid court painting of Rajasthan and the Himalayan foothills.', aic: ['TM-5494', 'TM-5504'], wikidata: ['Q2988788', 'Q3631050'], keywords: ['rajput', 'pahari', 'rajasthan'] },
  { id: 'bengal-school', label: 'Bengal School', family: 'asian', from: 1900, to: 1950, regions: ['south-asia'], blurb: 'Early 20th-century Indian modernism rooted in Asian traditions.', keywords: ['bengal school', 'abanindranath'] },
  { id: 'gutai', label: 'Gutai', family: 'asian', from: 1954, to: 1972, regions: ['east-asia'], blurb: 'Radical post-war Japanese performance and action painting.', aic: ['TM-13467'], keywords: ['gutai'] },

  // ── African & diasporic ───────────────────────────────────────────────
  { id: 'ancient-egyptian', label: 'Ancient Egyptian', family: 'african', from: -3000, to: -30, regions: ['africa'], blurb: 'Three millennia of sculpture, relief and funerary art along the Nile.', keywords: ['egyptian'] },
  { id: 'west-african-sculpture', label: 'West & Central African sculpture', family: 'african', from: 1400, to: 1950, regions: ['africa'], blurb: 'Masks, figures and regalia of the Yoruba, Akan, Kongo, Kuba, Dogon and many more.', keywords: ['yoruba', 'mask', 'kongo'] },
  { id: 'benin-court', label: 'Kingdom of Benin court art', family: 'african', from: 1300, to: 1900, regions: ['africa'], blurb: 'Brass plaques, heads and ivories of the Edo court in present-day Nigeria.', keywords: ['benin kingdom', 'court of benin'] },
  { id: 'harlem-renaissance', label: 'Harlem Renaissance', family: 'african', from: 1918, to: 1940, regions: ['north-america'], blurb: 'African American art and culture centred on 1920s Harlem.', aic: ['TM-7026'], wikidata: ['Q829895'], keywords: ['harlem renaissance'] },
  { id: 'african-modernism', label: 'African modernism', family: 'african', from: 1940, to: 1990, regions: ['africa'], blurb: 'Négritude, the Zaria Rebels and modernists across a decolonising continent.', wikidata: ['Q852544'], keywords: ['african modernism', 'nigerian'] },

  // ── The Americas ──────────────────────────────────────────────────────
  { id: 'pre-columbian', label: 'Pre-Columbian', family: 'americas', from: -1500, to: 1550, regions: ['latin-america'], blurb: 'Olmec, Maya, Aztec, Moche, Nazca and Inca art before European contact.', aic: ['TM-6516'], keywords: ['pre-columbian', 'maya'] },
  { id: 'hudson-river-school', label: 'Hudson River School', family: 'americas', from: 1825, to: 1880, regions: ['north-america'], blurb: 'Romantic American landscapes: Cole, Church, Bierstadt.', aic: ['TM-12035'], wikidata: ['Q943853', 'Q1159870'], keywords: ['hudson river school'] },
  { id: 'mexican-muralism', label: 'Mexican Muralism', family: 'americas', from: 1920, to: 1970, regions: ['latin-america'], blurb: 'Rivera, Orozco and Siqueiros: public art for a post-revolutionary nation.', wikidata: ['Q938864'], keywords: ['mexican muralism', 'rivera'] },
  { id: 'brazilian-modernism', label: 'Brazilian Modernismo', family: 'americas', from: 1922, to: 1960, regions: ['latin-america'], blurb: 'Tarsila do Amaral and the Anthropophagic movement.', wikidata: ['Q9033935'], keywords: ['brazilian modernism', 'tarsila'] },

  // ── Contemporary ──────────────────────────────────────────────────────
  { id: 'contemporary', label: 'Contemporary art', family: 'contemporary', from: 1970, to: 2100, regions: [], blurb: 'Art made from the 1970s to today, everywhere.', aic: ['TM-12062'], wikidata: ['Q186030'], keywords: ['contemporary'] },
] as const satisfies readonly Style[];

export type StyleId = (typeof STYLES)[number]['id'];

export const STYLE_IDS = STYLES.map((s) => s.id) as StyleId[];

const styleById = new Map<string, Style>(STYLES.map((s) => [s.id, s]));

export function getStyle(id: StyleId): Style {
  const s = styleById.get(id);
  if (!s) throw new Error(`Unknown style: ${id}`);
  return s;
}

export function isStyleId(value: string): value is StyleId {
  return styleById.has(value);
}

const styleByAic = new Map<string, StyleId>();
const styleByWikidata = new Map<string, StyleId>();
for (const s of STYLES as readonly Style[]) {
  for (const id of s.aic ?? []) if (!styleByAic.has(id)) styleByAic.set(id, s.id as StyleId);
  for (const id of s.wikidata ?? []) if (!styleByWikidata.has(id)) styleByWikidata.set(id, s.id as StyleId);
}

export function styleFromAic(termId: string): StyleId | null {
  return styleByAic.get(termId) ?? null;
}

export function styleFromWikidata(qid: string): StyleId | null {
  return styleByWikidata.get(qid) ?? null;
}

/** Tag a work with styles whose keywords appear in its free text. */
export function inferStyles(...texts: Array<string | null | undefined>): StyleId[] {
  const hay = texts.filter(Boolean).join(' | ').toLowerCase();
  if (!hay) return [];
  const out: StyleId[] = [];
  for (const s of STYLES as readonly Style[]) {
    const names = [s.label.toLowerCase(), ...s.keywords.filter((k) => k.length > 5)];
    if (names.some((n) => containsWord(hay, n))) out.push(s.id as StyleId);
  }
  return out;
}

function containsWord(hay: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}-])${escaped}($|[^\\p{L}-])`, 'u').test(hay);
}

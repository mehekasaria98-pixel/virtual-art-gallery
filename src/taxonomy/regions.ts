/**
 * World regions used across the app.
 *
 * Each region carries the vocabulary every upstream API understands, so the
 * adapters never hard-code geography themselves. Keep these lists short and
 * high-yield: every extra term can mean an extra upstream request.
 */

export type RegionId =
  | 'africa'
  | 'east-asia'
  | 'south-asia'
  | 'southeast-asia'
  | 'west-central-asia'
  | 'europe'
  | 'north-america'
  | 'latin-america'
  | 'oceania';

export interface Region {
  id: RegionId;
  label: string;
  /** One-line description shown in tooltips. */
  blurb: string;
  /** Met `geoLocation` values (one request per term, max 3 used). */
  met: string[];
  /** Art Institute of Chicago `place_of_origin` values. */
  aic: string[];
  /** Cleveland Museum of Art `culture` values (substring match). */
  cma: string[];
  /** V&A `q_place_name` values. */
  vam: string[];
  /** Harvard Art Museums `culture` values. */
  harvard: string[];
  /** Europeana `COUNTRY` facet values (only meaningful for Europe). */
  europeana: string[];
  /** Smithsonian free-text place terms. */
  smithsonian: string[];
  /** Wikidata country QIDs for P495 (country of origin). */
  wikidataCountries: string[];
  /** Words used to infer a region from a free-text place/culture string. */
  keywords: string[];
}

export const REGIONS: Region[] = [
  {
    id: 'africa',
    label: 'Africa',
    blurb: 'From ancient Egypt and Nok to Benin, Yoruba, Kuba and contemporary African modernists.',
    met: ['Africa', 'Nigeria', 'Egypt'],
    aic: ['Nigeria', 'Democratic Republic of the Congo', 'Egypt', 'Mali', "Côte d'Ivoire", 'Cameroon', 'Ghana', 'Africa'],
    cma: ['Africa', 'Egypt'],
    vam: ['Africa', 'Egypt', 'Nigeria'],
    harvard: ['African', 'Egyptian', 'Yoruba'],
    europeana: [],
    smithsonian: ['Africa', 'Nigeria', 'Ghana'],
    wikidataCountries: ['Q1033', 'Q117', 'Q1041', 'Q258', 'Q114', 'Q115', 'Q974', 'Q912', 'Q1028', 'Q1009', 'Q1008', 'Q954', 'Q1036', 'Q924', 'Q79', 'Q262', 'Q948'],
    keywords: ['africa', 'african', 'egypt', 'nigeria', 'yoruba', 'benin', 'congo', 'kongo', 'kuba', 'mali', 'dogon', 'bamana', 'ghana', 'asante', 'akan', 'cameroon', 'ivory coast', "côte d'ivoire", 'baule', 'senegal', 'ethiopia', 'kenya', 'tanzania', 'zimbabwe', 'shona', 'south africa', 'zulu', 'morocco', 'algeria', 'tunisia', 'sudan', 'nubia', 'igbo', 'edo', 'fang', 'gabon', 'angola', 'chokwe', 'luba', 'senufo', 'dan', 'makonde'],
  },
  {
    id: 'east-asia',
    label: 'East Asia',
    blurb: 'China, Japan, Korea and Mongolia: ink landscapes, ukiyo-e, celadon and court painting.',
    met: ['China', 'Japan', 'Korea'],
    aic: ['China', 'Japan', 'Korea'],
    cma: ['China', 'Japan', 'Korea'],
    vam: ['China', 'Japan', 'Korea'],
    harvard: ['Chinese', 'Japanese', 'Korean'],
    europeana: [],
    smithsonian: ['China', 'Japan', 'Korea'],
    wikidataCountries: ['Q148', 'Q17', 'Q884', 'Q423', 'Q865', 'Q711', 'Q29520'],
    keywords: ['china', 'chinese', 'japan', 'japanese', 'korea', 'korean', 'mongolia', 'tibet', 'tibetan', 'taiwan', 'edo period', 'meiji', 'qing', 'ming dynasty', 'song dynasty', 'joseon', 'goryeo', 'tang dynasty', 'yuan dynasty'],
  },
  {
    id: 'south-asia',
    label: 'South Asia',
    blurb: 'India, Pakistan, Bangladesh, Nepal and Sri Lanka: Mughal, Rajput and Pahari painting, temple sculpture.',
    met: ['India', 'Nepal', 'Pakistan'],
    aic: ['India', 'Nepal', 'Pakistan', 'Sri Lanka'],
    cma: ['India', 'Nepal', 'Pakistan'],
    vam: ['India', 'Pakistan', 'Nepal'],
    harvard: ['Indian', 'Nepalese', 'Pakistani'],
    europeana: [],
    smithsonian: ['India', 'Nepal', 'Sri Lanka'],
    wikidataCountries: ['Q668', 'Q843', 'Q902', 'Q854', 'Q837', 'Q129286'],
    keywords: ['india', 'indian', 'mughal', 'rajput', 'rajasthan', 'pahari', 'deccan', 'nepal', 'nepalese', 'pakistan', 'bangladesh', 'bengal', 'sri lanka', 'ceylon', 'kashmir', 'punjab', 'gujarat', 'tamil'],
  },
  {
    id: 'southeast-asia',
    label: 'Southeast Asia',
    blurb: 'Indonesia, Thailand, Cambodia, Vietnam, Myanmar and the Philippines: Khmer, Javanese and Thai traditions.',
    met: ['Indonesia', 'Thailand', 'Cambodia'],
    aic: ['Indonesia', 'Thailand', 'Cambodia', 'Vietnam', 'Myanmar', 'Philippines'],
    cma: ['Indonesia', 'Thailand', 'Cambodia'],
    vam: ['Indonesia', 'Thailand', 'Burma'],
    harvard: ['Indonesian', 'Thai', 'Cambodian'],
    europeana: [],
    smithsonian: ['Indonesia', 'Thailand', 'Cambodia'],
    wikidataCountries: ['Q252', 'Q869', 'Q881', 'Q928', 'Q424', 'Q836', 'Q833', 'Q334'],
    keywords: ['indonesia', 'java', 'javanese', 'bali', 'balinese', 'thailand', 'thai', 'siam', 'cambodia', 'khmer', 'vietnam', 'vietnamese', 'burma', 'myanmar', 'burmese', 'philippines', 'filipino', 'malaysia', 'laos', 'singapore'],
  },
  {
    id: 'west-central-asia',
    label: 'West & Central Asia',
    blurb: 'Iran, Türkiye, the Levant, Mesopotamia, Arabia and Central Asia: Persian miniatures, Ottoman and Islamic art.',
    met: ['Iran', 'Turkey', 'Iraq'],
    aic: ['Iran', 'Turkey', 'Iraq', 'Syria', 'Afghanistan', 'Uzbekistan'],
    cma: ['Iran', 'Turkey', 'Iraq', 'Syria'],
    vam: ['Iran', 'Turkey', 'Syria'],
    harvard: ['Persian', 'Turkish', 'Ottoman'],
    europeana: [],
    smithsonian: ['Iran', 'Turkey', 'Syria'],
    wikidataCountries: ['Q794', 'Q43', 'Q796', 'Q858', 'Q801', 'Q822', 'Q851', 'Q889', 'Q265', 'Q810', 'Q232', 'Q12560'],
    keywords: ['iran', 'iranian', 'persia', 'persian', 'safavid', 'qajar', 'turkey', 'türkiye', 'turkish', 'ottoman', 'anatolia', 'iraq', 'mesopotamia', 'assyria', 'babylon', 'syria', 'levant', 'lebanon', 'israel', 'palestine', 'jordan', 'arabia', 'yemen', 'afghanistan', 'uzbekistan', 'samarkand', 'bukhara', 'timurid', 'central asia'],
  },
  {
    id: 'europe',
    label: 'Europe',
    blurb: 'From Gothic altarpieces to the Renaissance, Romanticism and the European avant-garde.',
    met: ['France', 'Italy', 'Netherlands'],
    aic: ['France', 'Italy', 'England', 'Netherlands', 'Germany', 'Spain', 'Flanders', 'Belgium', 'Austria', 'Russia', 'United Kingdom'],
    cma: ['France', 'Italy', 'Netherlands', 'Germany', 'England'],
    vam: ['England', 'France', 'Italy'],
    harvard: ['French', 'Italian', 'Dutch'],
    europeana: ['France', 'Netherlands', 'Germany', 'Italy', 'Spain', 'Sweden', 'Belgium', 'Poland'],
    smithsonian: ['France', 'Italy', 'England'],
    wikidataCountries: ['Q142', 'Q38', 'Q183', 'Q29', 'Q145', 'Q55', 'Q31', 'Q159', 'Q40', 'Q39', 'Q20', 'Q34', 'Q35', 'Q36', 'Q45', 'Q41', 'Q27', 'Q33', 'Q213', 'Q28', 'Q170072', 'Q29999', 'Q70972', 'Q174193', 'Q161885'],
    keywords: ['europe', 'european', 'france', 'french', 'paris', 'italy', 'italian', 'florence', 'venice', 'rome', 'england', 'english', 'british', 'scotland', 'ireland', 'netherlands', 'dutch', 'flanders', 'flemish', 'belgium', 'germany', 'german', 'austria', 'vienna', 'spain', 'spanish', 'portugal', 'russia', 'russian', 'sweden', 'norway', 'denmark', 'finland', 'poland', 'bohemia', 'hungary', 'greece', 'greek', 'switzerland', 'united kingdom'],
  },
  {
    id: 'north-america',
    label: 'North America',
    blurb: 'The United States and Canada, including Indigenous art, the Hudson River School and Abstract Expressionism.',
    met: ['United States', 'Canada'],
    aic: ['United States', 'Canada'],
    cma: ['America', 'Canada', 'Native North American'],
    vam: ['United States', 'Canada'],
    harvard: ['American', 'Canadian', 'Native American'],
    europeana: [],
    smithsonian: ['United States', 'Canada'],
    wikidataCountries: ['Q30', 'Q16'],
    keywords: ['united states', 'american', 'u.s.', 'usa', 'new york', 'canada', 'canadian', 'native north american', 'native american', 'inuit', 'haida', 'tlingit', 'lakota', 'navajo', 'pueblo', 'first nations'],
  },
  {
    id: 'latin-america',
    label: 'Latin America & Caribbean',
    blurb: 'Pre-Columbian civilisations, colonial painting, Mexican Muralism and Latin American modernism.',
    met: ['Mexico', 'Peru', 'Guatemala'],
    aic: ['Mexico', 'Peru', 'Brazil', 'Guatemala', 'Argentina', 'Cuba', 'Colombia', 'Costa Rica'],
    cma: ['Mexico', 'Peru', 'Central America', 'South America'],
    vam: ['Mexico', 'Peru', 'Brazil'],
    harvard: ['Mexican', 'Peruvian', 'Maya'],
    europeana: [],
    smithsonian: ['Mexico', 'Peru', 'Brazil'],
    wikidataCountries: ['Q96', 'Q155', 'Q414', 'Q241', 'Q739', 'Q419', 'Q298', 'Q717', 'Q77', 'Q790', 'Q774', 'Q750', 'Q736', 'Q800', 'Q766'],
    keywords: ['mexico', 'mexican', 'aztec', 'maya', 'mayan', 'olmec', 'peru', 'peruvian', 'inca', 'moche', 'nazca', 'brazil', 'brazilian', 'argentina', 'chile', 'colombia', 'cuba', 'cuban', 'haiti', 'jamaica', 'caribbean', 'guatemala', 'costa rica', 'panama', 'ecuador', 'bolivia', 'venezuela', 'uruguay', 'central america', 'south america', 'pre-columbian'],
  },
  {
    id: 'oceania',
    label: 'Oceania',
    blurb: 'Australia, Aotearoa New Zealand, Melanesia, Polynesia and Micronesia.',
    met: ['Papua New Guinea', 'New Zealand', 'Australia'],
    aic: ['Papua New Guinea', 'New Zealand', 'Australia', 'Solomon Islands', 'Vanuatu'],
    cma: ['Oceania', 'Papua New Guinea', 'New Zealand'],
    vam: ['Australia', 'New Zealand', 'Papua New Guinea'],
    harvard: ['Australian', 'Maori', 'Melanesian'],
    europeana: [],
    smithsonian: ['Australia', 'New Zealand', 'Papua New Guinea'],
    wikidataCountries: ['Q408', 'Q664', 'Q691', 'Q712', 'Q686', 'Q685', 'Q683'],
    keywords: ['oceania', 'australia', 'australian', 'aboriginal', 'new zealand', 'aotearoa', 'maori', 'māori', 'papua', 'new guinea', 'melanesia', 'polynesia', 'micronesia', 'fiji', 'samoa', 'tonga', 'hawaii', 'hawaiian', 'vanuatu', 'solomon islands', 'marquesas', 'tahiti'],
  },
];

export const REGION_IDS = REGIONS.map((r) => r.id) as RegionId[];

const regionById = new Map(REGIONS.map((r) => [r.id, r]));

export function getRegion(id: RegionId): Region {
  const region = regionById.get(id);
  if (!region) throw new Error(`Unknown region: ${id}`);
  return region;
}

export function isRegionId(value: string): value is RegionId {
  return regionById.has(value as RegionId);
}

/**
 * Infer our region from free text such as "Japan, Edo period" or
 * "Yoruba peoples, Nigeria". Returns the region with the earliest keyword hit.
 */
export function inferRegion(...texts: Array<string | null | undefined>): RegionId | null {
  const haystack = texts.filter(Boolean).join(' | ').toLowerCase();
  if (!haystack) return null;
  let best: { id: RegionId; index: number } | null = null;
  for (const region of REGIONS) {
    for (const kw of region.keywords) {
      const index = indexOfWord(haystack, kw);
      if (index >= 0 && (best === null || index < best.index)) best = { id: region.id, index };
    }
  }
  return best?.id ?? null;
}

function indexOfWord(haystack: string, word: string): number {
  let from = 0;
  while (from <= haystack.length) {
    const i = haystack.indexOf(word, from);
    if (i < 0) return -1;
    const before = i === 0 ? ' ' : haystack[i - 1]!;
    const after = haystack[i + word.length] ?? ' ';
    if (!/[a-zà-ÿ]/i.test(before) && !/[a-zà-ÿ]/i.test(after)) return i;
    from = i + 1;
  }
  return -1;
}

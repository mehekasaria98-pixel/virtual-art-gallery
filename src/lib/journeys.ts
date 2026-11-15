import type { SearchQuery, SourceId } from '@/types/artwork';
import { EMPTY_QUERY, toSearchParams } from './query';

/** Curated starting points: each is just a saved set of Explore filters. */
export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  query: Partial<SearchQuery>;
  /** A single fast source used for the cover image on the home page. */
  coverSource: SourceId;
}

export const JOURNEYS: Journey[] = [
  { id: 'romanticism-europe', title: 'Romanticism across Europe', subtitle: 'Storms, ruins and the sublime, 1780–1860', query: { regions: ['europe'], from: 1780, to: 1860, styles: ['romanticism'] }, coverSource: 'wikidata' },
  { id: 'ukiyo-e', title: 'Ukiyo-e in Edo Japan', subtitle: 'Pictures of the floating world, 1670–1900', query: { regions: ['east-asia'], from: 1670, to: 1900, styles: ['ukiyo-e'] }, coverSource: 'aic' },
  { id: 'mughal-rajput', title: 'Mughal & Rajput courts', subtitle: 'Painting in South Asia, 1550–1850', query: { regions: ['south-asia'], from: 1550, to: 1850, styles: ['mughal', 'rajput-pahari'] }, coverSource: 'aic' },
  { id: 'west-central-africa', title: 'Arts of West & Central Africa', subtitle: 'Masks, figures and regalia', query: { regions: ['africa'], from: 1400, to: 1950 }, coverSource: 'cma' },
  { id: 'impressionism', title: 'Impressionism and after', subtitle: 'Light, colour and modern life, 1865–1910', query: { from: 1865, to: 1910, styles: ['impressionism', 'post-impressionism'] }, coverSource: 'aic' },
  { id: 'ancient-egypt', title: 'Ancient Egypt', subtitle: 'Three thousand years on the Nile', query: { regions: ['africa'], from: -3000, to: -30, q: 'egyptian' }, coverSource: 'met' },
  { id: 'persian-ottoman', title: 'Persian & Ottoman worlds', subtitle: 'Manuscripts, ceramics and court art, 1250–1850', query: { regions: ['west-central-asia'], from: 1250, to: 1850 }, coverSource: 'cma' },
  { id: 'harlem-renaissance', title: 'The Harlem Renaissance', subtitle: 'African American modernism, 1918–1940', query: { styles: ['harlem-renaissance'] }, coverSource: 'wikidata' },
  { id: 'latin-american-modernism', title: 'Latin American modernism', subtitle: 'Muralists, Surrealists and Modernistas', query: { regions: ['latin-america'], from: 1920, to: 1970 }, coverSource: 'wikidata' },
  { id: 'khmer-java', title: 'Temples of Southeast Asia', subtitle: 'Khmer, Javanese and Thai sculpture, 800–1500', query: { regions: ['southeast-asia'], from: 800, to: 1500 }, coverSource: 'cma' },
  { id: 'pre-columbian', title: 'The ancient Americas', subtitle: 'Olmec, Maya, Moche and Inca', query: { regions: ['latin-america'], to: 1550, styles: ['pre-columbian'] }, coverSource: 'aic' },
  { id: 'oceania', title: 'Art of Oceania', subtitle: 'Melanesia, Polynesia, Australia and Aotearoa', query: { regions: ['oceania'] }, coverSource: 'cma' },
];

export function journeyQuery(j: Journey): SearchQuery {
  return { ...EMPTY_QUERY, ...j.query };
}

export function journeyHref(j: Journey): string {
  return `/explore?${toSearchParams(journeyQuery(j)).toString()}`;
}

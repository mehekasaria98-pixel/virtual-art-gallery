'use client';

import { Tooltip } from '@mantine/core';
import type { KeyboardEvent } from 'react';
import { REGIONS, type RegionId } from '@/taxonomy/regions';

/**
 * A deliberately stylised world map: nine soft region shapes, not borders.
 * Each region is a keyboard-focusable toggle button (Enter / Space).
 */

interface Shape {
  points: string;
  label: [number, number];
  short: string;
}

export const REGION_SHAPES: Record<RegionId, Shape> = {
  'north-america': { points: '70,78 205,42 335,58 322,122 282,168 242,214 196,226 150,190 108,150 68,118', label: [200, 128], short: 'N. America' },
  'latin-america': { points: '200,236 262,228 300,256 346,292 332,352 300,402 280,452 254,456 248,392 232,322 208,272', label: [282, 330], short: 'Latin Am.' },
  europe: { points: '452,72 560,56 592,90 572,140 522,160 470,152 444,116', label: [516, 108], short: 'Europe' },
  africa: { points: '462,182 560,172 610,212 620,272 590,342 556,402 520,402 500,332 470,272 446,222', label: [536, 282], short: 'Africa' },
  'west-central-asia': { points: '582,132 690,112 720,152 692,202 642,216 602,202 586,166', label: [650, 164], short: 'W. & C. Asia' },
  'south-asia': { points: '694,206 742,194 772,218 746,272 722,302 702,252', label: [734, 244], short: 'S. Asia' },
  'east-asia': { points: '722,72 882,62 902,122 862,182 802,200 754,182 724,142', label: [812, 130], short: 'E. Asia' },
  'southeast-asia': { points: '780,218 842,212 882,252 862,302 802,292 784,252', label: [830, 258], short: 'SE Asia' },
  oceania: { points: '822,342 922,332 952,382 912,432 842,422 816,382', label: [884, 384], short: 'Oceania' },
};

export interface RegionMapProps {
  selected: RegionId[];
  onToggle?: (id: RegionId) => void;
  /** Optional counts drawn under each label (used by the Map view). */
  counts?: Partial<Record<RegionId, number>>;
  ariaLabel?: string;
}

export function RegionMap({ selected, onToggle, counts, ariaLabel = 'World regions' }: RegionMapProps) {
  const onKey = (e: KeyboardEvent, id: RegionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle?.(id);
    }
  };
  return (
    <svg viewBox="40 30 940 440" role="group" aria-label={ariaLabel} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {REGIONS.map((r) => {
        const shape = REGION_SHAPES[r.id];
        const pressed = selected.includes(r.id);
        const count = counts?.[r.id];
        return (
          <Tooltip.Floating key={r.id} label={`${r.label}: ${r.blurb}`}>
            <g>
              <polygon
                className="region-shape"
                points={shape.points}
                role="button"
                tabIndex={onToggle ? 0 : -1}
                aria-pressed={pressed}
                aria-label={`${r.label}${count !== undefined ? `, ${count} works` : ''}`}
                onClick={() => onToggle?.(r.id)}
                onKeyDown={(e) => onKey(e, r.id)}
                strokeLinejoin="round"
              />
              <text className="region-label" x={shape.label[0]} y={shape.label[1]} textAnchor="middle">
                {shape.short}
                {count !== undefined && (
                  <tspan x={shape.label[0]} dy="20" fontWeight={400} fontSize={14}>
                    {count}
                  </tspan>
                )}
              </text>
            </g>
          </Tooltip.Floating>
        );
      })}
    </svg>
  );
}

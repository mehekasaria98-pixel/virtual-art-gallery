'use client';

import { Box, Button, Chip, Collapse, Group, NumberInput, RangeSlider, Stack, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import {
  CENTURIES,
  centuryOf,
  decadesOf,
  formatRange,
  formatYear,
  MAX_YEAR,
  NAMED_PERIODS,
} from '@/taxonomy/eras';

/**
 * Three ways to pick a time window, all writing the same from/to pair:
 *  1. Named periods (Ancient … Contemporary)
 *  2. A scrollable century strip; picking one century reveals its decades
 *  3. A custom range slider / number inputs (BCE as negative years)
 */

interface Props {
  from: number | null;
  to: number | null;
  onChange: (from: number | null, to: number | null) => void;
}

const SLIDER_MIN = 1000;

export function EraFilter({ from, to, onChange }: Props) {
  const [custom, { toggle: toggleCustom }] = useDisclosure(false);

  // A century is "active" when the whole range sits inside it (the century itself or one of its decades).
  const activeCenturyN =
    from !== null && to !== null ? (CENTURIES.find((c) => c.from <= from && to <= c.to)?.n ?? null) : null;
  const decades = activeCenturyN !== null ? decadesOf(activeCenturyN) : [];
  const activeDecade = decades.find((d) => d.from === from && d.to === to);
  const activePeriod = NAMED_PERIODS.find((p) => p.from === from && p.to === to);

  // Keep the selected century visible in the scrolling strip (default: the 19th–21st centuries).
  const rowRef = useRef<HTMLDivElement>(null);
  const anchorN = activeCenturyN ?? (from !== null ? centuryOf(from) : 19);
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-century="${anchorN}"]`);
    if (row && chip) row.scrollLeft = chip.offsetLeft - row.offsetLeft - 16;
  }, [anchorN]);

  return (
    <Stack gap="sm">
      <Text size="sm" fw={600} aria-live="polite">
        {formatRange(from, to)}
      </Text>

      <Box>
        <Text size="xs" tt="uppercase" fw={600} className="muted" mb={6}>
          Periods
        </Text>
        <Group gap={6}>
          {NAMED_PERIODS.map((p) => (
            <Tooltip key={p.id} label={`${formatRange(p.from, p.to)}. ${p.blurb}`}>
              <Chip
                checked={activePeriod?.id === p.id}
                onChange={() => (activePeriod?.id === p.id ? onChange(null, null) : onChange(p.from, p.to))}
              >
                {p.label}
              </Chip>
            </Tooltip>
          ))}
        </Group>
      </Box>

      <Box>
        <Text size="xs" tt="uppercase" fw={600} className="muted" mb={6}>
          Century
        </Text>
        <div className="scroll-row" role="group" aria-label="Centuries" ref={rowRef}>
          {CENTURIES.map((c) => {
            const on = activeCenturyN === c.n;
            return (
              <Chip
                key={c.n}
                data-century={c.n}
                checked={on}
                onChange={() => (on && !activeDecade ? onChange(null, null) : onChange(c.from, c.to))}
                aria-label={c.label}
              >
                {c.short}
              </Chip>
            );
          })}
        </div>
      </Box>

      {decades.length > 0 && (
        <Box>
          <Text size="xs" tt="uppercase" fw={600} className="muted" mb={6}>
            Decade in the {CENTURIES.find((c) => c.n === activeCenturyN)?.label}
          </Text>
          <Group gap={6} role="group" aria-label="Decades">
            {decades.map((d) => {
              const on = activeDecade?.from === d.from;
              const century = CENTURIES.find((c) => c.n === activeCenturyN)!;
              return (
                <Chip key={d.from} size="xs" checked={on} onChange={() => (on ? onChange(century.from, century.to) : onChange(d.from, d.to))}>
                  {d.label}
                </Chip>
              );
            })}
          </Group>
        </Box>
      )}

      <Button
        variant="subtle"
        size="compact-sm"
        color="gray"
        leftSection={<IconAdjustmentsHorizontal size={14} />}
        onClick={toggleCustom}
        aria-expanded={custom}
        w="fit-content"
      >
        Custom range
      </Button>
      <Collapse in={custom}>
        <CustomRange from={from} to={to} onChange={onChange} />
      </Collapse>
    </Stack>
  );
}

function CustomRange({ from, to, onChange }: Props) {
  // Slider covers 1000 CE → today (where most dated works sit); the inputs allow any year incl. BCE.
  const [range, setRange] = useState<[number, number]>([Math.max(from ?? SLIDER_MIN, SLIDER_MIN), Math.min(to ?? MAX_YEAR, MAX_YEAR)]);
  useEffect(() => {
    setRange([Math.max(from ?? SLIDER_MIN, SLIDER_MIN), Math.min(to ?? MAX_YEAR, MAX_YEAR)]);
  }, [from, to]);

  return (
    <Stack gap="sm" pt="xs">
      <RangeSlider
        min={SLIDER_MIN}
        max={MAX_YEAR}
        step={5}
        minRange={5}
        value={range}
        onChange={setRange}
        onChangeEnd={([a, b]) => onChange(a, b)}
        label={formatYear}
        marks={[1200, 1400, 1600, 1800, 2000].map((v) => ({ value: v, label: String(v) }))}
        aria-label="Year range"
        mb="lg"
      />
      <Group grow>
        <NumberInput
          label="From year"
          description="Negative = BCE"
          value={from ?? ''}
          min={-3000}
          max={MAX_YEAR}
          onChange={(v) => onChange(v === '' ? null : Number(v), to)}
          size="xs"
        />
        <NumberInput
          label="To year"
          description={`Up to ${MAX_YEAR}`}
          value={to ?? ''}
          min={-3000}
          max={MAX_YEAR}
          onChange={(v) => onChange(from, v === '' ? null : Number(v))}
          size="xs"
        />
      </Group>
      {from !== null && (
        <Text size="xs" className="muted">
          Starts in the {CENTURIES.find((c) => c.n === centuryOf(from))?.label ?? 'selected era'}.
        </Text>
      )}
    </Stack>
  );
}

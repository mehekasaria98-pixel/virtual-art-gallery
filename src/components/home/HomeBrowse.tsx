'use client';

import { Chip, Group, Paper } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { RegionMap } from '@/components/filters/RegionMap';
import { CENTURIES } from '@/taxonomy/eras';

/** Home-page shortcuts: click a region or a century to jump into Explore. */
export function RegionShortcut() {
  const router = useRouter();
  return (
    <Paper withBorder p="sm" radius="md" style={{ background: 'var(--gallery-surface)' }}>
      <RegionMap selected={[]} onToggle={(id) => router.push(`/explore?regions=${id}`)} ariaLabel="Explore a region" />
    </Paper>
  );
}

export function CenturyShortcut() {
  const router = useRouter();
  const recent = CENTURIES.filter((c) => c.n >= 12 || c.n <= -10);
  return (
    <div className="scroll-row" role="group" aria-label="Explore a century">
      {recent.map((c) => (
        <Chip key={c.n} checked={false} onChange={() => router.push(`/explore?from=${c.from}&to=${c.to}&view=timeline`)} size="md">
          {c.label}
        </Chip>
      ))}
    </div>
  );
}

export function StylePills({ items }: { items: Array<{ id: string; label: string }> }) {
  const router = useRouter();
  return (
    <Group gap={8}>
      {items.map((s) => (
        <Chip key={s.id} checked={false} onChange={() => router.push(`/explore?styles=${s.id}`)}>
          {s.label}
        </Chip>
      ))}
    </Group>
  );
}

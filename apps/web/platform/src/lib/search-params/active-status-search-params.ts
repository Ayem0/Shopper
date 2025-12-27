import { ActiveStatus } from '@shopify-clone/proto-ts';
import { createParser } from 'nuqs/server';

const validActiveStatus = Object.values(ActiveStatus).filter(
  (v) => typeof v === 'number' && v >= 0
) as number[];

export const parseAsActiveStatusArray = createParser({
  parse: (value) => {
    const items = value.split(',');
    if (items.length === 0) return null;
    const res: ActiveStatus[] = [];
    for (const item of items) {
      const parsed = Number(item);
      if (validActiveStatus.includes(parsed)) {
        res.push(parsed);
      }
    }
    return res.length > 0 ? res : null;
  },
  serialize: (value) => (value.length > 0 ? value.join(',') : null) as string,
});

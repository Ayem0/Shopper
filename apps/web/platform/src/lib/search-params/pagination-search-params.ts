import { createParser, parseAsIndex } from 'nuqs/server';

const parseAsPagination = createParser({
  parse: (value) => {
    const parsed = Number(value);
    const validValues = [10, 25, 50];
    if (validValues.includes(parsed)) {
      return parsed;
    }
    return null;
  },
  serialize: (value) => String(value),
});

export const paginationParsers = {
  pageIndex: parseAsIndex.withDefault(0),
  pageSize: parseAsPagination.withDefault(10),
};

export const paginationUrlKeys = {
  pageIndex: 'page',
  pageSize: 'size',
};

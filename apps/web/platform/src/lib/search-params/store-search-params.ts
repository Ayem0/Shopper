import {
  createParser,
  createSearchParamsCache,
  parseAsBoolean,
  parseAsString,
} from 'nuqs/server';
import {
  ShopSortBy,
  ShopType,
} from '../../../../../../libs/ts/proto-ts/src/gen/shop/shop_types';
import {
  paginationParsers,
  paginationUrlKeys,
} from './pagination-search-params';

const validShopTypes = Object.values(ShopType).filter(
  (v) => typeof v === 'number' && v >= 0
) as number[];

const parseAsShopTypeArray = createParser({
  parse: (value) => {
    const items = value.split(',');
    if (items.length === 0) return null;
    const res: ShopType[] = [];
    for (const item of items) {
      const parsed = Number(item);
      if (validShopTypes.includes(parsed)) {
        res.push(parsed);
      }
    }
    return res.length > 0 ? res : null;
  },
  serialize: (value) => (value.length > 0 ? value.join(',') : null) as string,
});

const validShopSortBy = Object.values(ShopSortBy).filter(
  (v) => typeof v === 'number' && v >= 0
) as ShopSortBy[];

const parseAsShopSortBy = createParser({
  parse: (value) => {
    const parsed = Number(value);
    if (validShopSortBy.includes(parsed)) {
      return parsed as ShopSortBy;
    }
    return null;
  },
  serialize: (value) => String(value),
});

export const storeSearchParamsParsers = {
  ...paginationParsers,
  sort: parseAsShopSortBy.withDefault(ShopSortBy.SHOP_SORT_BY_UPDATED_AT),
  desc: parseAsBoolean.withDefault(false),
  search: parseAsString.withDefault(''),
  active: parseAsBoolean.withDefault(false),
  types: parseAsShopTypeArray.withDefault([]),
};

export const storeSearchParamsUrlKeys: Record<
  keyof typeof storeSearchParamsParsers,
  string
> = {
  ...paginationUrlKeys,
  sort: 'sort',
  desc: 'desc',
  search: 's',
  active: 'active',
  types: 'types',
};

export const storeSearchParamsCache = createSearchParamsCache(
  storeSearchParamsParsers,
  {
    urlKeys: storeSearchParamsUrlKeys,
  }
);

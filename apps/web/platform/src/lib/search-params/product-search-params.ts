import {
  createParser,
  createSearchParamsCache,
  parseAsBoolean,
  parseAsString,
} from 'nuqs/server';
import { parseAsActiveStatusArray } from './active-status-search-params';
import {
  paginationParsers,
  paginationUrlKeys,
} from './pagination-search-params';

export enum ProductSortBy {
  PRODUCT_SORT_BY_NAME = 0,
  PRODUCT_SORT_BY_UPDATED_AT = 1,
  UNRECOGNIZED = -1,
}

const validProductSortBy = Object.values(ProductSortBy).filter(
  (v) => typeof v === 'number' && v > 0
) as ProductSortBy[];

const parseAsProductSortBy = createParser({
  parse: (value) => {
    const parsed = Number(value);
    if (validProductSortBy.includes(parsed)) {
      return parsed as ProductSortBy;
    }
    return null;
  },
  serialize: (value) => String(value),
});

export const productSearchParamsParsers = {
  ...paginationParsers,
  status: parseAsActiveStatusArray.withDefault([]),
  sort: parseAsProductSortBy.withDefault(
    ProductSortBy.PRODUCT_SORT_BY_UPDATED_AT
  ),
  desc: parseAsBoolean.withDefault(false),
  search: parseAsString.withDefault(''),
};

export const productSearchParamsUrlKeys: Record<
  keyof typeof productSearchParamsParsers,
  string
> = {
  ...paginationUrlKeys,
  status: 'status',
  sort: 'sort',
  desc: 'desc',
  search: 's',
};

export const productSearchParamsCache = createSearchParamsCache(
  productSearchParamsParsers,
  {
    urlKeys: productSearchParamsUrlKeys,
  }
);

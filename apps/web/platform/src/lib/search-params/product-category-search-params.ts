import { ProductCategorySortBy } from '@shopify-clone/proto-ts';
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

const validProductCategorySortBy = Object.values(ProductCategorySortBy).filter(
  (v) => typeof v === 'number' && v >= 0
) as ProductCategorySortBy[];

const parseAsProductCategorySortBy = createParser({
  parse: (value) => {
    const parsed = Number(value);
    if (validProductCategorySortBy.includes(parsed)) {
      return parsed as ProductCategorySortBy;
    }
    return null;
  },
  serialize: (value) => String(value),
});

export const productCategorySearchParamsParsers = {
  ...paginationParsers,
  sort: parseAsProductCategorySortBy.withDefault(
    ProductCategorySortBy.PRODUCT_CATEGORY_SORT_BY_UPDATED_AT
  ),
  desc: parseAsBoolean.withDefault(false),
  search: parseAsString.withDefault(''),
  status: parseAsActiveStatusArray.withDefault([]),
};

export const productCategorySearchParamsUrlKeys: Record<
  keyof typeof productCategorySearchParamsParsers,
  string
> = {
  ...paginationUrlKeys,
  status: 'status',
  sort: 'sort',
  desc: 'desc',
  search: 's',
};

export const productCategorySearchParamsCache = createSearchParamsCache(
  productCategorySearchParamsParsers,
  {
    urlKeys: productCategorySearchParamsUrlKeys,
  }
);

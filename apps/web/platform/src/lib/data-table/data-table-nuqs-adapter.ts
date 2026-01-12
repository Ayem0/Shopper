import { useQueryStates, UseQueryStatesKeysMap, Values } from 'nuqs';
import { Base, TableStateAdapter } from './data-table';

export function createNuqsTableState<
  TSort extends number,
  TParser extends UseQueryStatesKeysMap<Base<TSort> & any>
>(
  parsers: TParser,
  urlKeys: Record<keyof TParser, string>
): TableStateAdapter<Values<TParser>> {
  return {
    useState() {
      const [state, setState] = useQueryStates(parsers, { urlKeys });
      return [state, setState];
    },
  };
}

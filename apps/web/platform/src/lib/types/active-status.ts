import { ActiveStatus } from '@shopify-clone/proto-ts';

export const activeStatusOptions = [
  { label: 'Draft', value: ActiveStatus.ACTIVE_STATUS_UNSPECIFIED },
  { label: 'Active', value: ActiveStatus.ACTIVE_STATUS_ACTIVE },
  { label: 'Inactive', value: ActiveStatus.ACTIVE_STATUS_INACTIVE },
];

export const activeStatusOptionsStr = [
  {
    label: 'Draft',
    value: ActiveStatus.ACTIVE_STATUS_UNSPECIFIED.toString(),
  },
  {
    label: 'Active',
    value: ActiveStatus.ACTIVE_STATUS_ACTIVE.toString(),
  },
  {
    label: 'Inactive',
    value: ActiveStatus.ACTIVE_STATUS_INACTIVE.toString(),
  },
];

export const activeStatusToLabel: Record<ActiveStatus, string> = {
  [ActiveStatus.ACTIVE_STATUS_ACTIVE]: 'Active',
  [ActiveStatus.ACTIVE_STATUS_INACTIVE]: 'Inactive',
  [ActiveStatus.ACTIVE_STATUS_UNSPECIFIED]: 'Draft',
  [ActiveStatus.UNRECOGNIZED]: 'Unknown',
};

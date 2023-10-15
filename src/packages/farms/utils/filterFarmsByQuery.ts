import { latinise } from 'utils/latinise';
import { FarmWithStakedValue } from '../types';

export const filterFarmsByQuery = (farms: FarmWithStakedValue[], query: string): FarmWithStakedValue[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ');
    return farms.filter((farm: FarmWithStakedValue) => {
      const farmSymbol = latinise(farm.lpSymbol.toLowerCase());
      const farmAddress = latinise(farm.manager.toLowerCase());

      return queryParts.every((queryPart) => {
        return farmSymbol.includes(queryPart) || farmAddress.toLowerCase() === query.toLowerCase();
      });
    });
  }
  return farms;
};

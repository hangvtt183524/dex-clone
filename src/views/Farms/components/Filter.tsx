import { BoxProps, Grid } from 'components/Box';
import Search from 'components/Input/Search';
import { AutoRow } from 'components/Layout/Row';
import { OptionProps } from 'components/Select/types';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import { OnChangeEventParms } from 'config/types';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import { FarmSortOptionEnum } from 'packages/farms/types';
import React, { useCallback, useMemo } from 'react';
import { useFarmQuery, useFarmSelectSortOptions } from 'state/farms/hooks';
import { useUserFarmStakedOnly } from 'state/user/hooks';
import styled from 'styled-components';

const Filter: React.FC<BoxProps & { farmOnly?: boolean; hideFarm?: boolean }> = ({
  farmOnly = false,
  hideFarm = false,
  ...props
}) => {
  const { isDesktop } = useMatchBreakpoints();

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(false);
  const [query, setQuery] = useFarmQuery();
  const [sortOption, setSortOption] = useFarmSelectSortOptions();

  const options: OptionProps[] = useMemo(
    () => [
      {
        label: FarmSortOptionEnum.HOT,
        value: FarmSortOptionEnum.HOT,
      },
      {
        label: FarmSortOptionEnum.LASTEST,
        value: FarmSortOptionEnum.LASTEST,
      },
      {
        label: FarmSortOptionEnum.APR,
        value: FarmSortOptionEnum.APR,
      },
      {
        label: FarmSortOptionEnum.EARNED,
        value: FarmSortOptionEnum.EARNED,
      },
    ],
    [],
  );

  const handleQuery: OnChangeEventParms = useCallback((e) => setQuery(e.target.value), [setQuery]);
  const handleSelectSortOption = (option: OptionProps) => {
    setSortOption(option.value);
  };

  const optionSelected = useMemo(
    () => options.findIndex((option) => option.value === sortOption),
    [options, sortOption],
  );

  return (
    <StyledWrapFilter hideFarm={hideFarm} {...props}>
      {!hideFarm && (
        <AutoRow
          style={{
            flexWrap: 'initial',
          }}
          gap="6px"
          className="stake-sort"
        >
          <AutoRow
            style={{
              flexWrap: 'initial',
            }}
            width="auto !important"
            className="stake-only"
          >
            <Text width="max-content" color="textSubtle" mr="8px">
              {farmOnly ? 'Farm Only' : 'Staked Only'}
            </Text>
            <Toggle checked={stakedOnly} onChange={setStakedOnly} scale="md" />
          </AutoRow>
          {/* <RowFixed className="wrap-select">
          <Text className="sortBy" whiteSpace="nowrap" color="textSubtle" mr="8px">
            Sort by
          </Text>
          <Select
            variant={isDesktop ? 'secondary' : 'primary'}
            height="44px !important"
            options={options}
            defaultOptionIndex={optionSelected}
            onOptionChange={handleSelectSortOption}
          />
        </RowFixed> */}
        </AutoRow>
      )}
      <Search
        ml="auto"
        maxWidth={['100%', '', '', '', '320px']}
        width="100%"
        iconSize="20px !important"
        placeholder="Search Pools"
        variant={isDesktop ? 'select' : 'quaternary'}
        value={query}
        onChange={handleQuery}
      />
    </StyledWrapFilter>
  );
};
const StyledWrapFilter = styled(Grid)<{ hideFarm: boolean }>`
  grid-template-columns: 1fr;
  gap: 12px;

  justify-content: center;
  flex-direction: column;
  width: 100%;
  flex: 1 1;

  .stake-sort {
    flex-direction: row-reverse;
    .wrap-select {
      width: 100%;
      margin-right: 12px;
      .sortBy {
        display: none;
      }
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    flex-direction: row-reverse;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    grid-template-columns: ${({ hideFarm }) => (hideFarm ? '' : 'auto auto')};
    justify-content: flex-end;
    flex-direction: row;
    width: 100%;

    .stake-sort {
      flex-direction: row;
      .wrap-select {
        .sortBy {
          display: block;
        }
      }
    }
  }
`;

export default Filter;

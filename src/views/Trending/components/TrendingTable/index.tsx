import Table from 'components/Table';
import { TableBody, Thead, Tr } from 'components/Table/Cell';
import Text from 'components/Text';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { DesktopColumnSchemaTrending, ITableProps } from '../../types';
// import TrendingRowMobile from './TrendingRowMobile';
import TrendingRow from './TrendingRow';
import { StyledTh } from './styled';

const TrendingTable: React.FC<React.PropsWithChildren<ITableProps>> = ({
  trendingLists,
  onSelectCurrency,
  currencySelected,
}) => {
  const renderRowDesktop = useMemo(() => {
    return trendingLists.map((trendingCurrency) => {
      return (
        <TrendingRow
          {...trendingCurrency}
          onSelectCurrency={onSelectCurrency}
          selected={currencySelected === trendingCurrency.token.address}
          key={`table-farm-row-${trendingCurrency.token.address}`}
        />
      );
    });
  }, [onSelectCurrency, currencySelected, trendingLists]);

  return (
    <TableWrapper>
      <StyledTable>
        <StyledThead>
          <Tr>
            {DesktopColumnSchemaTrending.map((column) => {
              return (
                <StyledTh key={`th-header-row-${column.name}`}>
                  <Text fontWeight={400} color="textAlt4" textAlign={column.textAlign as any}>
                    {column.label}
                  </Text>
                </StyledTh>
              );
            })}
          </Tr>
        </StyledThead>
        <StyledTableBody>{renderRowDesktop}</StyledTableBody>
      </StyledTable>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  overflow: visible;

  ${StyledTh}:first-child {
    text-align: left;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    ${StyledTh}:last-child {
      text-align: left;
      padding-right: 0;
    }
  }
`;

const StyledThead = styled(Thead)`
  ${StyledTh} {
    padding: 12px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    ${StyledTh} {
      padding: 18px 12px;
    }
  }
`;
const StyledTable = styled(Table)`
  border-radius: 0;
`;
const StyledTableBody = styled(TableBody)`
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)), rgba(13, 14, 16, 0.9);
`;

export default TrendingTable;

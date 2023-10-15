import { Td, Tr } from 'components/Table/Cell';

import { Box } from 'components/Box';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import React, { createElement, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DesktopColumnSchema, MobileColumnSchema, RowPropsWithLoading } from '../types';
import CellLayout from './CellLayout';
import Apr from './ColData/Apr';
import Details from './ColData/Details';
import Earned from './ColData/Earned';
import Farm from './ColData/Farm';
import LockTime from './ColData/LockTime';
import Multiplier from './ColData/Multiplier';
import ActionPanel from './FarmAction/ActionPanel';
import Fee from './ColData/Fee';

const cells = {
  farm: Farm,
  apr: Apr,
  fee: Fee,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  locktime: LockTime,
};

const Row: React.FunctionComponent<React.PropsWithChildren<RowPropsWithLoading>> = (props) => {
  const { userDataReady } = props;
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false);

  const toggleActionPanel = useCallback(() => {
    setActionPanelExpanded(!actionPanelExpanded);
  }, [actionPanelExpanded]);

  const { isDesktop } = useMatchBreakpoints();

  const isSmallerScreen = !isDesktop;

  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema;

  const columnNames = tableSchema.map((column) => column.name);
  const handleRenderRow = useMemo(() => {
    return (
      <StyledRow onClick={toggleActionPanel}>
        {Object.keys(props).map((key) => {
          const columnIndex = columnNames.indexOf(key);
          if (columnIndex === -1) {
            return null;
          }

          switch (key) {
            case 'details':
              return (
                <StyledTd key={key}>
                  <StyledCellLayout justifyContent="flex-start">
                    <Details actionPanelToggled={actionPanelExpanded} />
                  </StyledCellLayout>
                </StyledTd>
              );
            case 'apr':
              return (
                <StyledTd key={key}>
                  <StyledCellLayout>
                    <Apr {...props.apr} hideButton={false} />
                  </StyledCellLayout>
                </StyledTd>
              );
            default:
              return (
                <StyledTd key={key}>
                  <StyledCellLayout>{createElement(cells[key], { ...props[key], userDataReady })}</StyledCellLayout>
                </StyledTd>
              );
          }
        })}
      </StyledRow>
    );
  }, [actionPanelExpanded, columnNames, props, toggleActionPanel, userDataReady]);

  return (
    <>
      <StyledTr />
      {handleRenderRow}
      <tr>
        <td colSpan={6}>
          <WrapperActionPanel>
            <ActionPanel {...props} expanded={actionPanelExpanded} />
          </WrapperActionPanel>
        </td>
      </tr>
    </>
  );
};
const StyledTd = styled(Td)``;

const StyledCellLayout = styled(CellLayout)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledRow = styled(Tr)`
  cursor: pointer;
`;
const WrapperActionPanel = styled(Box)`
  border-color: rgba(255, 255, 255, 0.15);
  border-style: solid;
  border-bottom-width: 1px;
`;
const StyledTr = styled.tr`
  border-color: rgba(255, 255, 255, 0.15);
  border-style: solid;
  border-bottom-width: 1px;
`;

export default Row;

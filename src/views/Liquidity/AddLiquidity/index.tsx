import { RowCenter } from 'components/Layout/Row';
import React from 'react';
import MintConfig from './components/MintConfig';
import MintForm from './components/MintForm';

const AddLiquidity: React.FC = () => {
  return (
    <RowCenter>
      <MintConfig />
      <MintForm />
    </RowCenter>
  );
};

export default AddLiquidity;

import { createAction } from '@reduxjs/toolkit';

export const setVersion = createAction<number>('app/setVersion');

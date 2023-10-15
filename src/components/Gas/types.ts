import { FeeDescriptions, GasPriceTypes } from 'state/user/actions';
import { GasGreen, GasBlue, GasRed } from 'svgs';

export const dataInforGasFee = [
    {
        icon: GasGreen,
        title: FeeDescriptions[GasPriceTypes.ECONOMY].title,
        time: FeeDescriptions[GasPriceTypes.ECONOMY].eta,
        type: GasPriceTypes.ECONOMY,
        multi: 1,
        chartType: 'slow',
    },
    {
        icon: GasBlue,
        title: FeeDescriptions[GasPriceTypes.REGULAR].title,
        time: FeeDescriptions[GasPriceTypes.REGULAR].eta,
        type: GasPriceTypes.REGULAR,
        multi: 1.05,
        chartType: 'everage',
    },
    {
        icon: GasRed,
        title: FeeDescriptions[GasPriceTypes.FAST].title,
        time: FeeDescriptions[GasPriceTypes.FAST].eta,
        type: GasPriceTypes.FAST,
        multi: 1.1,
        chartType: 'fast',
    },
];

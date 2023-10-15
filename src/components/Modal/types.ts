import { BoxProps } from '../Box/types';

export interface ModalTheme {
  background: string;
}

export interface InjectedModalProps {
  onDismiss?: () => void;
  data?: any;
}

export interface ModalProps extends InjectedModalProps, BoxProps {
  title: string;
  closeButton?: boolean;
  onBack?: () => void;
  minWidth?: string;
  bodyPadding?: string[] | string;
  bodyMaxHeight?: string;
  centerTitle?: boolean;

  styleBody?: React.CSSProperties;
}

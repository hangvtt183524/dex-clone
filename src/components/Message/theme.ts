import RoboTheme from 'styles';

const variants = {
  warning: {
    background: '#FFB23719',
    borderColor: RoboTheme.colors.warning,
  },
  failure: {
    background: '#ED4B9E19',
    borderColor: RoboTheme.colors.failure,
  },
  success: {
    background: 'rgba(49, 208, 170, 0.1)',
    borderColor: RoboTheme.colors.success,
  },
} as const;

export default variants;

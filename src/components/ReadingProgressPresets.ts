// Preset configurations for ReadingProgress component
// Separated to avoid Fast Refresh issues with mixed exports

export const ReadingProgressPresets = {
  minimal: {
    showPercentage: false,
    showTimeRemaining: false,
    height: 2,
  },
  detailed: {
    showPercentage: true,
    showTimeRemaining: true,
    height: 4,
  },
  bottom: {
    position: 'bottom' as const,
    showPercentage: true,
    height: 3,
  },
} as const;

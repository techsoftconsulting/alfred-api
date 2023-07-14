export interface HumanizerConfig {
  language?: 'es' | 'en';
}

export default interface TimeHumanizer {
  humanize(timeInMs: number, config?: HumanizerConfig): string;
}

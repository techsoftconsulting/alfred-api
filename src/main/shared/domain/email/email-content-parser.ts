export default interface EmailContentParser {
  parseFromFile(filePath: string, params?: any): Promise<string>;
}

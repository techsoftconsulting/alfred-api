export default interface MultipartHandler<K, Z> {
  getFilesAndFields<F>(
    request: K,
    response: Z,
  ): Promise<{ files: any; fields: F }>;
}

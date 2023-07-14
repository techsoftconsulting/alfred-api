import CodeGenerator from '../../domain/utils/code-generator';

export default class SimpleCodeGenerator implements CodeGenerator {
  generate(length?: number): string {
    return this.makeId(length ?? 5);
  }

  private makeId(length: number) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

import EmailMessage from './email-message';

export default interface EmailSender<T = Object> {
  send(email: EmailMessage): Promise<T>;
  verify(): void;
}

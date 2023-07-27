export type EmailRecipient = {
  name?: string;
  email: string;
};

type AttributesMap = {
  [key: string]: string;
};

export type EmailMessageProperties = {
  from?: EmailRecipient;
  to: EmailRecipient;
  content?: string;
  attachments?: Array<any>;
  attributes?: AttributesMap;
  subject?: string;
  templateId?: string;
};

export default class EmailMessage {
  private readonly from?: EmailRecipient;
  private readonly to: EmailRecipient;
  private readonly subject?: string;
  private content?: string;
  private readonly attachments?: Array<string>;
  private readonly attributes?: AttributesMap;
  private templateId?: string;

  constructor(emailData: EmailMessageProperties) {
    // eslint-disable-next-line no-unused-expressions
    emailData.from && this.ensureValidEmail(emailData.from.email);
    this.ensureValidEmail(emailData.to.email);

    this.from = emailData.from;
    this.to = emailData.to;
    this.subject = emailData.subject;
    this.content = emailData.content;
    this.attachments = emailData.attachments;
    this.templateId = emailData.templateId;
    this.attributes = emailData.attributes;
  }

  public toPrimitives() {
    return {
      toEmail: this.to.email,
      toName: this.to.name,
      fromEmail: this.from?.email,
      fromName: this.from?.name,
      subject: this.subject,
      content: this.content,
      attachments: this.attachments,
      attributes: this.attributes,
      templateId: this.templateId,
    };
  }

  private ensureValidEmail(email: string) {
    if (!isValidEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
  }
}

function isValidEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

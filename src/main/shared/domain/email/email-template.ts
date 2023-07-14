
export default class EmailTemplate {

    private readonly from: string;
    private readonly to: string;
    private readonly subject?: string;
    private readonly text?: string;
    private readonly html?: string;
    private readonly attachments?: Array<string>;

    constructor(emailData: { from: string, to: string, text?: string, html?: string, attachments?: Array<string>, subject?: string }) {

        this.ensureValidEmail(emailData.from)
        this.ensureValidEmail(emailData.to)

        this.from = emailData.from;
        this.to = emailData.to;
        this.subject = emailData.subject;
        this.text = emailData.text;
        this.html = emailData.html;
        this.attachments = emailData.attachments;

    }

    static fromPrimitive(
        plainObject: { from: string, to: string, subject?: string, text?: string, html?: string, attachments?: Array<string> }
    ): EmailTemplate {
        return new EmailTemplate(plainObject);
    }

    public toPrimitives() {
        return {
            to: this.to,
            from: this.from,
            subject: this.subject,
            text: this.text,
            html: this.html,
            attachments: this.attachments
        }
    }

    private ensureValidEmail(email: string) {
        if(!isValidEmail(email)){
            throw new Error(`${email} is not a valid email`)
        }
    }
}

function isValidEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
import ValueObject from '../value-object/value-object';

export type FileAttachmentType = 'csv' | 'jpg' | 'png' | 'pdf';

/* class constructor properties */
export interface FileAttachmentProps {
  url: string;
  type?: FileAttachmentType;
  description?: string;
}

/* class properties to represent plain data */
export interface FileAttachmentPrimitiveProps {
  url: string;
  type?: string;
  description?: string;
}

export default class FileAttachment extends ValueObject<FileAttachmentProps> {
  get url() {
    return this.props.url;
  }

  get type() {
    return this.props.type;
  }

  static fromPrimitives(props: FileAttachmentPrimitiveProps) {
    return new FileAttachment({
      ...props,
      type: <FileAttachmentType>props.type,
    });
  }

  toPrimitives(): FileAttachmentPrimitiveProps {
    const json: any = super.toJson();

    return json;
  }
}

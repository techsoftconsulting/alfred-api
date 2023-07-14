import Collection from '../value-object/collection';
import {FileUploadResponse} from './file-upload-response';
import {UploadFile} from './storage-types';

export default interface FileUploader {
    uploadFile(
        file: UploadFile,
        name?: string,
        filePath?: string,
    ): Promise<FileUploadResponse>;
    uploadFiles(
        files: Collection<{
            file: UploadFile;
            name?: string;
            fileKey?: string;
            filePath?: string;
        }>,
    ): Promise<Collection<FileUploadResponse>>;
}

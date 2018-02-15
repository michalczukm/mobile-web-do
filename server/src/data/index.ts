import documentDatabase from './document-storage/database';
export { documentDatabase };

// explicit export only models interfaces
export { BrowserInfo, Session, ClientIdentifier } from './document-storage/models';

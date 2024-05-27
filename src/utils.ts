import crypto from 'crypto';

export const generateETag: (updatedDate: Date) => string = (updatedDate) =>
  crypto.createHash('md5').update(updatedDate.toISOString()).digest('hex');

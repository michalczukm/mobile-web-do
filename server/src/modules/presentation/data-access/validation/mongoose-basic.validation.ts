import * as mongoose from 'mongoose';

export const isIdValid = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

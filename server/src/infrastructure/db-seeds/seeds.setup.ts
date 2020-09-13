import * as Mongoose from 'mongoose';

import { SessionModel } from '../../modules/presentation/models';
import database from '../../data/document-storage/database';
import { SEED_DATA } from './seed.constants';

const checkIfAnyCollectionsInDb = (): Promise<boolean> =>
  new Promise<boolean>(async (resolve, reject) => {
    const connection = Mongoose.connection.db;
    connection
      .listCollections()
      .toArray(async (error, result: { name: string }[]) => {
        if (error) {
          reject(error);
        } else if (result) {
          const doesEntriesExists = await Promise.all(
            result.map(({ name: collectionName }) =>
              connection
                .collection(collectionName)
                .countDocuments()
                .then((count) => count > 0)
            )
          );

          resolve(doesEntriesExists.some(Boolean));
        } else {
          resolve(false);
        }
      });
  });

const seedSessions = (): Promise<any> => {
  return database.session
    .create<SessionModel>(SEED_DATA)
    .catch((reason) => onRejected('session')(reason));
};

const onRejected = (entityName: string) => (reason: any) => {
  console.error(`Failed at seeding ${entityName}`);
  throw reason;
};

export const seedDatabase = async ({
  isProduction,
}: {
  isProduction: boolean;
}): Promise<void> => {
  const anyCollections: boolean = await checkIfAnyCollectionsInDb();

  // don't seed for production env or if there are any collections in db
  if (isProduction || anyCollections) {
    return;
  }

  return Promise.all([seedSessions()]).then(() =>
    console.log(`### Database seeded, ${new Date()}`)
  );
};

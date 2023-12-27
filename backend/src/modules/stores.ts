import { myDataSource } from "../app-data-source";
import { Store } from "../entity/store.entity";

export default class Stores {
    static async all() {
        return await myDataSource.getRepository(Store).find();
    }
    static async put(store: Store) {
        const newStore = myDataSource.getRepository(Store).create(store);
        await myDataSource.getRepository(Store).save(newStore);
        return newStore;
    }
    static async get(id: string) {
        const store = await myDataSource.getRepository(Store).findOneBy({ id });
        return store;
    }
    static async patch(id: string, changes: Partial<Store>) {
        const newStore = await myDataSource.getRepository(Store).save({
            id,
            ...changes,
        });
        return newStore;
    }
}
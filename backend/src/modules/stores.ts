import { myDataSource } from "../app-data-source";
import { Store } from "../entity/store.entity";

export default class Stores {
    static async all() {
        return await myDataSource.getRepository(Store).find();
    }
}
import { myDataSource } from "../app-data-source";
import { Person } from "../entity/person.entity";
import { createId } from "../utils";

export const VISIBLE_PEOPLE_PROPS = ['id', 'username'];
const ALL_PEOPLE_PROPS = VISIBLE_PEOPLE_PROPS.concat(['password']);
export default class People {
    static async all() {
        const people = await myDataSource.getRepository(Person)
            .createQueryBuilder('person')
            .select(VISIBLE_PEOPLE_PROPS)
            .getRawMany<Person>();

        return people;
    }
    static async getById(id: string, withPassword = false) {
        const person = await myDataSource.getRepository(Person)
            .createQueryBuilder('person')
            .select(withPassword ? ALL_PEOPLE_PROPS : VISIBLE_PEOPLE_PROPS)
            .where('person.id = :id', { id })
            .getRawOne<Person | null>();

        return person;
    }
    static async getByUsername(username: string, withPassword = false) {
        const person = await myDataSource.getRepository(Person)
            .createQueryBuilder('person')
            .select(withPassword ? ALL_PEOPLE_PROPS : VISIBLE_PEOPLE_PROPS)
            .where('person.username = :username', { username })
            .getRawOne<Person | null>();

        return person;
    }
    static async post(person: Omit<Person, 'id'>) {
        const id = await createId('person');

        const newPerson = myDataSource.getRepository(Person).create({
            id,
            ...person,
        });
        await myDataSource.getRepository(Person).save(newPerson);

        return await People.getById(id);
    }
    static async delete(id: string) {
        await myDataSource.getRepository(Person).delete({ id });
        return {};
    }
}
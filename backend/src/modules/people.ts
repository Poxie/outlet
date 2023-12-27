import { myDataSource } from "../app-data-source";
import { Person } from "../entity/person.entity";
import { createId } from "../utils";

export const VISIBLE_PEOPLE_PROPS = ['id', 'username'];
export default class People {
    static async all() {
        const people = await myDataSource.getRepository(Person)
            .createQueryBuilder('person')
            .select(VISIBLE_PEOPLE_PROPS)
            .getMany();

        return people;
    }
    static async getByUsername(username: string, withPassword = false) {
        const person = await myDataSource.getRepository(Person)
            .createQueryBuilder('person')
            .select(VISIBLE_PEOPLE_PROPS.concat(withPassword ? ['password'] : []))
            .where('person.username = :username', { username })
            .getOne();

        return person;
    }
    static async post(person: Omit<Person, 'id'>) {
        const id = await createId('people');

        const newPerson = myDataSource.getRepository(Person).create({
            id,
            ...person,
        });
        await myDataSource.getRepository(Person).save(newPerson);
        return newPerson;
    }
}
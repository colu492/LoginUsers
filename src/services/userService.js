import Repository from './Repository.js';
import PersistenceFactory from '../daos/persistenceFactory.js';

export default class UserService extends Repository {
  constructor() {
    // Obtener el DAO correspondiente para usuarios a través de la PersistenceFactory
    const userDao = PersistenceFactory.getPersistence();
    super(userDao);
  }

}


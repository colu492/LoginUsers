export default class Repository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        try {
            return await this.dao.getAll();
        } catch (error) {
            console.error('Error getting data from the repository:', error);
            throw new Error('Cannot get data from the repository.');
        }
    }

    async getById(id) {
        try {
            return await this.dao.getById(id);
        } catch (error) {
            console.error('Error getting data by ID from the repository:', error);
            throw new Error('Cannot get data by ID from the repository.');
        }
    }

    async create(data) {
        try {
            return await this.dao.save(data);
        } catch (error) {
            console.error('Error creating data in the repository:', error);
            throw new Error('Cannot create data in the repository.');
        }
    }

    async update(id, data) {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            console.error('Error updating data in the repository:', error);
            throw new Error('Cannot update data in the repository.');
        }
    }

    async delete(id) {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            console.error('Error deleting data from the repository:', error);
            throw new Error('Cannot delete data from the repository.');
        }
    }
}

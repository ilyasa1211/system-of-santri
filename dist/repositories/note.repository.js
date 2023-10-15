export default class NoteRepository {
    constructor(noteModel) {
        this.noteModel = noteModel;
    }
    findAll() {
        return this.noteModel.find().exec();
    }
    findById(id) {
        return this.noteModel.findById(id).exec();
    }
    insert(data) {
        return this.noteModel.create(data);
    }
    updateById(id, updateData) {
        return this.noteModel.findByIdAndUpdate(updateData).exec();
    }
    deleteById(id) {
        return this.noteModel.findByIdAndDelete(id).exec();
    }
    isExist(filter) {
        return this.noteModel.exists(filter).exec();
    }
}

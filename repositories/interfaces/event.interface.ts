export default interface EventInterface {
    findAll(): any;
    insert(data: any): any;
    updateById(id: string, data: any): any;
    isExist(id: string): any;
    deleteById(id: string): any;
}

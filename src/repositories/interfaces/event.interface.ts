export default interface EventInterface {
    findAll(): Promise<unknown>;
    insert(data: Record<string, unknown>): Promise<unknown>;
    updateById(id: string, data: Record<string, unknown>): Promise<unknown>;
    isExist(id: string): Promise<unknown>;
    deleteById(id: string): Promise<unknown>;
}

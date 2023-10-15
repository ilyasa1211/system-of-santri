import { Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import WorkRepository from "../repositories/work.repository";
import Work from "../models/work.model";
import WorkInterface from "../repositories/interfaces/work.interface";

export default class WorkController {
    private workRepository: WorkInterface;
    private apiResponse;
    public constructor() {
        this.workRepository = new WorkRepository(Work);
        this.apiResponse = ApiResponse;
    }
    public async index(request: Request, response: Response) {
        const works = await this.workRepository.findAll();

        return new this.apiResponse(response).ok({ works });
    }
    public async show(request: Request, response: Response) {
        const { workId } = request.params;
        const work = await this.workRepository.findById(workId);

        return new this.apiResponse(response).ok({ work });
    }
    public async insert(request: Request, response: Response) {
        const work = await this.workRepository.insert(request.body);

        return new this.apiResponse(response).created({ work });
    }
    public async update(request: Request, response: Response) {
        const { workId } = request.params;
        await this.workRepository.updateById(workId, request.body);

        return new this.apiResponse(response).updated(null, false);
    }
    public async destroy(request: Request, response: Response) {
        const { workId } = request.params;
        await this.workRepository.deleteById(workId);

        return new this.apiResponse(response).deleted(null, false);
    }
}

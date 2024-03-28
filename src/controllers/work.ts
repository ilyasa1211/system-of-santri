import { Request } from "express";
import ApiResponse from "../utils/api-response";
import WorkInterface from "../repositories/interfaces/work.interface";

export class WorkController {
  public constructor(
    private readonly workRepository: WorkInterface,
    private readonly apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    const works = await this.workRepository.findAll();

    return this.apiResponse.ok({ works });
  }
  public async show(request: Request) {
    const { workId } = request.params;
    const work = await this.workRepository.findById(workId);

    return this.apiResponse.ok({ work });
  }
  public async insert(request: Request) {
    const work = await this.workRepository.insert(request.body);

    return this.apiResponse.created({ work });
  }
  public async update(request: Request, workId: string) {
    await this.workRepository.updateById(workId, request.body);

    return this.apiResponse.updated(null);
  }
  public async destroy(request: Request, workId: string) {
    await this.workRepository.deleteById(workId);

    return this.apiResponse.deleted(null);
  }
}

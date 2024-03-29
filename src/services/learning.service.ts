import { Request } from "express";
import { NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import Learning from "../models/learning.model";
import LearningRepository from "../repositories/learning.repository";
import { deletePhoto } from "../utils/delete-photo";

export default class LearningService {
  public constructor(private repository: LearningRepository) {}

  public findAll() {
    return this.repository.findAll();
  }

  public async findId(learningId: string) {
    const learning = await this.repository.findById(learningId);
    if (!learning) {
      throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
    }
    return learning;
  }

  public async create(payload: Request["body"], file: Request["file"] | null) {
    if (file) {
      const { path } = file;
      payload.thumbnail = path.slice(path.indexOf("images"));
    }

    const learning = await this.repository.create(payload);

    return learning;
  }

  public async updateId(
    learningId: string,
    payload: Request["body"],
    file: Request["file"] | null,
  ) {
    if (file) {
      const { path } = file;
      // TODO: search for path images
      payload.thumbnail = path.slice(path.indexOf("images"));
    }

    const learning = await this.repository.findById(learningId);

    if (!learning) {
      throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
    }

    Object.assign(learning, payload);

    const updated = await learning.save();

    return updated;
  }

  public async deleteId(learningId: string) {
    const learning = await Learning.findById(learningId);

    if (!learning) {
      throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
    }

    const deleted = await learning.deleteOne();

    deletePhoto(learning.thumbnail);

    return deleted;
  }
}

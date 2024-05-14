/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { tmpdir } from 'os';
import { promisify } from 'util';
import Queue from 'bull/lib/queue';
import { v4 as uuidv4 } from 'uuid';
import {
  mkdir, writeFile, stat, existsSync, realpath,
} from 'fs';
import { join as joinPath } from 'path';
import { Request, Response } from 'express';
import { contentType } from'mime-types';
import mongoDBCore from'mongodb/lib/core';
import dbClient from '../utils/db';
import { getUserFromXToken } from '../utils/auth';

const VALID_FILE_TYPES = {
  folder: 'folder',
  file: 'file',
  image: 'image',
};

const ROOT_FOLDER_ID = 0;
const DEFAULT_ROOT_FOLDER = 'files_manager';
const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const statAsync = promisify(stat);
const realpathAsync = promisify(realpath);
const MAX_FILES_PER_PAGE = 20;
const fileQueue = new Queue('thumbnail generation');
const NULL_ID = Buffer.alloc(24, '0').toString('utf-8');

const isValidId = (id: string) => {
  //...
};

const errorResponse = (res: Response, error: string, statusCode: number) => {
  res.status(statusCode).json({ error });
};

class FilesController {
  static async postUpload(req: Request, res: Response) {
    const { user } = req;
    const name = req.body.name;
    const type = req.body.type;
    const parentId = req.body.parentId || ROOT_FOLDER_ID;
    const isPublic = req.body.isPublic || false;
    const base64Data = req.body.data;

    if (!name) {
      return errorResponse(res, 'Missing name', 400);
    }
    if (!type ||!Object.values(VALID_FILE_TYPES).includes(type)) {
      return errorResponse(res, 'Missing type', 400);
    }
    if (!base64Data && type!== VALID_FILE_TYPES.folder) {
      return errorResponse(res, 'Missing data', 400);
    }
    //...
  }

  static async getShow(req: Request, res: Response) {
    const { user } = req;
    const id = req.params.id;
    const userId = user._id.toString();
    const file = await dbClient.filesCollection().findOne({
      _id: new mongoDBCore.BSON.ObjectId(isValidId(id)? id : NULL_ID),
      userId: new mongoDBCore.BSON.ObjectId(isValidId(userId)? userId : NULL_ID),
    });

    if (!file) {
      return errorResponse(res, 'Not found', 404);
    }
    res.status(200).json({
      id,
      userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId === ROOT_FOLDER_ID.toString()? 0 : file.parentId.toString(),
    });
  }

  static async getIndex(req: Request, res: Response) {
    const { user } = req;
    const parentId = req.query.parentId || ROOT_FOLDER_ID.toString();
    const page = /\d+/.test((req.query.page || '').toString())? Number.parseInt(req.query.page, 10) : 0;
    const filesFilter = {
      userId: user._id,
      parentId: parentId === ROOT_FOLDER_ID.toString()? parentId : new mongoDBCore.BSON.ObjectId(isValidId(parentId)? parentId : NULL_ID),
    };

    const files = await dbClient.filesCollection().aggregate([
      { $match: filesFilter },
      { $sort: { _id: -1 } },
      { $skip: page * MAX_FILES_PER_PAGE },
      { $limit: MAX_FILES_PER_PAGE },
      {
        $project: {
          _id: 0,
          id: '$_id',
          userId: '$userId',
          name: '$name',
          type: '$type',
          isPublic: '$isPublic',
          parentId: {
            $cond: { if: { $eq: ['$parentId', '0'] }, then: 0, else: '$parentId' },
          },
        },
      },
    ]).toArray();
    res.status(200).json(files);
  }

  static async putPublish(req: Request, res: Response) {
    const { user } = req;
    const { id } = req.params;
    const userId = user._id.toString();
    const fileFilter = {
      _id: new mongoDBCore.BSON.ObjectId(isValidId(id)? id : NULL_ID),
      userId: new mongoDBCore.BSON.ObjectId(isValidId(userId)? userId : NULL_ID),
    };
    const file = await dbClient.filesCollection().findOne(fileFilter);

    if (!file) {
      return errorResponse(res, 'Not found', 404);
    }
    await dbClient.filesCollection().updateOne(fileFilter, { $set: { isPublic: true } });
    res.status(200).json({
      id,
      userId,
      name: file.name,
      type: file.type,
      isPublic: true,
      parentId: file.parentId === ROOT_FOLDER_ID.toString()? 0 : file.parentId.toString(),
    });
  }

  static async putUnpublish(req: Request, res: Response) {
    const { user } = req;
    const { id } = req.params;
    const userId = user._id.toString();
    const fileFilter = {
      _id: new mongoDBCore.BSON.ObjectId(isValidId(id)? id : NULL_ID),
      userId: new mongoDBCore.BSON.ObjectId(isValidId(userId)? userId : NULL_ID),
    };
    const file = await dbClient.filesCollection().findOne(fileFilter);

    if (!file) {
      return errorResponse(res, 'Not found', 404);
    }
    await dbClient.filesCollection().updateOne(fileFilter, { $set: { isPublic: false } });
    res.status(200).json({
      id,
      userId,
      name: file.name,
      type: file.type,
      isPublic: false,
      parentId: file.parentId === ROOT_FOLDER_ID.toString()? 0 : file.parentId.toString(),
    });
  }

  static async getFile(req: Request, res: Response) {
    const user = await getUserFromXToken(req);
    const { id } = req.params;
    const userId = user? user._id.toString() : '';
    const fileFilter = {
      _id: new mongoDBCore.BSON.ObjectId(isValidId(id)? id : NULL_ID),
    };
    const file = await dbClient.filesCollection().findOne(fileFilter);

    if (!file || (!file.isPublic && (file.userId.toString()!== userId))) {
      return errorResponse(res, 'Not found', 404);
    }
    if (file.type === VALID_FILE_TYPES.folder) {
      return errorResponse(res, 'A folder doesn\'t have content', 400);
    }
    const filePath = file.localPath;
    if (existsSync(filePath)) {
      const fileInfo = await statAsync(filePath);
      if (!fileInfo.isFile()) {
        return errorResponse(res, 'Not found', 404);
      }
    } else {
      return errorResponse(res, 'Not found', 404);
    }
    const absoluteFilePath = await realpathAsync(filePath);
    res.setHeader('Content-Type', contentType(file.name) || 'text/plain; charset=utf-8');
    res.status(200).sendFile(absoluteFilePath);
  }
}

export default FilesController;

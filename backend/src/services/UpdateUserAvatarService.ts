import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

export default class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);
    if (!user) {
      throw new Error('Only authenticated users can change avatar');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        avatarFileName,
      );
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFileName;
    await usersRepository.save(user);

    return user;
  }
}
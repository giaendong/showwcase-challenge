import { Request, Response } from "express";
import { UserRepository } from "services/repositories";

const handler = (req: Request, res: Response) => {

  const getOrCreateUserByName = async () => {
    if (!req.query.name) {
      return res.status(400).end('Bad Request')
    }
    const user = await UserRepository.getOrCreateUserByName(req.query.name as string)
    return res.status(200).json(user);
  }

  const updateUser = async () => {
    try {
      if (!req.query.name) {
        return res.status(400).end('Bad Request')
      }
      const user = await UserRepository.update(req.query.name.toString(), req.body);
      return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  }

  switch (req.method) {
    case 'GET':
      return getOrCreateUserByName();
    case 'PUT':
      return updateUser();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler;
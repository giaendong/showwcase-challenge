import { Request, Response } from "express";
import { SchoolRepository } from "services/repositories";

const handler = (req: Request, res: Response) => {

  const getSchoolList = async () => {
    if (!req.query.name) {
      return res.status(400).end('Bad Request')
    }
    const schools = await SchoolRepository.getSchoolList(req.query.name as string)
    return res.status(200).json(schools);
  }

  switch (req.method) {
    case 'GET':
      return getSchoolList();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler;
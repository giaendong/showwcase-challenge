import { schoolApiHost } from 'config';
import { SchoolProps,} from 'constants/types';

async function getSchoolDb(name: string): Promise<SchoolProps[]> {
  try {
    const res: SchoolProps[] = await fetch(`${schoolApiHost}/search?name=${name}`)
    .then(response => response.json())
    .then(data => data);
    return res;
  } catch (error: unknown) {
    throw error;
  }
}

export const getSchoolList = async (name: string): Promise<SchoolProps[]> => {
  const schools = await getSchoolDb(name);
  return schools;
};

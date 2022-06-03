import { ErrorType, UserProps, UserSchoolProps } from 'constants/types';
import { dbFileHost, dbSecretKey } from 'config';

async function getUserDb(): Promise<UserProps[]> {
  try {
    const res: UserProps[] = await fetch(dbFileHost, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-Master-Key': `${dbSecretKey}`,
        'X-Bin-Meta': 'false'
      },
    })
    .then(response => response.json())
    .then(data => data);
    return res;
  } catch (error: unknown) {
    throw error;
  }
}

async function updateUserDb(params: UserProps[]): Promise<UserProps[]> {
  try {
    const res: UserProps[] = await fetch(dbFileHost, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-key': `${dbSecretKey}`,
      },
      body: JSON.stringify(params),
    })
    .then(response => response.json())
    .then(data => data);
    return res;
  } catch (error: unknown) {
    throw error;
  }
}

export const getOrCreateUserByName = async (name: string): Promise<UserProps> => {
  const users = await getUserDb();
  const userFound = users.find((user: UserProps) => user.name === name);
  if (!userFound) {
    const newUser = {
      name,
      educations: []
    };
    users.push(newUser);
    await updateUserDb(users);
    return newUser
  }
  return userFound;
};

export const update = async (name: string, educations: UserSchoolProps[]): Promise<UserProps | ErrorType> => {
  const users = await getUserDb();
  const newValue = [...users]
  const userFound = newValue.findIndex((user: UserProps) => user.name === name);
  if (userFound === -1) {
    throw {code: 404, message: "User not found"}
  }
  newValue[userFound].educations = [...educations];
  await updateUserDb(newValue);
  return newValue[userFound];
};
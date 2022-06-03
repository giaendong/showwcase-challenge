import fs from 'fs';
import { ErrorType, UserProps, UserSchoolProps } from 'constants/types';
import users from 'public/users.json';

const userDb: UserProps[] = users;

const saveData = async () => await fs.writeFileSync('public/users.json', JSON.stringify(users));

export const getOrCreateUserByName = (name: string): UserProps => {
  const userFound = userDb.find((user: UserProps) => user.name === name);
  if (!userFound) {
    const newUser = {
      name,
      educations: []
    };
    userDb.push(newUser);
    saveData();
    return newUser
  }
  return userFound;
};

export const update = (name: string, educations: UserSchoolProps[]): UserProps | ErrorType => {
  const userFound = userDb.find((user: UserProps) => user.name === name);
  if (!userFound) {
    throw {code: 404, message: "User not found"}
  }
  const payload = {
    name,
    educations
  };
  Object.assign(userFound, payload);
  saveData()
  return userFound;
};
import { apiHost } from 'config';
import { SchoolProps } from 'constants/types';
import {fetchWrapper} from 'helpers';

const baseUrl = `${apiHost}/users`;

const getOrCreateUserByName = (name: string) => {
    return fetchWrapper.get(`${baseUrl}/${name}`);
}

const update = (name: string, params: SchoolProps[] | []) => {
    return fetchWrapper.put(`${baseUrl}/${name}`, params);
}

export const userService = {
  getOrCreateUserByName,
  update,
};

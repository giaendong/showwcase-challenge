import { apiHost } from 'config';
import { ErrorType, UpdateUserParams, UpdateUserResponse } from 'constants/types';
import {
  UseBaseMutationResult,
  useMutation,
  UseMutationOptions,
} from 'react-query';

type Params = UpdateUserParams;
type Response = UpdateUserResponse;

async function execute(params: Params): Promise<Response> {
  try {
    const res: Response = await fetch(`${apiHost}/users/${params.name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params.educations)
    })
    .then(response => response.json())
    .then(data => {
      return {
        ok: true,
        user: data
      }
    });
    return res;
  } catch (error: unknown) {
    throw error;
  }
}

export default function useUpdateUser(
  options: UseMutationOptions<Response, ErrorType, Params, unknown>,
): UseBaseMutationResult<Response, ErrorType, Params, unknown> {
  return useMutation((params: Params) => {
    return execute(params);
  }, options);
}

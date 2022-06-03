export type UserProps = {
  name: string;
  educations?: UserSchoolProps[];
}

export type GetOrCreateUserParams = {
  name: string;
}

export type GetOrCreateUserResponse = {
  ok: boolean;
  user: UserProps;
}

export type UpdateUserParams = {
  name: string;
  educations?: UserSchoolProps[] | [];
}

export type UpdateUserResponse = {
  ok: boolean;
  user: UserProps;
}

export type SchoolProps = {
  name: string;
  alpha_two_code?: string;
  domains?: string[];
  country?: string;
  web_pages?: string[];
}

export type UserSchoolProps = {
  schools: SchoolProps;
  degree?: string;
  field_of_study?: string;
  start_year?: string;
  end_year?: string;
  end_year_expected?: string;
  description?: string;
}

export type SearchSchoolNameParams = {
  name: string;
}

export type SearchSchoolNameResponse = {
  ok: boolean;
  schools: SchoolProps[] | [];
}

export type ErrorType = {
  code: number;
  message: string;
};
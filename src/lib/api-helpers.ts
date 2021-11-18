import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from './get-current-user';

export async function fetchGetJSON(url: string) {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (_err) {
    const err: Error = _err as Error;
    throw new Error(err.message);
  }
}

export async function easyGetAll(
  req: NextApiRequest,
  res: NextApiResponse,
  obj: any
) {
  try {
    const user = getCurrentUser();
    const result = await obj.readMany(user._id);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function fetchPostJSON(url: string, data?: {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (_err) {
    const err: Error = _err as Error;
    throw new Error(err.message);
  }
}

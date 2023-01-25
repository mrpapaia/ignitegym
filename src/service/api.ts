import { getStoragedToken, storageToken } from "@storage/storegeToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosInstance } from "axios";

type PromisseType = {
  resolve: (value?: unknown) => void;
  reject: (reason: unknown) => void;
};

type SignOut = () => void;

type ApiInstanceprops = AxiosInstance & {
  registerInterpectorTokenManager: (signOut: SignOut) => () => void;
};

type ProcessQueueProps = {
  error: Error | null;
  token: string | null;
};
const api = axios.create({
  baseURL: "http://192.168.0.40:3333",
}) as ApiInstanceprops;

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<PromisseType> = [];

const processeQueue = ({ error, token = null }: ProcessQueueProps) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

api.registerInterpectorTokenManager = (signOut) => {
  const interpectorTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const currentToken = await getStoragedToken();
          if (!currentToken) {
            signOut();
            return Promise.reject(requestError);
          }
          const request = requestError.config;
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                request.headers["Authorization"] = `Bearer ${token}`;
                return axios(request);
              })
              .catch((error) => {
                throw error;
              });
          }
          isRefreshing = true;
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                token: currentToken,
              });
              await storageToken(data.token);
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;
              request.headers["Authorization"] = `Bearer ${data.token}`;

              processeQueue({ error: null, token: data.token });
              resolve(request);
            } catch (error: any) {
              processeQueue({ error: error, token: null });
              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
            }
          });
        }
        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      }
      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interpectorTokenManager);
  };
};

export { api };

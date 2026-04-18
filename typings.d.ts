import 'axios';

declare module 'axios' {
  export interface AxiosInstance extends Axios {
    <T = any, D = any>(
      config: AxiosRequestConfig<D>,
    ): Promise<T>;

    <T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;

    create(config?: CreateAxiosDefaults): AxiosInstance;
    defaults: Omit<AxiosDefaults, "headers"> & {
      headers: HeadersDefaults & {
        [key: string]: AxiosHeaderValue;
      };
    };
  }
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { useMemoizedFn, useRequest } from 'ahooks';
import { userConfig as userConfigApi, type LF } from '../../../services/lf';

export function useUserConfig() {
  const {
    data: config,
    loading,
    refresh,
  } = useRequest(userConfigApi.userConfigControllerGetConfig);

  const updateConfig = useMemoizedFn(async (body: LF.UpdateUserConfigDto) => {
    await userConfigApi.userConfigControllerUpdateConfig(body);
    refresh();
  });

  const resetConfig = useMemoizedFn(async () => {
    await userConfigApi.userConfigControllerResetConfig();
    refresh();
  });

  return { config, loading, updateConfig, resetConfig };
}

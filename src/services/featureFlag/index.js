import { AppConfigurationClient } from '@azure/app-configuration';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { FEATUREFLAG } from './../../redux/constants/apiUrl'
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const client = new AppConfigurationClient(process.env.REACT_APP_AZURE_FEATURE_FLAG);

/**
 * Retrieves the specified feature flag from Azure App Configuration.
 * @param {string} flagKey App Config Feature Flag key
 * @returns the feature flag for the specified key
 */
const createHeader = {
  "wa-clientId": CLIENT_ID,
  "wa-requestId": uuidv4(),
};
const useFeatureFlag = (flagKey = '') => {
  const [enabled, setEnabled] = useState(false);
  const [flagLoading, setFeatureFlag] = useState(false);

  useMemo(async () => {
    if (!flagKey || !flagKey.toString().trim().length) {
      console.error('A feature flag key must be supplied.');
    } else {
      setFeatureFlag(true)
      fetch(`${FEATUREFLAG}/${flagKey}`, { headers: createHeader }).then(data => data.json()).then(res => {
        setEnabled(res)
        setFeatureFlag(false)
      }).catch(_err => {
        setFeatureFlag(false)
      })
    }
  }, [flagKey]);

  return {
    enabled,
    flagLoading
  };
};

/**
 * Retrieves the specified configuration from Azure App Configuration.
 * @param {string} configKey App Config Key
 * @returns the configuration for the specified key
 */
const useConfiguration = (configKey = '') => {
  const [config, setConfig] = useState('');

  useMemo(async () => {
    if (!configKey || !configKey.toString().trim().length) {
      console.error('A config key must be supplied.');
    } else {
      try {
        const result = await client.getConfigurationSetting({ key: configKey.toString().trim() });
        if (result) {
          setConfig(result.value);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [configKey]);

  return { config };
};

export { useFeatureFlag, useConfiguration };
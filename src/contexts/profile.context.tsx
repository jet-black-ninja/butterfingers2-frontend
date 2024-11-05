import { GetHistory, GetProfile, PostCustomize } from '@/api/profile';
import { CaretStyleType, ThemeType } from '@/data/types';
import { TypingResult } from '@/types';
import { createContext, useEffect, useState } from 'react';
import { OauthFinalStepsModalOptions } from './modalContext/components/OAuthFinalStepsModal/OAuthFinalStepsModal';
import { ISOToDate } from '@/helpers';
import { TypingCompleted, TypingStarted } from '@/api/typing';

interface CustomizeBooleans {
  liveWpm: boolean;
  liveAccuracy: boolean;
  smoothCaret: boolean;
  soundOnClick: boolean;
}
export interface ICustomize extends CustomizeBooleans {
  inputWidth: number;
  fontSize: number;
  caretStyle: CaretStyleType;
  theme: ThemeType;
}

const customizeInitial: ICustomize = {
  liveWpm: false,
  liveAccuracy: false,
  inputWidth: 90,
  fontSize: 32,
  caretStyle: 'line',
  smoothCaret: true,
  soundOnClick: false,
  theme: 'default',
};

type StatsAverageType = {
  wpm: number;
  accuracy: number;
  raw: number;
};
export interface IProfile {
  username: string;
  customize: ICustomize;
  stats: {
    testsStarted?: number;
    testsCompleted?: number;
    average?: StatsAverageType;
    highest?: StatsAverageType;
  };
  history: { items: Record<number, TypingResult[]>; totalPages: number };
  isOAuth: boolean;
}

interface Context {
  profile: IProfile;
  loadingUser: boolean;
  oauthFinalSteps: OauthFinalStepsModalOptions['platform'] | null;
  onOauthFinalStepsComplete: (username: string) => void;
  onLoadProfileData: () => void;
  onLoadHistory: (...args: Parameters<typeof GetHistory>) => void;
  onCustomizeUpdateState: (updatedProperties: Partial<ICustomize>) => void;
  onCustomizeToggleState: (property: keyof CustomizeBooleans) => void;
  onCustomizeResetState: () => void;
  onCustomizeUpdateServer: () => void;
  onTestsStartedUpdate: () => void;
  onTestsCompletedUpdate: (result: TypingResult) => void;
  onUpdateUsername: (username: string) => void;
  onClearHistory: () => void;
  onResetStats: () => void;
  onLogOut: () => void;
}

const initial: Context = {
  profile: {
    username: '',
    customize: customizeInitial,
    stats: {
      testsStarted: 0,
      testsCompleted: 0,
    },
    history: {
      items: {},
      totalPages: 0,
    },
    isOAuth: false,
  },
  loadingUser: false,
  oauthFinalSteps: null,
  onOauthFinalStepsComplete: () => {},
  onLoadProfileData: () => {},
  onLoadHistory: () => {},
  onCustomizeUpdateState: () => {},
  onCustomizeToggleState: () => {},
  onCustomizeResetState: () => {},
  onCustomizeUpdateServer: () => {},
  onTestsStartedUpdate: () => {},
  onTestsCompletedUpdate: () => {},
  onUpdateUsername: () => {},
  onClearHistory: () => {},
  onResetStats: () => {},
  onLogOut: () => {},
};
export const ProfileContext = createContext(initial);
let historyAbortController: AbortController;
let customizeServerLatest: ICustomize;
export function ProfileContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [oauthFinalSteps, setOAuthFinalSteps] = useState(
    initial.oauthFinalSteps
  );
  const [profile, setProfile] = useState(initial.profile);
  const [loadingUser, setLoadingUser] = useState(initial.loadingUser);

  useEffect(() => {
    setProfile(state => {
      const localStorageCustomize = localStorage.getItem('customize');
      if (!localStorageCustomize) return state;
      return { ...state, customize: JSON.parse(localStorageCustomize) };
    });
    setLoadingUser(true);
    onLoadProfileData();
  });

  useEffect(() => {
    localStorage.setItem('customize', JSON.stringify(profile.customize));
  }, [profile.customize]);

  const onLoadProfileData: Context['onLoadProfileData'] = () => {
    GetProfile().then((data: any) => {
      const filteredData: any = {};
      Object.keys(data).forEach(key => {
        if (
          data[key].constructor.name === 'Object' &&
          Object.keys(data[key].length === 0)
        ) {
          return;
        }
        filteredData[key] = data[key];
      });
    });
  };

  const onLoadHistory: Context['onLoadHistory'] = (page, limit) => {
    historyAbortController?.abort();
    historyAbortController = new AbortController();
    GetHistory(page, limit, historyAbortController).then((data: any) => {
      setProfile(state => ({
        ...state,
        history: {
          items: {
            ...state.history.items,
            [data.currentPage]: data.items.map((result: any) => ({
              ...result,
              date: ISOToDate(result.date),
            })),
          },
          totalPages: data.totalPages,
        },
      }));
    });
  };

  const onCustomizeUpdateServer: Context['onCustomizeUpdateServer'] = () => {
    let update: Partial<ICustomize> = {};
    const keys = Object.keys(profile.customize) as (keyof ICustomize)[];
    if (!customizeServerLatest) {
      update = profile.customize;
    } else {
      keys.forEach(key => {
        if (
          customizeServerLatest[key] === undefined ||
          profile.customize[key] !== customizeServerLatest[key]
        ) {
          Object.assign(update, { [key]: profile.customize[key] });
        }
      });
    }
    if (Object.keys(update).length !== 0) {
      PostCustomize(update);
      customizeServerLatest = { ...profile.customize, ...update };
    }
  };

  const onCustomizeUpdateState: Context['onCustomizeUpdateState'] =
    updatedProperties => {
      setProfile(state => ({
        ...state,
        customize: { ...state.customize, ...updatedProperties },
      }));
    };

  const onCustomizeToggleState: Context['onCustomizeToggleState'] =
    property => {
      setProfile(state => ({
        ...state,
        customize: {
          ...state.customize,
          [property]: !state.customize[property],
        },
      }));
    };

  const onCustomizeResetState: Context['onCustomizeResetState'] = () => {
    setProfile(state => ({
      ...state,
      customize: customizeInitial,
    }));
  };

  const onTestsStartedUpdate: Context['onTestsStartedUpdate'] = () => {
    TypingStarted();
    setProfile(state => ({
      ...state,
      stats: {
        ...state.stats,
        testsStarted: (state.stats.testsStarted || 0) + 1,
      },
    }));
  };

  const onTestsCompletedUpdate: Context['onTestsCompletedUpdate'] = result => {
    if (!profile.username) {
      return;
    }
    TypingCompleted(result);
    const resultLatest = result.timeline[result.timeline.length - 1];

    setProfile(state => {
      const statsAverageKeys = [
        'wpm',
        'accuracy',
        'raw',
      ] as (keyof StatsAverageType)[];
      const average = { ...state.stats.average } as StatsAverageType;
      const highest = { ...state.stats.highest } as StatsAverageType;
      statsAverageKeys.forEach(key => {
        //average
        const keyAverage =
          (state.stats.average && state.stats.average[key]) || 0;
        const testsCompleted = state.stats.testsCompleted || 0;
        average[key] = Number(
          (
            (keyAverage * testsCompleted + resultLatest[key]) /
            (testsCompleted + 1)
          ).toFixed(2)
        );
        //highest
        const keyHighest =
          (state.stats.highest && state.stats.highest[key]) || 0;
        if (keyHighest < resultLatest[key]) {
          highest[key] = resultLatest[key];
        }
      });
      return {
        ...state,
        stats: {
          ...state.stats,
          testsCompleted: (state.stats.testsCompleted || 0) + 1,
          average,
          highest,
        },
        history: initial.profile.history,
      };
    });
  };

  const onLogOut: Context['onLogOut'] = () => {
    setProfile(state => ({ ...initial.profile, customize: state.customize }));
  };

  const onUpdateUsername: Context['onUpdateUsername'] = username => {
    setProfile(state => ({
      ...state,
      username,
    }));
  };

  const onClearHistory: Context['onClearHistory'] = () => {
    setProfile(state => ({
      ...state,
      history: initial.profile.history,
    }));
  };
  const onResetStats: Context['onResetStats'] = () => {
    setProfile(state => ({ ...state, stats: initial.profile.stats }));
  };
  const onOauthFinalStepsComplete: Context['onOauthFinalStepsComplete'] =
    username => {
      setOAuthFinalSteps(null);
      setProfile(state => ({
        ...state,
        username,
        isOAuth: true,
      }));
      onUpdateUsername(username);
    };
  return (
    <ProfileContext.Provider
      value={{
        profile,
        loadingUser,
        oauthFinalSteps,
        onOauthFinalStepsComplete,
        onLoadProfileData,
        onLoadHistory,
        onCustomizeUpdateState,
        onCustomizeToggleState,
        onCustomizeResetState,
        onCustomizeUpdateServer,
        onLogOut,
        onTestsStartedUpdate,
        onUpdateUsername,
        onClearHistory,
        onResetStats,
        onTestsCompletedUpdate,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

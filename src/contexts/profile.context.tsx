import { CaretStyleType, ThemeType } from '@/data/types';
import { TypingResult } from '@/types';
//TODO complete
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
  smoothCaret: false,
  soundOnClick: true,
  theme: 'default',
  inputWidth: 90,
  fontSize: 32,
  caretStyle: 'line',
};

type StatsAverageType = {
  wpm: number;
  accuracy: number;
  raw: number;
};
export interface IProfile{
    username: string;
    customize: ICustomize;
    stats: {
        testsStarted: number;
        testsCompleted: number;
        average: StatsAverageType;
        highest: StatsAverageType;
    };
    history: { items: Record<number, TypingResult[]>; totalPages: number };
    isOAuth: boolean;
}

interface Context {
    profile: IProfile;
    loadingUser: boolean;
    oauthFinalSteps: OAuthFinalStepsModalOption['platform'] | null;
  onOauthFinalStepsComplete: (username: string) => void;
  onLoadProfileData: () => void;
  onLoadHistory: (..args: Parameters<typeof GetHistory >) => void;
}
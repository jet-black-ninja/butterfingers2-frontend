import { useContext, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Tooltip as RechartsTooltip,
  Legend,
  Line,
} from 'recharts';
import { TypingContext } from '@/contexts/typing.context';
import { TypingResult } from '@/types';
import { addColorOpacity, getTimeSince } from '@/helpers';
import { IconKeyboardArrowLeft, IconLoop } from '@/assets/image';
import { ButtonRounded, Tooltip } from '@/components/UI';
import PercentCircleChart from '@/components/UI/PercentCircleChart/PercentCircleChart';
import ResultCustomTooltip from '../ResultCustomTooltip/ResultCustomTooltip';
import styles from './Result.module.scss';

export type ResultOptions = {
  includeDate?: boolean;
};
interface Props extends ResultOptions {
  result: TypingResult;
  onRestart?: () => void;
  onRepeat?: () => void;
  onGoBack?: () => void;
}
export default function Result(props: Props) {
  const { result, includeDate, onRestart, onRepeat, onGoBack } = props;

  const { onTypingEnded } = useContext(TypingContext);

  useEffect(() => {
    onTypingEnded();
  }, [onTypingEnded]);

  const textColorFromCSS = window
    .getComputedStyle(document.body)
    .getPropertyValue('--clr-text');
  const config = {
    colorWpm: textColorFromCSS,
    colorAccuracy: window
      .getComputedStyle(document.body)
      .getPropertyValue('--clr-char-incorrect'),
    colorRaw: addColorOpacity(textColorFromCSS, 0.6),
    labelOffset: -40,
    labelFontSize: 14,
  };

  const {
    wpm,
    raw,
    accuracy,
    second: timeTook,
  } = result.timeline[result.timeline.length - 1];
  return (
    <div className={styles['result__wrapper']}>
      {includeDate && result.date && (
        <Tooltip text={result.date.toLocaleString()} position="top" showOnHover>
          <div className={styles.date}>{getTimeSince(result.date)}</div>
        </Tooltip>
      )}
      <div className={styles.result}>
        <div className={styles['wpm-accuracy-container']}>
          <div className={styles.wpm}>
            <p>WPM</p>
            <p className={styles['wpm__num']}>{wpm}</p>
          </div>
          <div className={styles.accuracy}>
            <p>Accuracy</p>
            <PercentCircleChart
              percentage={accuracy}
              className={styles['percentage-circle']}
            />
          </div>
        </div>
        <div className={styles.chart}>
          <ResponsiveContainer className={styles.chart}>
            <LineChart data={result.timeline}>
              <XAxis dataKey="second" />
              <YAxis dataKey="raw" yAxisId="left">
                <Label
                  value="Words per Minute"
                  angle={-90}
                  fill={config.colorWpm}
                  fontSize={config.labelFontSize}
                  position="right"
                  offset={config.labelOffset}
                  className={styles.label}
                />
              </YAxis>
              <YAxis
                domain={[0, 100]}
                dataKey="accuracy"
                yAxisId="right"
                orientation="right"
              >
                <Label
                  value="Accuracy"
                  angle={-90}
                  fill={config.colorAccuracy}
                  fontSize={config.labelFontSize}
                  position="left"
                  offset={config.labelOffset}
                  className={styles.label}
                />
              </YAxis>
              <CartesianGrid className={styles.cartesianGrid} />
              <RechartsTooltip content={<ResultCustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="wpm"
                yAxisId="left"
                dot={{
                  stroke: config.colorWpm,
                  strokeWidth: 5,
                  r: 1,
                }}
                strokeWidth={2}
                stroke={config.colorWpm}
              />
              <Line
                type="monotone"
                dataKey="raw"
                yAxisId="left"
                strokeWidth={2}
                dot={{
                  stroke: config.colorRaw,
                  strokeWidth: 5,
                  r: 1,
                }}
                stroke={config.colorRaw}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                yAxisId="right"
                strokeWidth={2}
                dot={{
                  stroke: config.colorAccuracy,
                  strokeWidth: 5,
                  r: 1,
                }}
                stroke={config.colorAccuracy}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={styles['more-and-restart']}>
        <div className={styles.more}>
          {result.testType && (
            <div className={styles.item}>
              <p
                className={`${styles['item__heading']} ${styles['raw-heading']}`}
              >
                Test Type
              </p>
              <p className={styles['item-value']}>{result.testType}</p>
            </div>
          )}
          <div className={styles.item}>
            <p
              className={`${styles['item__heading']} ${styles['raw-heading']}`}
            >
              Raw
            </p>
            <p className={styles['item_value']}>{raw}</p>
          </div>
          <div className={styles.item}>
            <p
              className={`${styles['item__heading']} ${styles['error-heading']} ${result.errors === 0 && styles['error-heading--noerrors']}`}
            >
              Errors
            </p>
            <p className={styles['item_value']}>{result.errors}</p>
          </div>
          <div className={styles.item}>
            <p className={styles['item__heading']}>Time Took</p>
            <p className={styles['item__value']}>{timeTook}s</p>
          </div>
          {result.quoteAuthor && (
            <div className={styles.item}>
              <p className={styles['item__heading']}>Quote Author</p>
              <p
                className={`${styles['item__value']} ${styles['quote-author-value']}`}
              >
                {result.quoteAuthor}
              </p>
            </div>
          )}
        </div>
        <div className={styles['buttons-wrapper']}>
          {onRestart && (
            <ButtonRounded onClick={onRestart} className={styles.btn}>
              <IconKeyboardArrowLeft
                className={`${styles['btn__icon']} ${styles['btn__icon--arrow']}`}
              />
              <span>Next Test</span>
            </ButtonRounded>
          )}
          {onRepeat && (
            <ButtonRounded onClick={onRepeat} className={styles.btn}>
              <IconLoop className={styles['btn__icon']} />
              <span>Repeat</span>
            </ButtonRounded>
          )}
          {onGoBack && (
            <ButtonRounded onClick={onGoBack} className={styles.btn}>
              <IconKeyboardArrowLeft
                className={`${styles['btn__icon']} ${styles['btn__icon--arrow']}`}
              />
              <span>Go Back</span>
            </ButtonRounded>
          )}
        </div>
      </div>
    </div>
  );
}

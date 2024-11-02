import { createContext, useEffect, useState } from 'react';
import { getQuoteTagList } from '@/services/quotable';
import { QuoteLengthType } from '@/types';
import { useLocalStorageState } from '@/hooks';
import { TypemodeTime, TypemodeType, TypemodeWords } from '@/data/types';



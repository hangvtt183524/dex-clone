import { TokenList } from 'config/types/lists';

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null;
      readonly pendingUpdate: TokenList | null;
      readonly loadingRequestId: string | null;
      readonly error: string | null;
    };
  };
  readonly lastInitializedDefaultListOfLists?: string[];

  // currently active lists
  readonly activeListUrls: string[] | undefined;
}

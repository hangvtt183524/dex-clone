import Ajv from 'ajv';
import uriToHttp from 'utils/uriToHttp';
import { TokenList } from 'config/types/lists';
import { TOKEN_LIST_SCHEMA } from 'config/lists';
import { TokenInfo } from '@uniswap/token-lists';
import { remove } from 'lodash';

const tokenListValidator = new Ajv({ allErrors: true }).compile(TOKEN_LIST_SCHEMA);

export default async function getTokenList(listUrl: string): Promise<TokenList> {
  const urls: string[] = uriToHttp(listUrl);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const isLast = i === urls.length - 1;
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.error('Failed to fetch list', listUrl, error);
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    const json = await response.json();
    if (json.tokens) {
      remove<TokenInfo>(json.tokens, (token) => {
        return token.symbol ? token.symbol.length === 0 : true;
      });
    }
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${(error as any).dataPath} ${error.message ?? ''}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, '') ?? 'unknown error';
      throw new Error(`Token list failed validation: ${validationErrors}`);
    }
    return json as TokenList;
  }
  throw new Error('Unrecognized list URL protocol.');
}

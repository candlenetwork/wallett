import { fireEvent, render } from '@testing-library/react-native'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import { Provider } from 'react-redux'
import AppAnalytics from 'src/analytics/AppAnalytics'
import { TokenBottomSheetEvents } from 'src/analytics/Events'
import TokenBottomSheet, {
  DEBOUNCE_WAIT_TIME,
  TokenBottomSheetProps,
  TokenPickerOrigin,
} from 'src/components/TokenBottomSheet'
import { TokenBalance } from 'src/tokens/slice'
import { NetworkId } from 'src/transactions/types'
import { createMockStore } from 'test/utils'
import {
  mockCeurAddress,
  mockCeurTokenId,
  mockCusdAddress,
  mockCusdTokenId,
  mockTestTokenAddress,
  mockTestTokenTokenId,
} from 'test/values'

jest.mock('src/analytics/AppAnalytics')

const tokens: TokenBalance[] = [
  {
    balance: new BigNumber('10'),
    priceUsd: new BigNumber('1'),
    lastKnownPriceUsd: new BigNumber('1'),
    symbol: 'cUSD',
    address: mockCusdAddress,
    tokenId: mockCusdTokenId,
    networkId: NetworkId['celo-alfajores'],
    isFeeCurrency: true,
    canTransferWithComment: true,
    priceFetchedAt: Date.now(),
    decimals: 18,
    name: 'CNDL Dollar',
    imageUrl: '',
  },
  {
    balance: new BigNumber('20'),
    priceUsd: new BigNumber('1.2'),
    lastKnownPriceUsd: new BigNumber('1.2'),
    symbol: 'cEUR',
    address: mockCeurAddress,
    tokenId: mockCeurTokenId,
    networkId: NetworkId['celo-alfajores'],
    isFeeCurrency: true,
    canTransferWithComment: true,
    priceFetchedAt: Date.now(),
    decimals: 18,
    name: 'CNDL Euro',
    imageUrl: '',
  },
  {
    balance: new BigNumber('10'),
    symbol: 'TT',
    priceUsd: null,
    lastKnownPriceUsd: new BigNumber('1'),
    address: mockTestTokenAddress,
    tokenId: mockTestTokenTokenId,
    networkId: NetworkId['celo-alfajores'],
    priceFetchedAt: Date.now(),
    decimals: 18,
    name: 'Test Token',
    imageUrl: '',
  },
]

const mockStore = createMockStore({
  tokens: {
    tokenBalances: {
      [mockCusdTokenId]: {
        balance: '10',
        priceUsd: '1',
        symbol: 'cUSD',
        address: mockCusdAddress,
        tokenId: mockCusdTokenId,
        networkId: NetworkId['celo-alfajores'],
        isFeeCurrency: true,
        priceFetchedAt: Date.now(),
        name: 'CNDL Dollar',
      },
      [mockCeurTokenId]: {
        balance: '20',
        priceUsd: '1.2',
        symbol: 'cEUR',
        address: mockCeurAddress,
        tokenId: mockCeurTokenId,
        networkId: NetworkId['celo-alfajores'],
        isFeeCurrency: true,
        priceFetchedAt: Date.now(),
        name: 'CNDL Euro',
      },
      [mockTestTokenTokenId]: {
        balance: '10',
        symbol: 'TT',
        address: mockTestTokenAddress,
        tokenId: mockTestTokenTokenId,
        networkId: NetworkId['celo-alfajores'],
        priceFetchedAt: Date.now(),
        name: 'Test Token',
      },
    },
  },
})

const onTokenSelectedMock = jest.fn()

describe.each([
  { isScreen: true, testName: 'screen' },
  { isScreen: false, testName: 'component' },
])('TokenBottomSheet (as $testName)', ({ isScreen }) => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function renderBottomSheet(
    props: Partial<Omit<TokenBottomSheetProps, 'isScreen' | 'forwardedRef'>> = {}
  ) {
    const additionalProps = isScreen
      ? { isScreen: true as const }
      : { forwardedRef: { current: null } }
    return render(
      <Provider store={mockStore}>
        <TokenBottomSheet
          title="testTitle"
          origin={TokenPickerOrigin.Send}
          onTokenSelected={onTokenSelectedMock}
          tokens={tokens}
          {...props}
          {...additionalProps}
        />
      </Provider>
    )
  }

  it('renders correctly', () => {
    const { getAllByTestId } = renderBottomSheet()

    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(3)
    expect(getAllByTestId('TokenBalanceItem')[0]).toHaveTextContent('10.00 cUSD')
    expect(getAllByTestId('TokenBalanceItem')[0]).toHaveTextContent('₱13.30')
    expect(getAllByTestId('TokenBalanceItem')[1]).toHaveTextContent('20.00 cEUR')
    expect(getAllByTestId('TokenBalanceItem')[1]).toHaveTextContent('₱31.92') // 20 * 1.2 (cEUR price) * 1.33 (PHP price)
    expect(getAllByTestId('TokenBalanceItem')[2]).toHaveTextContent('10.00 TT')
  })

  it('handles the choosing of a token correctly', () => {
    const commonAnalyticsProps = {
      areSwapTokensShuffled: undefined,
      networkId: 'celo-alfajores',
      origin: 'Send',
      selectedFilters: [],
      usedSearchTerm: false,
    }
    const { getAllByTestId } = renderBottomSheet()

    fireEvent.press(getAllByTestId('TokenBalanceItem')[0])
    expect(onTokenSelectedMock).toHaveBeenLastCalledWith(
      tokens.find((token) => token.tokenId === mockCusdTokenId),
      0
    )
    expect(AppAnalytics.track).toHaveBeenLastCalledWith(TokenBottomSheetEvents.token_selected, {
      ...commonAnalyticsProps,
      tokenAddress: mockCusdAddress,
      tokenId: mockCusdTokenId,
      tokenPositionInList: 0,
    })

    fireEvent.press(getAllByTestId('TokenBalanceItem')[1])
    expect(onTokenSelectedMock).toHaveBeenLastCalledWith(
      tokens.find((token) => token.tokenId === mockCeurTokenId),
      1
    )
    expect(AppAnalytics.track).toHaveBeenLastCalledWith(TokenBottomSheetEvents.token_selected, {
      ...commonAnalyticsProps,
      tokenAddress: mockCeurAddress,
      tokenId: mockCeurTokenId,
      tokenPositionInList: 1,
    })

    fireEvent.press(getAllByTestId('TokenBalanceItem')[2])
    expect(onTokenSelectedMock).toHaveBeenLastCalledWith(
      tokens.find((token) => token.tokenId === mockTestTokenTokenId),
      2
    )
    expect(AppAnalytics.track).toHaveBeenLastCalledWith(TokenBottomSheetEvents.token_selected, {
      ...commonAnalyticsProps,
      tokenAddress: mockTestTokenAddress,
      tokenId: mockTestTokenTokenId,
      tokenPositionInList: 2,
    })
  })

  it('renders and behaves correctly when the search is enabled', () => {
    const { getByPlaceholderText, getByTestId, queryByTestId } = renderBottomSheet({
      searchEnabled: true,
    })
    const searchInput = getByPlaceholderText('tokenBottomSheet.searchAssets')
    expect(searchInput).toBeTruthy()

    expect(getByTestId(`TokenBalanceItemTouchable/${mockCusdTokenId}`)).toBeTruthy()
    expect(getByTestId(`TokenBalanceItemTouchable/${mockCeurTokenId}`)).toBeTruthy()
    expect(getByTestId(`TokenBalanceItemTouchable/${mockTestTokenTokenId}`)).toBeTruthy()

    fireEvent.changeText(searchInput, 'CNDL')
    // Wait for the analytics debounce
    jest.advanceTimersByTime(DEBOUNCE_WAIT_TIME)

    expect(AppAnalytics.track).toBeCalledTimes(1)
    expect(AppAnalytics.track).toHaveBeenCalledWith(TokenBottomSheetEvents.search_token, {
      origin: TokenPickerOrigin.Send,
      searchInput: 'CNDL',
    })

    expect(getByTestId(`TokenBalanceItemTouchable/${mockCusdTokenId}`)).toBeTruthy()
    expect(getByTestId(`TokenBalanceItemTouchable/${mockCeurTokenId}`)).toBeTruthy()
    expect(queryByTestId(`TokenBalanceItemTouchable/${mockTestTokenTokenId}`)).toBeNull()

    fireEvent.changeText(searchInput, 'Test')
    // Wait for the analytics debounce
    jest.advanceTimersByTime(DEBOUNCE_WAIT_TIME)

    expect(AppAnalytics.track).toBeCalledTimes(2)
    expect(AppAnalytics.track).toHaveBeenCalledWith(TokenBottomSheetEvents.search_token, {
      origin: TokenPickerOrigin.Send,
      searchInput: 'Test',
    })

    expect(queryByTestId(`TokenBalanceItemTouchable/${mockCusdTokenId}`)).toBeNull()
    expect(queryByTestId(`TokenBalanceItemTouchable/${mockCeurTokenId}`)).toBeNull()
    expect(getByTestId(`TokenBalanceItemTouchable/${mockTestTokenTokenId}`)).toBeTruthy()

    fireEvent.changeText(searchInput, 'Usd')
    // Wait for the analytics debounce
    jest.advanceTimersByTime(DEBOUNCE_WAIT_TIME)

    expect(AppAnalytics.track).toBeCalledTimes(3)
    expect(AppAnalytics.track).toHaveBeenCalledWith(TokenBottomSheetEvents.search_token, {
      origin: TokenPickerOrigin.Send,
      searchInput: 'Usd',
    })

    expect(getByTestId(`TokenBalanceItemTouchable/${mockCusdTokenId}`)).toBeTruthy()
    expect(queryByTestId(`TokenBalanceItemTouchable/${mockCeurTokenId}`)).toBeNull()
    expect(queryByTestId(`TokenBalanceItemTouchable/${mockTestTokenTokenId}`)).toBeNull()
  })

  it('renders and applies a filter', () => {
    const { getByText, getAllByTestId } = renderBottomSheet({
      filterChips: [
        {
          id: 'some-id',
          name: 'cusd filter',
          filterFn: (token: TokenBalance) => token.symbol === 'cUSD',
          isSelected: false,
        },
      ],
      tokens,
    })

    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(tokens.length)

    fireEvent.press(getByText('cusd filter'))

    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(1)
    expect(getAllByTestId('TokenBalanceItem')[0]).toHaveTextContent('CNDL Dollar')
  })

  it('renders and applies a default filter', () => {
    const fitler = {
      id: 'some-id',
      name: 'cusd filter',
      filterFn: (token: TokenBalance) => token.symbol === 'cUSD',
      isSelected: true,
    }
    const { getByText, getAllByTestId } = renderBottomSheet({
      filterChips: [fitler],
      tokens,
    })

    // filter already applied
    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(1)
    expect(getAllByTestId('TokenBalanceItem')[0]).toHaveTextContent('CNDL Dollar')

    fireEvent.press(getByText('cusd filter'))

    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(tokens.length)
  })

  it('applies search within filtered results', () => {
    const fitler = {
      id: 'some-filter-id',
      name: 'cusd filter',
      filterFn: (token: TokenBalance) => token.balance.lte(10),
      isSelected: true,
    }
    const { getByPlaceholderText, getAllByTestId } = renderBottomSheet({
      filterChips: [fitler],
      searchEnabled: true,
      tokens,
      areSwapTokensShuffled: true,
      origin: TokenPickerOrigin.SwapFrom,
    })

    // filter already applied
    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(2)
    expect(getAllByTestId('TokenBalanceItem')[0]).toHaveTextContent('CNDL Dollar')
    expect(getAllByTestId('TokenBalanceItem')[1]).toHaveTextContent('Test Token')

    fireEvent.changeText(getByPlaceholderText('tokenBottomSheet.searchAssets'), 'CNDL')

    // Wait for the analytics debounce
    jest.advanceTimersByTime(DEBOUNCE_WAIT_TIME)

    expect(getAllByTestId('TokenBalanceItem')).toHaveLength(1)
    expect(getAllByTestId('TokenBalanceItem')[0]).toHaveTextContent('CNDL Dollar')

    fireEvent.press(getAllByTestId('TokenBalanceItem')[0])
    expect(AppAnalytics.track).toHaveBeenLastCalledWith(TokenBottomSheetEvents.token_selected, {
      tokenAddress: mockCusdAddress,
      tokenId: mockCusdTokenId,
      tokenPositionInList: 0,
      areSwapTokensShuffled: true,
      networkId: 'celo-alfajores',
      origin: 'Swap/From',
      selectedFilters: ['some-filter-id'],
      usedSearchTerm: true,
    })
  })

  it('does not send events for temporary search inputs', () => {
    const { getByPlaceholderText } = renderBottomSheet({ searchEnabled: true })
    const searchInput = getByPlaceholderText('tokenBottomSheet.searchAssets')

    fireEvent.changeText(searchInput, 'TemporaryInput')
    fireEvent.changeText(searchInput, 'FinalInput')
    // Wait for the analytics debounce
    jest.advanceTimersByTime(DEBOUNCE_WAIT_TIME)

    expect(AppAnalytics.track).toBeCalledTimes(1)
    // We don't send events for intermediate search inputs
    expect(AppAnalytics.track).not.toHaveBeenCalledWith(TokenBottomSheetEvents.search_token, {
      origin: TokenPickerOrigin.Send,
      searchInput: 'TemporaryInput',
    })

    expect(AppAnalytics.track).toHaveBeenCalledWith(TokenBottomSheetEvents.search_token, {
      origin: TokenPickerOrigin.Send,
      searchInput: 'FinalInput',
    })
  })
})

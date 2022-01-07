import { render } from '@testing-library/react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { ReactTestInstance } from 'react-test-renderer'
import { formatShortenedAddress } from 'src/components/ShortenedAddress'
import { LocalCurrencyCode } from 'src/localCurrency/consts'
import { RootState } from 'src/redux/reducers'
import TransferFeedItem from 'src/transactions/feed/TransferFeedItem'
import {
  Fee,
  TokenAmount,
  TokenTransactionTypeV2,
  TokenTransferMetadata,
  TransactionStatus,
} from 'src/transactions/types'
import { createMockStore, getElementText, RecursivePartial } from 'test/utils'
import { mockCusdAddress, mockName, mockTestTokenAddress } from 'test/values'

const MOCK_TX_HASH = '0x006b866d20452a24d1d90c7514422188cc7c5d873e2f1ed661ec3f810ad5331c'
const MOCK_ADDRESS = '0xFdd8bD58115FfBf04e47411c1d228eCC45E93075'
const MOCK_E164_NUMBER = '+14155550001'
const MOCK_CONTACT = {
  name: mockName,
  displayNumber: '14155550001',
  e164PhoneNumber: MOCK_E164_NUMBER,
  contactId: 'contactId',
  address: MOCK_ADDRESS,
}

describe('TransferFeedItem', () => {
  function renderScreen({
    storeOverrides = {},
    type = TokenTransactionTypeV2.Sent,
    amount = {
      tokenAddress: mockCusdAddress,
      value: 10,
    },
    metadata = {},
    fees = [],
  }: {
    type?: TokenTransactionTypeV2
    amount?: TokenAmount
    metadata?: TokenTransferMetadata
    fees?: Fee[]
    storeOverrides?: RecursivePartial<RootState>
  }) {
    const store = createMockStore({
      ...storeOverrides,
    })

    const tree = render(
      <Provider store={store}>
        <TransferFeedItem
          transfer={{
            __typename: 'TokenTransferV2',
            type,
            status: TransactionStatus.Complete,
            transactionHash: MOCK_TX_HASH,
            timestamp: 1234,
            block: '2345',
            address: MOCK_ADDRESS,
            amount,
            metadata,
            fees,
          }}
        />
      </Provider>
    )

    return {
      store,
      ...tree,
    }
  }

  it('renders correctly', async () => {
    const tree = renderScreen({})
    expect(tree).toMatchSnapshot()
  })

  function verifyDisplay({
    getByTestId,
    queryByTestId,
    expectedTitleSections,
    expectedSubtitleSections,
    expectedAmount,
    expectedTokenAmount,
  }: {
    getByTestId: (testId: string) => ReactTestInstance
    queryByTestId?: (testId: string) => ReactTestInstance | null
    expectedTitleSections: string[]
    expectedSubtitleSections: string[]
    expectedAmount: string
    expectedTokenAmount: string | null
  }) {
    const title = getElementText(getByTestId('TransferFeedItem/title'))
    for (const titleSection of expectedTitleSections) {
      expect(title).toContain(titleSection)
    }

    const subtitle = getElementText(getByTestId('TransferFeedItem/subtitle'))
    for (const subtitleSection of expectedSubtitleSections) {
      expect(subtitle).toContain(subtitleSection)
    }

    const amountDisplay = getByTestId('TransferFeedItem/amount')
    expect(getElementText(amountDisplay)).toEqual(expectedAmount)

    if (expectedTokenAmount) {
      const tokenDisplay = getByTestId('TransferFeedItem/tokenAmount')
      expect(getElementText(tokenDisplay)).toEqual(expectedTokenAmount)
    } else {
      expect(queryByTestId!('TransferFeedItem/tokenAmount')).toBeNull()
    }
  }

  it('renders correctly for outgoing transfers to unknown address', async () => {
    const { getByTestId } = renderScreen({})
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', formatShortenedAddress(MOCK_ADDRESS)],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for incoming transfers from unknown address', async () => {
    const { getByTestId } = renderScreen({
      type: TokenTransactionTypeV2.Received,
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemReceivedTitle', formatShortenedAddress(MOCK_ADDRESS)],
      expectedSubtitleSections: ['feedItemReceivedInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers to phone contact', async () => {
    const { getByTestId } = renderScreen({
      storeOverrides: {
        identity: { addressToE164Number: { [MOCK_ADDRESS]: MOCK_E164_NUMBER } },
        recipients: {
          phoneRecipientCache: {
            [MOCK_E164_NUMBER]: MOCK_CONTACT,
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', mockName],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers to recent contact', async () => {
    const { getByTestId } = renderScreen({
      storeOverrides: {
        identity: { addressToE164Number: { [MOCK_ADDRESS]: MOCK_E164_NUMBER } },
        transactions: {
          recentTxRecipientsCache: {
            [MOCK_E164_NUMBER]: MOCK_CONTACT,
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', mockName],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers to phone number', async () => {
    const { getByTestId } = renderScreen({
      storeOverrides: {
        identity: { addressToE164Number: { [MOCK_ADDRESS]: MOCK_E164_NUMBER } },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', MOCK_E164_NUMBER],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers to Valora recipient', async () => {
    const { getByTestId } = renderScreen({
      storeOverrides: {
        recipients: {
          valoraRecipientCache: {
            [MOCK_ADDRESS]: { address: MOCK_ADDRESS, name: mockName },
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', mockName],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers with default title/subtitle', async () => {
    const { getByTestId } = renderScreen({
      metadata: {
        title: 'a title',
        subtitle: 'a subtitle',
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', 'a title'],
      expectedSubtitleSections: ['feedItemSentInfo', 'a subtitle'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  // TODO: Also test with encrypted comment.
  it('renders correctly for transfers with comments', async () => {
    const { getByTestId } = renderScreen({
      metadata: {
        title: 'a title',
        subtitle: 'a subtitle',
        comment: 'Hello World',
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', 'a title'],
      expectedSubtitleSections: ['feedItemSentInfo', 'Hello World'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers to a known provider', async () => {
    const { getByTestId } = renderScreen({
      storeOverrides: {
        fiatExchanges: {
          txHashToProvider: {
            [MOCK_TX_HASH]: {
              name: 'Simplex',
              icon: 'hi',
            },
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', 'Simplex'],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers from CELO rewards', async () => {
    const { getByTestId } = renderScreen({
      type: TokenTransactionTypeV2.Received,
      storeOverrides: {
        identity: {
          addressToDisplayName: {
            [MOCK_ADDRESS]: {
              name: 'CELO Rewards',
              imageUrl: 'hi',
              isCeloRewardSender: true,
            },
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemCeloRewardReceivedTitle'],
      expectedSubtitleSections: ['feedItemRewardReceivedInfo'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers from Supercharge rewards', async () => {
    const { getByTestId } = renderScreen({
      type: TokenTransactionTypeV2.Received,
      storeOverrides: {
        recipients: {
          rewardsSenders: [MOCK_ADDRESS],
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemRewardReceivedTitle'],
      expectedSubtitleSections: ['feedItemRewardReceivedInfo'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers from invite rewards', async () => {
    const { getByTestId } = renderScreen({
      type: TokenTransactionTypeV2.Received,
      storeOverrides: {
        recipients: {
          inviteRewardsSenders: [MOCK_ADDRESS],
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemInviteRewardReceivedTitle'],
      expectedSubtitleSections: ['feedItemInviteRewardReceivedInfo'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for transfers from a known provider', async () => {
    const { getByTestId } = renderScreen({
      type: TokenTransactionTypeV2.Received,
      storeOverrides: {
        fiatExchanges: {
          txHashToProvider: {
            [MOCK_TX_HASH]: {
              name: 'Simplex',
              icon: 'hi',
            },
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemReceivedTitle', 'Simplex'],
      expectedSubtitleSections: ['tokenDeposit', 'cUSD'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  // TODO: Also test with encrypted comment.
  it('renders correctly for transfers received with comments', async () => {
    const { getByTestId } = renderScreen({
      type: TokenTransactionTypeV2.Received,
      metadata: {
        title: 'a title',
        subtitle: 'a subtitle',
        comment: 'Hello World',
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemReceivedTitle', 'a title'],
      expectedSubtitleSections: ['feedItemReceivedInfo', 'Hello World'],
      expectedAmount: '+₱13.30',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly with custom local exchange rate', async () => {
    const { getByTestId } = renderScreen({
      amount: {
        tokenAddress: mockCusdAddress,
        value: 10,
        localAmount: {
          currencyCode: LocalCurrencyCode.PHP,
          exchangeRate: '1.5',
          value: '15',
        },
      },
    })
    verifyDisplay({
      getByTestId,
      expectedTitleSections: ['feedItemSentTitle', formatShortenedAddress(MOCK_ADDRESS)],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+₱15.00',
      expectedTokenAmount: '10.00 cUSD',
    })
  })

  it('renders correctly for tokens without usd price', async () => {
    const { getByTestId, queryByTestId } = renderScreen({
      amount: {
        tokenAddress: mockTestTokenAddress,
        value: 10,
      },
      storeOverrides: {
        tokens: {
          tokenBalances: {
            [mockTestTokenAddress]: {
              address: mockTestTokenAddress,
              symbol: 'TT',
              balance: '50',
            },
          },
        },
      },
    })
    verifyDisplay({
      getByTestId,
      queryByTestId,
      expectedTitleSections: ['feedItemSentTitle', formatShortenedAddress(MOCK_ADDRESS)],
      expectedSubtitleSections: ['feedItemSentInfo', 'noComment'],
      expectedAmount: '+10.00 TT',
      expectedTokenAmount: null,
    })
  })
})

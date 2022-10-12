import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { StackParamList } from 'src/navigator/types'
import { Screens } from 'src/navigator/Screens'
import { navigateHome } from 'src/navigator/NavigationService'
import { useTranslation } from 'react-i18next'
import ValoraAnalytics from 'src/analytics/ValoraAnalytics'
import { FiatExchangeEvents } from 'src/analytics/Events'
import { KycStatus as FiatConnectKycStatus } from '@fiatconnect/fiatconnect-types'
import fontStyles from 'src/styles/fonts'
import colors from 'src/styles/colors'
import Button, { BtnSizes, BtnTypes } from 'src/components/Button'
import ClockIcon from 'src/icons/ClockIcon'
import CircledIcon from 'src/icons/CircledIcon'
import BankIcon from 'src/icons/BankIcon'
import getNavigationOptions from 'src/fiatconnect/kyc/getNavigationOptions'

type Props = StackScreenProps<StackParamList, Screens.KycPending>

function KycPending({ route, navigation }: Props) {
  navigation.setOptions(
    getNavigationOptions({
      fiatConnectKycStatus: FiatConnectKycStatus.KycPending,
      quote: route.params.quote,
    })
  )

  const { t } = useTranslation()

  const onPressClose = () => {
    ValoraAnalytics.track(FiatExchangeEvents.cico_fc_kyc_status_close, {
      provider: route.params.quote.getProviderId(),
      flow: route.params.flow,
      fiatConnectKycStatus: FiatConnectKycStatus.KycPending,
    })
    navigateHome()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <CircledIcon radius={80} backgroundColor={colors.beige} style={styles.bankIcon}>
          <BankIcon color={colors.dark} height={24} width={24} />
        </CircledIcon>
        <CircledIcon radius={85} backgroundColor={colors.white} style={styles.clockIcon}>
          <CircledIcon radius={80}>
            <ClockIcon color={colors.white} height={24} width={24} />
          </CircledIcon>
        </CircledIcon>
      </View>
      <Text style={styles.title}>{t('fiatConnectKycStatusScreen.pending.title')}</Text>
      <Text testID="descriptionText" style={styles.description}>
        {t('fiatConnectKycStatusScreen.pending.description')}
      </Text>
      <Button
        style={styles.button}
        testID="closeButton"
        onPress={onPressClose}
        text={t('fiatConnectKycStatusScreen.pending.close')}
        type={BtnTypes.SECONDARY}
        size={BtnSizes.MEDIUM}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockIcon: {
    right: 10,
  },
  bankIcon: {
    left: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingBottom: 32,
  },
  title: {
    ...fontStyles.h2,
    marginHorizontal: 16,
  },
  description: {
    ...fontStyles.regular,
    textAlign: 'center',
    marginVertical: 12,
    marginHorizontal: 24,
  },
  button: {
    marginTop: 12,
  },
})

export default KycPending
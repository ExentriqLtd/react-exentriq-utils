import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

function ExBottomSheetHandle({
  children,
  toolbar,
  title,
  onBack,
  onConfirm,
  onCancel,
  style,
  theme,
}) {
  const { t } = useTranslation();
  return (
    <View style={Platform.OS === "android" && styles.androidContainer}>
      <View
        style={[
          styles.header,
          !toolbar && { alignItems: 'center', justifyContent: 'center' },
          style,
        ]}>
        {!toolbar ? (
          <View style={styles.backContainer}>
            <TouchableOpacity style={styles.left} onPress={onCancel}>
              <Text style={styles.action(theme)}>{t('Cancel')}</Text>
            </TouchableOpacity>
            <View style={styles.center}>
              {title ? (
                <Text style={styles.title(theme)}>{title}</Text>
              ) : (
                <View style={styles.panelHandle} />
              )}
            </View>
            <View style={styles.right} />
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.left} onPress={onBack}>
              <Text style={styles.action(theme)}>{t('Back')}</Text>
            </TouchableOpacity>
            <View style={styles.center}>
              <Text style={styles.title(theme)}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.right} onPress={onConfirm}>
            <Text style={styles.action(theme)}>{t('Next')}</Text>
            </TouchableOpacity>
          </>
        )}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  androidContainer: {
    overflow: 'hidden',
    paddingTop: 10,
  },
  center: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
    ...(Platform.OS !== 'ios' ? { minWidth: '66%' } : {}),
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...(Platform.OS !== 'ios' ? { minWidth: '33%' } : {}),
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    ...(Platform.OS !== 'ios' ? { minWidth: '33%' } : {}),
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: 54,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 16,
  },
  panelHandle: {
    width: 40,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 4,
    marginBottom: 0,
  },
  backContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: (theme) => ({
    fontSize: 16,
    color: theme.colors.primary,
  }),
  title: (theme) => ({
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
  }),
});

export default ExBottomSheetHandle;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PageHeaderFor({ page }: { page: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{page}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

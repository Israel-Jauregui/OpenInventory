import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

type Props = {
    message: String;
    visible: boolean;
    onFinish?: () => void;
};

export default function SuccessToast({ message, visible, onFinish }: Props) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        // Whoosh in
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),

        // Hang
        Animated.delay(1200),

        // Whoosh out
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onFinish?.();
      });
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.check}>✓</Text>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 260,
    alignSelf: "center",
    backgroundColor: "#c4c4c4",
    paddingVertical: 32,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  check: {
    fontSize: 48,
    color: "#36a2fa",
    fontWeight: "bold",
  },
  text: {
    marginTop: 6,
    color: "#707479",
    fontSize: 24,
  },
});
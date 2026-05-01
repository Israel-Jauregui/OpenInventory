import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import { useInventoryDataContext, editQuantityFormData } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useSession } from "@/contexts/AuthContext/AuthContext";

export default function QuantityScreen() {
  const router = useRouter();
  const { itemId, quantity, item_name } = useLocalSearchParams<{ itemId: string, quantity: string, item_name: string }>();
  const numericItemId = useMemo(() => Number(itemId), [itemId]);

  const { fetchWithAuth } = useSession();
  const { currentInventory } = useCurrentInventoryContext();
  const { handleEditItemQuantity, refreshInventoryItems } = useInventoryDataContext();


  const currentQuantity = Number(quantity) ?? 0;

  //MARK: Initial form data
  const editQuantityFormData: editQuantityFormData =
  {
    inventory_id: currentInventory.invId,
    item_id: itemId,
    quantityDelta: "0"
  };




  const [delta, setDelta] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const newQuantity = Number(currentQuantity) + delta;

  function adjustDelta(amount: number) {
    setDelta((prev) => prev + amount);
  }

  function stopHoldAdjust() {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }

  function startHoldAdjust(amount: number) {
    // Trigger once immediately, then repeat while held.
    adjustDelta(amount);
    stopHoldAdjust();

    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        adjustDelta(amount);
      }, 70);
    }, 280);
  }

  useEffect(() => {
    return () => {
      stopHoldAdjust();
    };
  }, []);

  function handleInputChange(text: string) {
    const parsed = parseInt(text, 10);
    setDelta(isNaN(parsed) ? 0 : parsed);
  }

  //TODO: Call handleEditItemQuantity here
  async function handleSave() {
    if (!currentInventory.invId || !numericItemId || delta === 0) return;

    if (newQuantity < 0) {
      Alert.alert("Invalid quantity", "Quantity cannot go below zero.");
      return;
    }



    editQuantityFormData.quantityDelta = String(delta);
    console.log(editQuantityFormData)

    setIsSaving(true);

    const updateQuantityResponse = await handleEditItemQuantity(editQuantityFormData);

    if (!updateQuantityResponse?.ok) {
      const responseJSON = await updateQuantityResponse?.json().catch(() => null);
      Alert.alert("Unable to update quantity", responseJSON?.detail ?? "Please try again.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);

    await refreshInventoryItems();
    router.back();
   
  }
  const deltaLabel =
    delta === 0
      ? null
      : `${currentQuantity} ${delta > 0 ? "+" : "−"} ${Math.abs(delta)} = ${newQuantity}`;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.header}>Adjust Quantity</Text>
            {quantity ? (
              <Text style={styles.itemName}>{item_name}</Text>
            ) : null}
            <Text style={styles.currentQty}>Current quantity: {currentQuantity}</Text>

            <Text style={styles.label}>Change by</Text>
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.stepButton}
                onPressIn={() => startHoldAdjust(-5)}
                onPressOut={stopHoldAdjust}
              >
                <Text style={styles.stepButtonText}>−5</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={String(delta)}
                onChangeText={handleInputChange}
                selectTextOnFocus
              />

              <TouchableOpacity
                style={styles.stepButton}
                onPressIn={() => startHoldAdjust(5)}
                onPressOut={stopHoldAdjust}
              >
                <Text style={styles.stepButtonText}>+5</Text>
              </TouchableOpacity>
            </View>

            {deltaLabel ? (
              <Text style={styles.preview}>{deltaLabel}</Text>
            ) : null}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, (isSaving || delta === 0 || newQuantity < 0) && styles.saveButtonDisabled]}
              disabled={isSaving || delta === 0 || newQuantity < 0}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>{isSaving ? "Saving..." : "Save"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  scrollContent: {
    padding: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom: 24,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 14,
    borderColor: "#d8e4ef",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 18,
  },
  header: {
    fontSize: 24,
    color: "#1d1b20",
    fontWeight: "700",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: "#6b6b6b",
    marginBottom: 8,
  },
  currentQty: {
    fontSize: 17,
    color: "#333",
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: "#6b6b6b",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepButton: {
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d1b20",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d8e4ef",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 20,
    textAlign: "center",
    color: "#1d1b20",
    backgroundColor: "#f9f9f9",
  },
  preview: {
    marginTop: 12,
    fontSize: 14,
    color: "#8a8a8a",
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 18,
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#36a2fa",
    borderRadius: 12,
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  cancelText: {
    color: "#1d1b20",
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});

import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";

import { useSession } from "@/contexts/AuthContext/AuthContext";
import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";

type InventoryMember = {
  user_id: number;
  username: string;
  role: "admin" | "member";
  joined_at?: string;
};

export default function ManageUsersScreen() {
  const router = useRouter();
  const { fetchWithAuth } = useSession();
  const { currentInventory } = useCurrentInventoryContext();
  const isInventoryAdmin = currentInventory.role === "admin";
  const isInventoryMember = currentInventory.role === "member";

  const [members, setMembers] = useState<InventoryMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadUsers = useCallback(async () => {
    if (!currentInventory.invId) {
      setMembers([]);
      return;
    }

    if (!isInventoryAdmin) {
      setMembers([]);
      if (isInventoryMember) {
        setError("You are a member in this inventory. Only admins can manage users.");
      }
      return;
    }

    setIsLoading(true);
    setError("");

    fetchWithAuth(`/inventory/${currentInventory.invId}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response?.ok) {
          if (response?.status === 403) {
            setError("Only inventory admins can manage users.");
          } else {
            setError("Failed to retrieve users.");
          }
          return;
        }

        const responseJSON = await response.json();
        setMembers(responseJSON);
      })
      .catch(() => {
        setError("Failed to retrieve users.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentInventory.invId, fetchWithAuth, isInventoryAdmin, isInventoryMember]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Users in {currentInventory.invName}</Text>
        <TouchableOpacity
          style={[styles.inviteButton, !isInventoryAdmin && styles.inviteButtonDisabled]}
          disabled={!isInventoryAdmin}
          onPress={() => {
            router.push("/inventory/invite-users");
          }}
        >
          <Image style={styles.inviteIcon} source={require("@/assets/images/plusIcon.png")} />
          <Text style={styles.inviteButtonText}>Invite</Text>
        </TouchableOpacity>
      </View>

      {!currentInventory.invId ? (
        <Text style={styles.helperText}>Select an inventory first.</Text>
      ) : null}

      {!!error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 25 }} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => String(item.user_id)}
          refreshing={isLoading}
          onRefresh={loadUsers}
          contentContainerStyle={{ width: "100%", paddingBottom: 25 }}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View>
                <Text style={styles.userName}>{item.username}</Text>
              </View>
              <View style={[styles.roleBadge, item.role === "admin" ? styles.adminBadge : styles.memberBadge]}>
                <Text style={styles.roleBadgeText}>{item.role.toUpperCase()}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.helperText}>
              No users are currently assigned to this inventory.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  heading: {
    color: "#1d1b20",
    fontSize: 22,
    fontWeight: "700",
    width: "70%",
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#36a2fa",
    borderRadius: 12,
    borderColor: "#a1d2fb",
    borderWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inviteButtonDisabled: {
    backgroundColor: "#b6dffd",
    borderColor: "#cae9ff",
  },
  inviteIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  inviteButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  userCard: {
    width: "100%",
    marginBottom: 10,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderColor: "#6fbeff",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    color: "#1d1b20",
    fontWeight: "600",
  },
  roleBadge: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  adminBadge: {
    backgroundColor: "#d8edff",
  },
  memberBadge: {
    backgroundColor: "#e9e9e9",
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2b6f9d",
  },
  helperText: {
    marginTop: 20,
    textAlign: "center",
    color: "#5b5b5b",
    fontSize: 16,
  },
  errorText: {
    marginBottom: 15,
    color: "#b92323",
    fontWeight: "600",
    fontSize: 14,
    width: "100%",
  },
});

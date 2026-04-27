import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";

import { useSession } from "@/contexts/AuthContext/AuthContext";
import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";

type InviteCandidate = {
  user_id: number;
  username: string;
};

export default function InviteUsersScreen() {
  const { fetchWithAuth } = useSession();
  const { currentInventory } = useCurrentInventoryContext();

  const [candidates, setCandidates] = useState<InviteCandidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invitingUserId, setInvitingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const loadCandidates = useCallback(async () => {
    if (!currentInventory.invId) {
      setCandidates([]);
      return;
    }

    setIsLoading(true);
    setError("");

    fetchWithAuth(`/inventory/${currentInventory.invId}/invite-candidates`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response?.ok) {
          if (response?.status === 403) {
            setError("Only inventory admins can invite users.");
          } else {
            setError("Failed to load invite candidates.");
          }
          return;
        }

        const responseJSON = await response.json();
        setCandidates(responseJSON);
      })
      .catch(() => {
        setError("Failed to load invite candidates.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentInventory.invId, fetchWithAuth]);

  async function inviteUser(user: InviteCandidate) {
    if (!currentInventory.invId) {
      return;
    }

    setInvitingUserId(user.user_id);
    setError("");

    fetchWithAuth(`/inventory/${currentInventory.invId}/invite`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id }),
    })
      .then(async (response) => {
        if (!response?.ok) {
          const responseJSON = await response?.json().catch(() => undefined);
          setError(responseJSON?.detail ?? "Failed to invite user.");
          return;
        }

        setCandidates((prev) => prev.filter((candidate) => candidate.user_id !== user.user_id));
      })
      .catch(() => {
        setError("Failed to invite user.");
      })
      .finally(() => {
        setInvitingUserId(null);
      });
  }

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Invite Users to {currentInventory.invName}</Text>
      <Text style={styles.subheading}>Users not already assigned to this inventory</Text>

      {!!error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 25 }} />
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={(item) => String(item.user_id)}
          refreshing={isLoading}
          onRefresh={loadCandidates}
          contentContainerStyle={{ width: "100%", paddingBottom: 25 }}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userName}>{item.username}</Text>
              <TouchableOpacity
                style={[
                  styles.inviteButton,
                  invitingUserId === item.user_id ? styles.inviteButtonDisabled : null,
                ]}
                disabled={invitingUserId === item.user_id}
                onPress={() => {
                  inviteUser(item);
                }}
              >
                <Text style={styles.inviteButtonText}>
                  {invitingUserId === item.user_id ? "Inviting..." : "Invite"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.helperText}>
              No available users to invite right now.
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
  heading: {
    color: "#1d1b20",
    fontSize: 22,
    fontWeight: "700",
    width: "100%",
  },
  subheading: {
    width: "100%",
    marginTop: 8,
    marginBottom: 15,
    color: "#5b5b5b",
    fontSize: 15,
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
  inviteButton: {
    backgroundColor: "#36a2fa",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  inviteButtonDisabled: {
    backgroundColor: "#90caf9",
  },
  inviteButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import api from "../api";
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 

const EachHold = ({ route }) => {
  const { name, username, asset } = route.params;
  const navigate = useNavigation();
  const [sellingPrice, setSellingPrice] = useState("");
  const [sellingQuantity, setSellingQuantity] = useState("");
  const [sellingDate, setSellingDate] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSellDatePickerVisible, setSellDatePickerVisibility] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
  }, []); // Runs on initial mount
  
  useEffect(() => {
    if (purchaseHistory.length === 0) {
      fetchPortfolioData();
    }
  }, [purchaseHistory]); // Runs when purchaseHistory updates

  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`${api}/api/holdings/portfolio/${username}/${name}`);
      console.log(response);
      const portfolio = response.data;
      
      if (portfolio.holdings && portfolio.holdings.length > 0) {
      const formattedData = portfolio.holdings.map((holding) => ({
        id: holding._id,
        date: new Date(holding.date_purchased).toDateString(),
        quantity: holding.qty.toString(),
        value: holding.bought_price.toString(),
      }));
      setPurchaseHistory(formattedData);
      } else {
        setPurchaseHistory([]);
    }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setPurchaseHistory([]);
      setLoading(false);
    }
  };

  const handleEditPress = (record) => {
    setSelectedRecord({ ...record });
    setEditModalVisible(true);
    setSelectedMenuId(null);
};

  const handleSell = async () => {
    console.log("handleSell function is executing...");
    console.log("handel sell is ok....")
    if (!username || !asset || !name || !sellingPrice || !sellingQuantity || !sellingDate) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    try {
      const response = await axios.post(`${api}/api/sellings/sell`, {
        username,
        asset,
        name,
        sellingPrice: Number(sellingPrice),
        sellingQuantity: Number(sellingQuantity),
        sellingDate,
      });
      Alert.alert("Success", "Sell data submitted successfully!");
      navigate.push('Portfolio',{username});
      console.log(response.data.removedStocks);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit sell data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${api}/api/holdings/delete/${username}/${id}`);
      console.log("Delete Response Data:", response.data); // Debugging log

      if (response.data && response.data.message === "Holding deleted successfully") {
        console.log("Holding deleted, updating state...");

        setPurchaseHistory((prev) => {
          const updatedHistory = prev.filter((record) => record.id !== id);

          if (updatedHistory.length === 0) {
            fetchPortfolioData();
          }

          return updatedHistory;
        });

        Alert.alert("Success", "Holding deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      Alert.alert("Error", "Failed to delete the holding. Please try again.");
    }

    setSelectedMenuId(null);
};

  const handleUpdate = async () => {
    if (!selectedRecord) return;
    try {
      const updatedData = {
        qty: Number(selectedRecord.quantity),
        bought_price: Number(selectedRecord.value),
        date_purchased: selectedRecord.date,
      };

      await axios.put(`${api}/api/holdings/update/${username}/${selectedRecord.id}`, updatedData);
      fetchPortfolioData();
      setEditModalVisible(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sell Block */}
      <View style={styles.sellBlock}>
        {/* Traffic Light Icons */}
        <View style={styles.tools}>
          <View style={[styles.circle, styles.red]} />
          <View style={[styles.circle, styles.yellow]} />
          <View style={[styles.circle, styles.green]} />
        </View>

        <Text style={styles.sellHeading}>SELL</Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Selling Price"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={sellingPrice}
          onChangeText={setSellingPrice}
        />

        <TextInput
          style={styles.input}
          placeholder="Selling Quantity"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={sellingQuantity}
          onChangeText={setSellingQuantity}
        />

        <TouchableOpacity style={styles.input} onPress={() => setSellDatePickerVisibility(true)}>
          <Text style={styles.dateText}>{sellingDate || "Select Selling Date"}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isSellDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setSellingDate(date.toDateString());
            setSellDatePickerVisibility(false);
          }}
          onCancel={() => setSellDatePickerVisibility(false)}
        />

        {/* Sell Button */}
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => {
            console.log("Sell button pressed!");  // Debugging log
            handleSell();
          }}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />
      {/*header section*/}
      <View style={styles.header}>
        <Text style={styles.headerTextLeft}>PURCHASE DATE</Text>
        <Text style={styles.headerTextMiddle}>QUANTITY</Text>
        <Text style={styles.headerTextRight}>VALUE</Text>
      </View>
      <View style={styles.headerLine} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : purchaseHistory.length === 0 ? (
        <View style={styles.noRecordsContainer}>
          <Text style={styles.noRecordsText}>No records present.</Text>
        </View>
      ) : (
        <ScrollView>
          {purchaseHistory.map((record) => (
            <View key={record.id} style={styles.record}>
              <Text style={styles.recordDate}>{record.date}</Text>
              <Text style={styles.recordQuantity}>{record.quantity}</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.recordValue}>₹{record.value}</Text>

                {/* Three Dots Button */}
                <TouchableOpacity
                  style={styles.threeDotsButton}
                  onPress={() =>
                    setSelectedMenuId(selectedMenuId === record.id ? null : record.id)
                  }
                >
                  <Icon name="more-vert" size={24} color="#000" />
                </TouchableOpacity>

                {/* Dropdown Menu */}
                {selectedMenuId === record.id && (
                  <View style={styles.menuWrapper}>
                    <View style={styles.menu}>
                      <TouchableOpacity style={styles.menuItem} onPress={() => handleEditPress(record)}>
                        <Text style={styles.menuText}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.menuItem} onPress={() => handleDelete(record.id)}>
                        <Text style={styles.menuText}>🗑️ Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.modalTitle}>Edit Record</Text>

            <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisibility(true)}>
              <Text>{selectedRecord?.date || "Select Date"}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setSelectedRecord((prev) => ({ ...prev, date: date.toDateString() }));
                setDatePickerVisibility(false);
              }}
              onCancel={() => setDatePickerVisibility(false)}
            />

            <TextInput
              style={styles.input}
              value={selectedRecord?.quantity}
              onChangeText={(text) =>
                setSelectedRecord((prev) => ({ ...prev, quantity: text }))
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              value={selectedRecord?.value}
              onChangeText={(text) =>
                setSelectedRecord((prev) => ({ ...prev, value: text }))
              }
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// **Updated Styles**
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  headerTextLeft: { fontSize: 14, fontWeight: "bold",fontFamily:"Bebas Neue" },
  headerTextMiddle: { fontSize: 14, fontWeight: "bold",fontFamily:"Bebas Neue" },
  headerTextRight: { fontSize: 14, fontWeight: "bold",fontFamily:"Bebas Neue" },
  headerLine: { height: 1, backgroundColor: "#ccc", marginBottom: 10 },
  sellBlock: {
    width: "100%",
    padding: 16,
    backgroundColor: "#272727",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tools: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  red: { backgroundColor: "orange" },
  yellow: { backgroundColor: "white" },
  green: { backgroundColor: "#00ca4e" },
  sellHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    fontFamily:"Bebas Neue"
  },
  input: {
    width: "100%",
    color: "white",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    backgroundColor: "#333",
    },
  dateText: {
    color: "#fff",
    textAlign: "center",
    fontFamily:"Bebas Neue"
  },
  sellButton: {
    backgroundColor: "#00ca4e",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily:"Bebas Neue"
  },
  headerLine: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  record: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
    position: "relative",
  },
  valueContainer: { flexDirection: "row", alignItems: "center" },
  threeDotsButton: { padding: 5 },
  recordDate: { fontSize: 16,fontFamily:"Bebas Neue" },
  recordQuantity: { fontSize: 16,fontFamily:"Bebas Neue" },
  recordValue: { fontSize: 16, marginRight: 10,fontFamily:"Bebas Neue" },
  menuWrapper: {
    position: "absolute",
    top: -20,
    right: 0,
    zIndex: 100,
    elevation: 10,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    fontFamily:"Bebas Neue"
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    fontFamily:"Bebas Neue"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editModal: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10,fontFamily:"Bebas Neue" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10,fontFamily:"Bebas Neue" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    fontFamily:"Bebas Neue",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5 },
  cancelButton: { backgroundColor: "#FF4136", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold",fontFamily:"Bebas Neue" },
  noRecordsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noRecordsText: {
    fontSize: 16,
    color: "#888",
    fontFamily:"Bebas Neue"
  },
});

export default EachHold;
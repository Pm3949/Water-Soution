 // Need to chage the UI of this and also for the service screen and also for the cutomer book card
// remove components folder and merge wih respective files
 // also need to seprate the ui and api in the servicescreen

 
 <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Customers')}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Customers</Text>
              <Text style={styles.actionSubtitle}>
                Manage customer list & services
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PendingServices')}
          >
            <Text>⚡ Pending Services</Text>
          </TouchableOpacity>

          {user?.role === 'owner' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Workers')}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>👷</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Workers</Text>
                <Text style={styles.actionSubtitle}>
                  Add & manage worker accounts
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>


// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Alert,
//   StatusBar,
//   ScrollView,
//   Dimensions,
//   Platform,
//   KeyboardAvoidingView,
// } from 'react-native';
// import { useEffect, useState, useContext } from 'react';
// import BookServiceModal from '../components/BookServiceModal'
// import { AuthContext } from '../context/AuthContext';
// import {
//   getCustomers,
//   createCustomer,
//   updateCustomer,
//   deleteCustomer,
//   sendReminder,
//   markServiceDone,
// } from '../services/apiCore';

// const { width } = Dimensions.get('window');

// const addDays = (date, days) => {
//   const d = new Date(date);
//   d.setDate(d.getDate() + days);
//   return d;
// };

// export default function CustomersScreen() {
//   const { token } = useContext(AuthContext);

//   const [customers, setCustomers] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [selectedForBooking, setSelectedForBooking] = useState(null);

//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [lastServiceDate, setLastServiceDate] = useState('');
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     loadCustomers();
//   }, []);

//   const loadCustomers = async () => {
//     try {
//       const res = await getCustomers(token);
//       setCustomers(res.data);
//     } catch {
//       Alert.alert('Error', 'Error loading customers');
//     }
//   };

//   const openAdd = () => {
//     setEditingId(null);
//     setName('');
//     setPhone('');
//     setAddress('');
//     setLastServiceDate('');
//     setShowAddModal(true);
//   };

//   const openCustomerDetails = customer => {
//     setSelectedCustomer(customer);
//     setShowDetailModal(true);
//   };

//   const openEdit = () => {
//     setShowDetailModal(false);
//     setEditingId(selectedCustomer._id);
//     setName(selectedCustomer.name);
//     setPhone(selectedCustomer.phone);
//     setAddress(selectedCustomer.address || '');
//     setLastServiceDate(
//       selectedCustomer.lastServiceDate
//         ? new Date(selectedCustomer.lastServiceDate).toISOString().slice(0, 10)
//         : '',
//     );
//     setShowAddModal(true);
//   };

//   const saveCustomer = async () => {
//     if (!name || !phone || !lastServiceDate) {
//       return Alert.alert('Required', 'Fill all required fields');
//     }

//     try {
//       if (editingId) {
//         await updateCustomer(
//           editingId,
//           { name, phone, address, lastServiceDate },
//           token,
//         );
//       } else {
//         await createCustomer({ name, phone, address, lastServiceDate }, token);
//       }

//       setShowAddModal(false);
//       loadCustomers();
//     } catch {
//       Alert.alert('Error', 'Failed to save customer');
//     }
//   };

//   const removeCustomer = () => {
//     Alert.alert(
//       'Delete Customer?',
//       `Are you sure you want to delete ${selectedCustomer.name}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteCustomer(selectedCustomer._id, token);
//               setShowDetailModal(false);
//               loadCustomers();
//             } catch (err) {
//               Alert.alert('Error', 'Failed to delete customer');
//             }
//           },
//         },
//       ],
//     );
//   };

//   const markDone = async () => {
//     Alert.alert(
//       'Mark Service Complete?',
//       `Mark service as completed for ${selectedCustomer.name}?\n\nThis will update the next service date.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Mark Done',
//           onPress: async () => {
//             try {
//               await markServiceDone(selectedCustomer._id, token);
//               Alert.alert('Success', 'Service marked as completed');
//               setShowDetailModal(false);
//               loadCustomers();
//             } catch {
//               Alert.alert('Error', 'Failed to update service');
//             }
//           },
//         },
//       ],
//     );
//   };

//   const remind = async () => {
//     Alert.alert(
//       'Send Reminder?',
//       `Send service reminder to ${selectedCustomer.name}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Send',
//           onPress: async () => {
//             try {
//               await sendReminder(selectedCustomer._id, token);
//               Alert.alert('Success', 'Reminder sent successfully');
//               setShowDetailModal(false);
//             } catch {
//               Alert.alert('Error', 'Failed to send reminder');
//             }
//           },
//         },
//       ],
//     );
//   };

//   const filteredCustomers = customers.filter(c => {
//     const searchText = search.toLowerCase();
//     const matchesSearch =
//       c.name.toLowerCase().includes(searchText) ||
//       c.phone.includes(searchText) ||
//       (c.address || '').toLowerCase().includes(searchText);

//     if (!matchesSearch) return false;

//     const next = new Date(c.nextServiceDate || addDays(c.lastServiceDate, 90));
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     next.setHours(0, 0, 0, 0);

//     if (filter === 'overdue') return next < today;
//     if (filter === 'today') return next.getTime() === today.getTime();

//     return true;
//   });

//   const getStatusInfo = nextDate => {
//     const next = new Date(nextDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     next.setHours(0, 0, 0, 0);

//     if (next < today) {
//       return {
//         label: 'OVERDUE',
//         color: '#ef4444',
//         bg: '#fee2e2',
//         borderColor: '#ef4444',
//       };
//     } else if (next.getTime() === today.getTime()) {
//       return {
//         label: 'DUE TODAY',
//         color: '#f59e0b',
//         bg: '#fef3c7',
//         borderColor: '#f59e0b',
//       };
//     } else {
//       return {
//         label: 'UPCOMING',
//         color: '#10b981',
//         bg: '#d1fae5',
//         borderColor: '#10b981',
//       };
//     }
//   };

//   const renderItem = ({ item }) => {
//     const status = getStatusInfo(item.nextServiceDate);

//     return (
//       <TouchableOpacity
//         style={[styles.customerCard, { borderLeftColor: status.borderColor }]}
//         onPress={() => openCustomerDetails(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.cardContent}>
//           <View style={styles.avatarCircle}>
//             <Text style={styles.avatarText}>
//               {item.name.charAt(0).toUpperCase()}
//             </Text>
//           </View>

//           <View style={styles.customerInfo}>
//             <Text style={styles.customerName}>{item.name}</Text>
//             <View style={styles.phoneRow}>
//               <Text style={styles.phoneIcon}>📱</Text>
//               <Text style={styles.phoneText}>{item.phone}</Text>
//             </View>
//           </View>

//           <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
//             <View
//               style={[styles.statusDot, { backgroundColor: status.color }]}
//             />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerGradient} />
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerTitle}>Customers</Text>
//             <Text style={styles.headerSubtitle}>{customers.length} total</Text>
//           </View>
//           <TouchableOpacity style={styles.addButton} onPress={openAdd}>
//             <Text style={styles.addIcon}>+</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search */}
//         <View style={styles.searchContainer}>
//           <Text style={styles.searchIcon}>🔍</Text>
//           <TextInput
//             placeholder="Search customers..."
//             placeholderTextColor="#94a3b8"
//             value={search}
//             onChangeText={setSearch}
//             style={styles.searchInput}
//           />
//         </View>

//         {/* Filters */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterContainer}
//         >
//           <TouchableOpacity
//             style={[
//               styles.filterChip,
//               filter === 'all' && styles.filterChipActive,
//             ]}
//             onPress={() => setFilter('all')}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 filter === 'all' && styles.filterTextActive,
//               ]}
//             >
//               All
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.filterChip,
//               filter === 'today' && styles.filterChipActive,
//             ]}
//             onPress={() => setFilter('today')}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 filter === 'today' && styles.filterTextActive,
//               ]}
//             >
//               Due Today
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.filterChip,
//               filter === 'overdue' && styles.filterChipActive,
//             ]}
//             onPress={() => setFilter('overdue')}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 filter === 'overdue' && styles.filterTextActive,
//               ]}
//             >
//               Overdue
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>

//       {/* Customer List */}
//       <FlatList
//         data={filteredCustomers}
//         keyExtractor={i => i._id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyIcon}>👥</Text>
//             <Text style={styles.emptyTitle}>No Customers Found</Text>
//             <Text style={styles.emptyText}>
//               {search ? 'Try a different search' : 'Add your first customer'}
//             </Text>
//           </View>
//         }
//       />

//       {/* Customer Detail Modal */}
//       {selectedCustomer && (
//         <Modal visible={showDetailModal} transparent animationType="slide">
//           <View style={styles.modalOverlay}>
//             <View style={styles.detailModal}>
//               <View style={styles.detailHeader}>
//                 <Text style={styles.detailTitle}>Customer Details</Text>
//                 <TouchableOpacity onPress={() => setShowDetailModal(false)}>
//                   <Text style={styles.closeBtn}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView
//                 style={styles.detailContent}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {/* Avatar & Name */}
//                 <View style={styles.detailTop}>
//                   <View style={styles.detailAvatar}>
//                     <Text style={styles.detailAvatarText}>
//                       {selectedCustomer.name.charAt(0).toUpperCase()}
//                     </Text>
//                   </View>
//                   <Text style={styles.detailName}>{selectedCustomer.name}</Text>
//                   <View
//                     style={[
//                       styles.detailStatusBadge,
//                       {
//                         backgroundColor: getStatusInfo(
//                           selectedCustomer.nextServiceDate,
//                         ).bg,
//                       },
//                     ]}
//                   >
//                     <View
//                       style={[
//                         styles.statusDot,
//                         {
//                           backgroundColor: getStatusInfo(
//                             selectedCustomer.nextServiceDate,
//                           ).color,
//                         },
//                       ]}
//                     />
//                     <Text
//                       style={[
//                         styles.detailStatusText,
//                         {
//                           color: getStatusInfo(selectedCustomer.nextServiceDate)
//                             .color,
//                         },
//                       ]}
//                     >
//                       {getStatusInfo(selectedCustomer.nextServiceDate).label}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Info Cards */}
//                 <View style={styles.infoSection}>
//                   <View style={styles.infoCard}>
//                     <View style={styles.infoIconBox}>
//                       <Text style={styles.infoIcon}>📱</Text>
//                     </View>
//                     <View style={styles.infoTextBox}>
//                       <Text style={styles.infoLabel}>Phone Number</Text>
//                       <Text style={styles.infoValue}>
//                         {selectedCustomer.phone}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.infoCard}>
//                     <View style={styles.infoIconBox}>
//                       <Text style={styles.infoIcon}>📍</Text>
//                     </View>
//                     <View style={styles.infoTextBox}>
//                       <Text style={styles.infoLabel}>Address</Text>
//                       <Text style={styles.infoValue}>
//                         {selectedCustomer.address || 'No address provided'}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.infoCard}>
//                     <View style={styles.infoIconBox}>
//                       <Text style={styles.infoIcon}>🕒</Text>
//                     </View>
//                     <View style={styles.infoTextBox}>
//                       <Text style={styles.infoLabel}>Last Service</Text>
//                       <Text style={styles.infoValue}>
//                         {new Date(
//                           selectedCustomer.lastServiceDate,
//                         ).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.infoCard}>
//                     <View style={styles.infoIconBox}>
//                       <Text style={styles.infoIcon}>📅</Text>
//                     </View>
//                     <View style={styles.infoTextBox}>
//                       <Text style={styles.infoLabel}>Next Service</Text>
//                       <Text
//                         style={[
//                           styles.infoValue,
//                           {
//                             color: getStatusInfo(
//                               selectedCustomer.nextServiceDate,
//                             ).color,
//                           },
//                         ]}
//                       >
//                         {new Date(
//                           selectedCustomer.nextServiceDate,
//                         ).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={styles.actionSection}>
//                   <Text style={styles.actionSectionTitle}>Actions</Text>

//                   <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={remind}
//                   >
//                     <View
//                       style={[
//                         styles.actionButtonIcon,
//                         { backgroundColor: '#dbeafe' },
//                       ]}
//                     >
//                       <Text style={styles.actionButtonEmoji}>📲</Text>
//                     </View>
//                     <Text style={styles.actionButtonText}>Send Reminder</Text>
//                     <Text style={styles.actionArrow}>›</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={() => {
//                       setShowDetailModal(false);
//                       setSelectedForBooking(selectedCustomer);
//                       setShowBookModal(true);
//                     }}
//                   >
//                     <Text>📅 Book Service</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={markDone}
//                   >
//                     <View
//                       style={[
//                         styles.actionButtonIcon,
//                         { backgroundColor: '#d1fae5' },
//                       ]}
//                     >
//                       <Text style={styles.actionButtonEmoji}>✓</Text>
//                     </View>
//                     <Text style={styles.actionButtonText}>
//                       Mark Service Done
//                     </Text>
//                     <Text style={styles.actionArrow}>›</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={openEdit}
//                   >
//                     <View
//                       style={[
//                         styles.actionButtonIcon,
//                         { backgroundColor: '#f3f4f6' },
//                       ]}
//                     >
//                       <Text style={styles.actionButtonEmoji}>✏️</Text>
//                     </View>
//                     <Text style={styles.actionButtonText}>Edit Customer</Text>
//                     <Text style={styles.actionArrow}>›</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={removeCustomer}
//                   >
//                     <View
//                       style={[
//                         styles.actionButtonIcon,
//                         { backgroundColor: '#fee2e2' },
//                       ]}
//                     >
//                       <Text style={styles.actionButtonEmoji}>🗑️</Text>
//                     </View>
//                     <Text style={styles.actionButtonText}>Delete Customer</Text>
//                     <Text style={styles.actionArrow}>›</Text>
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {selectedForBooking && (
//         <BookServiceModal
//           visible={showBookModal}
//           customer={selectedForBooking}
//           token={token}
//           onClose={() => setShowBookModal(false)}
//           onSuccess={loadCustomers}
//         />
//       )}

//       {/* Add/Edit Modal */}
//       <Modal visible={showAddModal} transparent animationType="slide">
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   {editingId ? 'Edit Customer' : 'Add Customer'}
//                 </Text>
//                 <TouchableOpacity onPress={() => setShowAddModal(false)}>
//                   <Text style={styles.closeBtn}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView
//                 style={styles.modalContent}
//                 showsVerticalScrollIndicator={false}
//               >
//                 <View style={styles.modalIconCircle}>
//                   <Text style={styles.modalIcon}>👤</Text>
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Full Name *</Text>
//                   <TextInput
//                     placeholder="Enter customer name"
//                     placeholderTextColor="#94a3b8"
//                     value={name}
//                     onChangeText={setName}
//                     style={styles.modalInput}
//                   />
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Phone Number *</Text>
//                   <TextInput
//                     placeholder="Enter phone number"
//                     placeholderTextColor="#94a3b8"
//                     value={phone}
//                     onChangeText={setPhone}
//                     keyboardType="phone-pad"
//                     style={styles.modalInput}
//                   />
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Address</Text>
//                   <TextInput
//                     placeholder="Enter full address"
//                     placeholderTextColor="#94a3b8"
//                     value={address}
//                     onChangeText={setAddress}
//                     multiline
//                     numberOfLines={3}
//                     style={[
//                       styles.modalInput,
//                       { height: 80, textAlignVertical: 'top' },
//                     ]}
//                   />
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Last Service Date *</Text>
//                   <TextInput
//                     placeholder="YYYY-MM-DD (e.g., 2026-01-15)"
//                     placeholderTextColor="#94a3b8"
//                     value={lastServiceDate}
//                     onChangeText={setLastServiceDate}
//                     style={styles.modalInput}
//                   />
//                   <View style={styles.hintBox}>
//                     <Text style={styles.hintIcon}>ℹ️</Text>
//                     <Text style={styles.hintText}>
//                       Next service will be calculated after 90 days
//                     </Text>
//                   </View>
//                 </View>
//               </ScrollView>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.modalCancelBtn}
//                   onPress={() => setShowAddModal(false)}
//                 >
//                   <Text style={styles.modalCancelText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalSaveBtn}
//                   onPress={saveCustomer}
//                 >
//                   <Text style={styles.modalSaveText}>
//                     {editingId ? 'Update' : 'Save'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   header: {
//     backgroundColor: '#6366f1',
//     paddingTop: Platform.OS === 'ios' ? 60 : 50,
//     paddingBottom: 16,
//   },
//   headerGradient: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#6366f1',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginTop: 2,
//     fontWeight: '500',
//   },
//   addButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(255, 255, 255, 0.25)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addIcon: {
//     fontSize: 24,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     marginHorizontal: 20,
//     paddingHorizontal: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//   },
//   searchIcon: {
//     fontSize: 18,
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 15,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   filterContainer: {
//     paddingHorizontal: 20,
//     gap: 8,
//   },
//   filterChip: {
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     marginRight: 8,
//   },
//   filterChipActive: {
//     backgroundColor: '#fff',
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: 'rgba(255, 255, 255, 0.9)',
//   },
//   filterTextActive: {
//     color: '#6366f1',
//   },
//   listContent: {
//     padding: 16,
//   },
//   customerCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 10,
//     borderLeftWidth: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatarCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#6366f1',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   customerInfo: {
//     flex: 1,
//   },
//   customerName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 4,
//   },
//   phoneRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   phoneIcon: {
//     fontSize: 12,
//     marginRight: 6,
//   },
//   phoneText: {
//     fontSize: 14,
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   statusBadge: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyIcon: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#64748b',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   detailModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     maxHeight: '90%',
//   },
//   detailHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   detailTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1e293b',
//   },
//   closeBtn: {
//     fontSize: 24,
//     color: '#94a3b8',
//     fontWeight: '400',
//   },
//   detailContent: {
//     padding: 20,
//   },
//   detailTop: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   detailAvatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#6366f1',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailAvatarText: {
//     fontSize: 36,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   detailName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 8,
//   },
//   detailStatusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   detailStatusText: {
//     fontSize: 12,
//     fontWeight: '700',
//     marginLeft: 6,
//   },
//   infoSection: {
//     marginBottom: 24,
//   },
//   infoCard: {
//     flexDirection: 'row',
//     backgroundColor: '#f8fafc',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 10,
//   },
//   infoIconBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   infoIcon: {
//     fontSize: 18,
//   },
//   infoTextBox: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: '#94a3b8',
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   infoValue: {
//     fontSize: 15,
//     color: '#1e293b',
//     fontWeight: '600',
//   },
//   actionSection: {
//     marginBottom: 20,
//   },
//   actionSectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 12,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   actionButtonIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   actionButtonEmoji: {
//     fontSize: 18,
//   },
//   actionButtonText: {
//     flex: 1,
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1e293b',
//   },
//   actionArrow: {
//     fontSize: 24,
//     color: '#cbd5e1',
//     fontWeight: '300',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     maxHeight: '90%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1e293b',
//   },
//   modalContent: {
//     padding: 20,
//   },
//   modalIconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#eff6ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   modalIcon: {
//     fontSize: 40,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#475569',
//     marginBottom: 8,
//   },
//   modalInput: {
//     backgroundColor: '#f8fafc',
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 15,
//     color: '#1e293b',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   hintBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     backgroundColor: '#eff6ff',
//     padding: 10,
//     borderRadius: 8,
//   },
//   hintIcon: {
//     fontSize: 14,
//     marginRight: 8,
//   },
//   hintText: {
//     flex: 1,
//     fontSize: 12,
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#f1f5f9',
//     gap: 12,
//   },
//   modalCancelBtn: {
//     flex: 1,
//     backgroundColor: '#f1f5f9',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   modalCancelText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#64748b',
//   },
//   modalSaveBtn: {
//     flex: 1,
//     backgroundColor: '#6366f1',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   modalSaveText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
// });





// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   StyleSheet,
//   Alert,
//   Modal,
//   TouchableOpacity,
//   StatusBar,
//   ScrollView,
//   Dimensions,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import {
//   getWorkers,
//   createWorker,
//   deleteWorker,
//   resetWorkerPin,
// } from "../services/apiCore";

// const { width } = Dimensions.get('window');

// export default function WorkersScreen() {
//   const { token } = useContext(AuthContext);

//   const [workers, setWorkers] = useState([]);

//   // Add worker form
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [pin, setPin] = useState("");

//   // Reset PIN modal
//   const [showResetModal, setShowResetModal] = useState(false);
//   const [selectedWorkerId, setSelectedWorkerId] = useState(null);
//   const [selectedWorkerName, setSelectedWorkerName] = useState("");
//   const [newPin, setNewPin] = useState("");

//   const loadWorkers = async () => {
//     try {
//       const res = await getWorkers(token);
//       setWorkers(res.data);
//     } catch {
//       Alert.alert("Error", "Failed to load workers");
//     }
//   };

//   useEffect(() => {
//     loadWorkers();
//   }, []);

//   const handleCreateWorker = async () => {
//     if (!name || !phone || !pin) {
//       return Alert.alert("Required", "All fields are required");
//     }

//     if (pin.length < 4) {
//       return Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
//     }

//     try {
//       await createWorker({ name, phone, pin }, token);
//       setName("");
//       setPhone("");
//       setPin("");
//       setShowAddForm(false);
//       loadWorkers();
//       Alert.alert("Success", "Worker added successfully");
//     } catch {
//       Alert.alert("Error", "Failed to add worker");
//     }
//   };

//   const handleDelete = async (id, workerName) => {
//     Alert.alert(
//       "Delete Worker?",
//       `Are you sure you want to delete ${workerName}? This action cannot be undone.`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await deleteWorker(id, token);
//               loadWorkers();
//               Alert.alert("Deleted", "Worker has been removed");
//             } catch {
//               Alert.alert("Error", "Failed to delete worker");
//             }
//           },
//         },
//       ]
//     );
//   };

//   const openResetModal = (id, workerName) => {
//     setSelectedWorkerId(id);
//     setSelectedWorkerName(workerName);
//     setNewPin("");
//     setShowResetModal(true);
//   };

//   const submitResetPin = async () => {
//     if (!newPin || newPin.length < 4) {
//       return Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
//     }

//     try {
//       await resetWorkerPin(selectedWorkerId, newPin, token);
//       Alert.alert("Success", "PIN updated successfully");
//       setShowResetModal(false);
//     } catch {
//       Alert.alert("Error", "Failed to reset PIN");
//     }
//   };

//   const renderWorker = ({ item }) => (
//     <View style={styles.workerCard}>
//       <View style={styles.workerHeader}>
//         <View style={styles.workerAvatar}>
//           <Text style={styles.workerAvatarText}>
//             {item.name.charAt(0).toUpperCase()}
//           </Text>
//         </View>
//         <View style={styles.workerInfo}>
//           <Text style={styles.workerName}>{item.name}</Text>
//           <View style={styles.phoneRow}>
//             <View style={styles.phoneIconBox}>
//               <Text style={styles.phoneIcon}>📱</Text>
//             </View>
//             <Text style={styles.workerPhone}>{item.phone}</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity
//           style={[styles.workerBtn, styles.resetBtn]}
//           onPress={() => openResetModal(item._id, item.name)}
//         >
//           <Text style={styles.workerBtnIcon}>🔑</Text>
//           <Text style={styles.resetBtnText}>Reset PIN</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.workerBtn, styles.deleteBtn]}
//           onPress={() => handleDelete(item._id, item.name)}
//         >
//           <Text style={styles.workerBtnIcon}>🗑️</Text>
//           <Text style={styles.deleteBtnText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#8b5cf6" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerGradient} />
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerTitle}>Workers</Text>
//             <Text style={styles.headerSubtitle}>
//               {workers.length} {workers.length === 1 ? "worker" : "workers"} active
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => setShowAddForm(true)}
//           >
//             <Text style={styles.addIcon}>+</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Workers List */}
//       {workers.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyIcon}>👷</Text>
//           <Text style={styles.emptyTitle}>No Workers Yet</Text>
//           <Text style={styles.emptyText}>
//             Add your first worker to help manage customers
//           </Text>
//           <TouchableOpacity
//             style={styles.emptyButton}
//             onPress={() => setShowAddForm(true)}
//           >
//             <Text style={styles.emptyButtonText}>Add Worker</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={workers}
//           keyExtractor={(item) => item._id}
//           renderItem={renderWorker}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       {/* Add Worker Modal */}
//       <Modal visible={showAddForm} transparent animationType="slide">
//         <KeyboardAvoidingView 
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={{ flex: 1 }}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Add New Worker</Text>
//                 <TouchableOpacity onPress={() => setShowAddForm(false)}>
//                   <Text style={styles.closeBtn}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//                 <View style={styles.iconCircle}>
//                   <Text style={styles.modalIcon}>👷</Text>
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Worker Name *</Text>
//                   <TextInput
//                     placeholder="Enter worker name"
//                     placeholderTextColor="#94a3b8"
//                     value={name}
//                     onChangeText={setName}
//                     style={styles.modalInput}
//                   />
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>Phone Number *</Text>
//                   <TextInput
//                     placeholder="Enter phone number"
//                     placeholderTextColor="#94a3b8"
//                     value={phone}
//                     onChangeText={setPhone}
//                     keyboardType="phone-pad"
//                     style={styles.modalInput}
//                   />
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>PIN *</Text>
//                   <TextInput
//                     placeholder="Enter 4-6 digit PIN"
//                     placeholderTextColor="#94a3b8"
//                     value={pin}
//                     onChangeText={setPin}
//                     secureTextEntry
//                     keyboardType="numeric"
//                     maxLength={6}
//                     style={styles.modalInput}
//                   />
//                   <View style={styles.hintBox}>
//                     <Text style={styles.hintIcon}>ℹ️</Text>
//                     <Text style={styles.hintText}>
//                       Worker will use this PIN to login to the app
//                     </Text>
//                   </View>
//                 </View>
//               </ScrollView>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.modalCancelBtn}
//                   onPress={() => setShowAddForm(false)}
//                 >
//                   <Text style={styles.modalCancelText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalSaveBtn}
//                   onPress={handleCreateWorker}
//                 >
//                   <Text style={styles.modalSaveText}>Add Worker</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* Reset PIN Modal */}
//       <Modal visible={showResetModal} transparent animationType="fade">
//         <KeyboardAvoidingView 
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={{ flex: 1 }}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={[styles.modalContainer, styles.resetModalContainer]}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Reset PIN</Text>
//                 <TouchableOpacity onPress={() => setShowResetModal(false)}>
//                   <Text style={styles.closeBtn}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//                 <View style={styles.iconCircle}>
//                   <Text style={styles.modalIcon}>🔑</Text>
//                 </View>

//                 <Text style={styles.resetWorkerName}>{selectedWorkerName}</Text>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.inputLabel}>New PIN *</Text>
//                   <TextInput
//                     placeholder="Enter new 4-6 digit PIN"
//                     placeholderTextColor="#94a3b8"
//                     value={newPin}
//                     onChangeText={setNewPin}
//                     secureTextEntry
//                     keyboardType="numeric"
//                     maxLength={6}
//                     style={styles.modalInput}
//                   />
//                   <Text style={styles.inputHint}>
//                     Worker will need this new PIN to login
//                   </Text>
//                 </View>
//               </ScrollView>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.modalCancelBtn}
//                   onPress={() => setShowResetModal(false)}
//                 >
//                   <Text style={styles.modalCancelText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.modalSaveBtn}
//                   onPress={submitResetPin}
//                 >
//                   <Text style={styles.modalSaveText}>Update PIN</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   header: {
//     paddingBottom: 16,
//     overflow: 'hidden',
//   },
//   headerGradient: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#8b5cf6',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'ios' ? 60 : 50,
//     paddingBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginTop: 2,
//     fontWeight: '500',
//   },
//   addButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(255, 255, 255, 0.25)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addIcon: {
//     fontSize: 24,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   listContent: {
//     padding: 16,
//   },
//   workerCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   workerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   workerAvatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#8b5cf6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   workerAvatarText: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: '800',
//   },
//   workerInfo: {
//     flex: 1,
//   },
//   workerName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 6,
//   },
//   phoneRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   phoneIconBox: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#f1f5f9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   phoneIcon: {
//     fontSize: 12,
//   },
//   workerPhone: {
//     fontSize: 14,
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   actionRow: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   workerBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   resetBtn: {
//     backgroundColor: '#eff6ff',
//   },
//   deleteBtn: {
//     backgroundColor: '#fef2f2',
//   },
//   workerBtnIcon: {
//     fontSize: 16,
//   },
//   resetBtnText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1e40af',
//   },
//   deleteBtnText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#dc2626',
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyIcon: {
//     fontSize: 80,
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 15,
//     color: '#64748b',
//     textAlign: 'center',
//     marginBottom: 28,
//     lineHeight: 22,
//   },
//   emptyButton: {
//     backgroundColor: '#8b5cf6',
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 16,
//     shadowColor: '#8b5cf6',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emptyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     maxHeight: '85%',
//   },
//   resetModalContainer: {
//     maxHeight: '65%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1e293b',
//   },
//   closeBtn: {
//     fontSize: 24,
//     color: '#94a3b8',
//     fontWeight: '400',
//   },
//   modalContent: {
//     padding: 20,
//   },
//   iconCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#f3e8ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   modalIcon: {
//     fontSize: 40,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 8,
//   },
//   modalInput: {
//     backgroundColor: '#f8fafc',
//     borderWidth: 2,
//     borderColor: '#e2e8f0',
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 15,
//     color: '#1e293b',
//     fontWeight: '500',
//   },
//   inputHint: {
//     fontSize: 12,
//     color: '#64748b',
//     marginTop: 6,
//     fontWeight: '500',
//   },
//   hintBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#eff6ff',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 8,
//   },
//   hintIcon: {
//     fontSize: 14,
//     marginRight: 8,
//   },
//   hintText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#1e40af',
//     fontWeight: '500',
//     lineHeight: 18,
//   },
//   resetWorkerName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1e293b',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#f1f5f9',
//   },
//   modalCancelBtn: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     backgroundColor: '#f1f5f9',
//   },
//   modalCancelText: {
//     color: '#64748b',
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   modalSaveBtn: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     backgroundColor: '#8b5cf6',
//     shadowColor: '#8b5cf6',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   modalSaveText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 15,
//   },
// });
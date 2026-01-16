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

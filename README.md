
# OpenInventory - Mobile Inventory App <img src="./icon.png" alt="OpenInventory app icon" width="48" align="right" />

**Keep Track.** OpenInventory is designed for everyday people who want to keep track of their day-to-day life on the go. From business owners to help desk clerks, OpenInventory is designed to help you no matter your experience.

## App Features

### Distinct Inventory Tracking
- **Administrator Privilege Support**: Create and manage separate inventories that can have their own users assigned to it with admin or member permissions 
- **Users**: Signup and login with a username and password to access your inventory
- **Invite**: Add members to your inventory via Manage Users screen
- **Organization**: Keep track of items by placing them in your inventory 
- **Stock Tracker**: Store information about Quantity of individual items in your inventory.
- **Detailed Description**: Each item is associated with a name, picture, barcode, price and brand.
- **Multi-User Support**: Share inventories via internet connectivity.

### Barcode Scanning
- **Camera Support**: Interact with item data by scanning your item's physical barcode to recognize it
- **Barcode-to-text:** Autofill item creation / item edit forms by automatically parsing barcodes from viewfinder. 

### Low Inventory Alerts
- **Notification Support**: Get alerts when your item's quantity reaches a specified threshold
- **Alert Screen**: General overview of all items that are below the low stock threshold by severity

### Item Tracking

- **Search**: Create queries for specific items by attributes such as name or barcode, or sort by ascending / descending quantity
- **Global Database**: Create global item data that can then be used to create entries of an item in different inventories
- **Distinct Local Items**: Item entries in each inventory are distinct even if they use the same catalog item from the global database




### General features
- **Cross-platform Android/iOS Build Support**
- **Image Support**
- **Database Connectivity**
- **Notification Support**
- **Navigation Bar**
- **Authentication**
## Getting Started - Running App

>**IMPORTANT**: Expo GO from the App Store / Google Play and up-to-date versions of npm + NodeJS are required to run the frontend. 
    - [App Store Link](https://apps.apple.com/us/app/expo-go/id982107779)
    - [Installing NPM and NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

 1. **Clone the repository:**

    ```
    git clone https://github.com/Israel-Jauregui/OpenInventory
    ```


 2. **CD to OpenInventory/frontend**

    ```
    cd OpenInventory/frontend
    ```

 3. **Install packages using npm install**

    ```
    npm install
    ```

 4. **Start the frontend server**

    >**NOTE:** If scanning the QR code after running npx expo start makes Expo GO hang on "Opening Project", make sure that your computer and mobile device are on the same network or run npx expo start --tunnel. npx expo start --tunnel may require multiple attempts if you get a "Cannot read properties of undefined (reading 'body')" error.
    ```
    npx expo start
    ```

 5. **Launch the frontend on a mobile device using Expo GO**
    - 1. Ensure that your computer running the frontend server and your mobile device are on the same network if not using npx expo start --tunnel
    - 2. Open your device's Camera app
    - 3. Scan the QR code shown in your computer's terminal
## Getting Started - Using App
1. On the login screen, log in using your credentials or press "Need an account?" to create one, then login with those credentials.

2. Select or create an inventory.

3. Start creating item master data by clicking "Create Item Master Data" on the Home Tab or manipulate existing items on either the Home or Items tabs.

4. Tap on individual items on the Items tab to view more information such as the item's description.

- Home buttons that involve altering data such as "Change Quantity" will present you with a camera view to scan  a barcode.
- The Items tab will present you with all of your items in your currently selected inventory.
- Item data can be changed via either the buttons on the Home tab or the buttons on each item in the Items tab.
## Getting Started - Running Release
> OpenInventory has been released only for Android Devices, IOS devices can only currently access OpenInventory via Expo GO. 

### From Release 

1. **Download the Latest Release**: 
   - Navigate to releases page from the OpenInventory GitHub repository

2. **Extract Contents/Install APK**: 
   - Install Application via Downloaded APK

3. **Launch OpenInventory via App Launcher**: 
   - Select OpenInventory from homescreen to launch app



## OpenInventory - Mobile Inventory App

**Keep Track.** OpenInventory is designed for everyday people who want to keep track of their day-to-day life. From business owners to help desk clerks, OpenInventory is designed to help you no matter your experience.

## Getting Started

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

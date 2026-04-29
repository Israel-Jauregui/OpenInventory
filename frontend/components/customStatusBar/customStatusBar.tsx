import React, {useState} from 'react';
import {
  StatusBar,
  StatusBarStyle,
} from 'react-native';

export default function CustomStatusBar() {
    return (
        <StatusBar
            animated={true}
            backgroundColor="#02161b"
            barStyle={'dark-content'}         
        />
    );
       

}


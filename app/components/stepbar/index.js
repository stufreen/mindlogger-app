
import React, { Component } from 'react';
import {View} from 'native-base'
export default class Stepbar extends Component {
  render() {
    const { progress,  ...props } = this.props
    let barStyle = {...this.props.barStyle, width:`${progress*100}%`, height: '100%'}
    let style = {...this.props.style, flexDirection: 'column', flex:1, borderWidth: 0.5 }
    return (
      <View style={style}>
      <View style={barStyle} />
      </View>
    );
  }

}

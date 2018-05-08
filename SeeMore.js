import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Platform,
  I18nManager,
  LayoutAnimation,
  NativeModules,
} from 'react-native'

const { UIManager } = NativeModules;

import MeasureText from 'react-native-text-size';

export default class SeeMore extends React.Component {

	constructor(props) {
		super(props)
		if (Platform.OS == 'android') {
			let { style, textStyle } = this.props
			this.padding = 20
			this.padding += style.paddingLeft || style.padding || 0
			this.padding += style.paddingRight || style.padding || 0
			this.padding += textStyle.marginRight || textStyle.margin || 0
			this.padding += textStyle.marginLeft || textStyle.margin || 0
		} else {
			this.padding = 0
		}

		this.state = {
			firstLine: null,
			restLine: null,
			showAll: false,
		}
	}

	componentDidMount() {
		let { text, style, textStyle } = this.props

		if(style.width) {

        	this.mesure(text, style.width - this.padding, textStyle);
        }
        if (Platform.OS === 'android') {
	      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	    }
	}

	async mesure(text, width, style, height) {
	    if (!width) {
	      return false;
	    }
	    if (!height) {
	      const lineSize = await MeasureText.measure({
	        texts: ['LK&71'],
        	text: 'LK&71',       // texts to measure
	        fontSize: style.fontSize,
	        fontFamily: style.fontFamily,
	        width: width,
	      });
	      height = Platform.OS == 'ios'? lineSize[0]: lineSize.height;
	      this.mesure(text, width, style, (this.props.numberOfLines-1)*height)
	    } else {
	    	this.chackMesure(text, width, style, height);
	    }
	}
	async chackMesure(text, width, style, height) {
	    if (!width || !height || !text || !style) {
	      return false;
	    }

	    const size = await MeasureText.measure({
			texts: [text],
			text: text,
			fontSize: style.fontSize,
			fontFamily: style.fontFamily,
			width: width,
	    });
	    let linesHeight = Platform.OS == 'ios'? size[0]: size.height;
	    if (linesHeight > height + 1.5) {
	      let arr = text.split(' ');
	      arr.pop();
	      text = arr.join(' ')
	      this.chackMesure(text,width,style,height);
	    } else {
	    	this.setState({firstLine: text,restLine: this.props.text.replace(text, '').trim() })
		}
	}

	renderFirstLines() {
		let { numberOfLines, text, textStyle } = this.props
		let { firstLine } = this.state;
		return (
			<Text
              numberOfLines={numberOfLines-1}
              onLayout={(e) => {
                if(!firstLine && !this.props.style.width) {
                  this.mesure(text, e.nativeEvent.layout.width - this.padding, textStyle);
                }
              }}
              style={textStyle}
            >{ firstLine?firstLine:text }</Text>
			)
	}
	renderRestLines() {
		let { text, textStyle } = this.props
		let { restLine, firstLine } = this.state;
		return (
			<Text
			numberOfLines={1}
			style={[{flex: 1},textStyle]}
			>{firstLine?restLine:text}</Text>
		)
	}
	renderSeeMore() {
		let { onPress, textStyle, SeeMoreText, SeeMoreColor, numberOfLines, forceSeeMore, SeeLessText } = this.props
		let { restLine, firstLine, showAll } = this.state;

		if (!restLine || !firstLine || restLine.length < firstLine.length/(numberOfLines-1) ) {
			SeeMoreText = forceSeeMore?SeeMoreText:'';
		}

		if (onPress == null) {
			onPress = () => {
				LayoutAnimation.linear();
				this.props.onPressAddition();
				this.setState({showAll: !showAll})
			}
		}
		return (
			<Text onPress={onPress} style={[textStyle, {color: SeeMoreColor, alignSelf: 'flex-end'}]}>{ showAll?SeeLessText:SeeMoreText}</Text>
			)
	}
	renderAll() {
		let { style, textStyle, text, SeeMoreColor, SeeLessText, RTLSupport } = this.props
		let isRTL = RTLSupport && I18nManager.isRTL;
		return (
			<View style={[{width: '100%'},style]}>
				<Text 
					style={textStyle}>{ !isRTL && text+'  ' }{ this.renderSeeMore() }{ isRTL && text+'  ' }</Text>
			</View>
			)
	}

	render() {
		let { showAll } = this.state;
		let {
			style,
			RTLSupport,
		} = this.props
		let isRTL = RTLSupport && I18nManager.isRTL;
	
		if (showAll) {
			return this.renderAll();
		} else {
			return (
				<View style={[{width: '100%'},style]}>
		            { this.renderFirstLines() }
		            <View style={{flexDirection: isRTL?'row-reverse':'row',justifyContent: 'space-between'}}>
		              { this.renderRestLines() }
		              { this.renderSeeMore() }
		            </View>
		        </View>
		    )
		}
	}
}

SeeMore.propTypes = {
	text: PropTypes.string,
	numberOfLines: PropTypes.number,
	textStyle: PropTypes.object,
	SeeMoreText: PropTypes.string,
	SeeLessText: PropTypes.string,
	SeeMoreColor: PropTypes.string,
	onPress: PropTypes.func,
	onPressAddition: PropTypes.func,
	style: PropTypes.object,
	forceSeeMore: PropTypes.bool,
	RTLSupport: PropTypes.bool,
};

SeeMore.defaultProps = {
	text: '',
	numberOfLines: 3,
	textStyle: {},
	SeeMoreText: 'See More',
	SeeLessText: 'See Less',
	SeeMoreColor: '#5855e7',
	onPress: null,
	onPressAddition: () =>{},
	style: {},
	forceSeeMore: false,
	RTLSupport: true,
};
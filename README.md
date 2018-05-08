# react-native-see-more



this will help you to add a clikable "see more" at the end of your text




### most importent
    this code is using react-native-text-size library so  'npm i --save react-native-text-size'
    

###props

  text  | string  | the text that you want to see more of
	numberOfLines | number  | pretty obvius
	textStyle | object  | pretty obvius
  SeeMoreText | string  | pretty obvius
	SeeLessText | string  | use only in case onPress is unassign
	SeeMoreColor | string (color)  | use only in case onPress is unassign
	onPress | function  | call when you click on see more (insted of default action)
	onPressAddition | function  | call when you click on see more and onPress is unassign (in addition to default action)
	stylen | style  | wrap style of the all View
	forceSeeMore | bool  | if true you will see the "see more" even if the text fit in the given space
	RTLSupport | bool  | right to left support

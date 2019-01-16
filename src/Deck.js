import React, { Component } from 'React';
import { View, Animated, PanResponder, Dimensions,LayoutAnimation,UI Manager } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25*SCREEN_WIDTH;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }
    constructor(props) {
        super(props);
        const position = new Animated.ValueXY();
        const PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: () => {
                if (gesture.dx>SWIPE_THRESHOLD) {
                   this.forceSwipe('right');
                }
                else if (gesture.dx < -SWIPE_THRESHOLD){
                   this.forceSwipe('left');
                }
                else{
                this.resetPosition();
                }
            }

        });
        this.state = { PanResponder, position, index: 0 };
    }
    ComponentWillRecieveProps(nextProps) {
       if(nextProps.data !== this.props.data) 
       {
           this.setState({index:0});
       }
    }
    ComponentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }
    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y:0}
            duration:250
        }).start(() => this.onSwipeComplete(direction));
        onSwipeComplete(direction){
            const { onSwipeLeft, onSwipeRight, data } = this.props;
            const item = data[this.state.index];

            direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
            this.state.position.setValue({ x: 0, y: 0});
            this.setState({ index: this.state.index + 1 });
        }
    }
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x:0, y:0}
        }).start();
    }
    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH*1.5,0,SCREEN_WIDTH*1.5],
            outputRange:['-120deg' , '0deg' , '120deg']
        });
        return {
            ...this.state.position.getLayout(),
            transform:[{ rotate: '-45deg' }]
        };
    }
    renderCards() {
       
            if(this.state.index >= this.props.data.length){
              return this.props.renderNoMoreCards();
            }
        
        return this.props.data.map((item, i) => {
            if(i<this.state.index){
                return null;
            }
            if(i==this.state.index) {
                return
                 <Animated.View
                 key={item.id}
            style={[this.getCardStyle(),styles.cardStyle] }
            {...this.state.PanResponder.panHandlers}
            >
             {this.props.renderCard(item)}
             </Animated.View>
        );
            }
          return (<Animated.View key={item.id} style={[styles.cardStyle, {top:10*(i-this.state.index)]}
          >
          this.props.renderCard(item);
          </Animated.View>);
        }).reverse();
    }
    render() {
        return (
           <View>
            {this.renderCards()}
            </View>
         
        );
    }
}
const styles = {
    cardStyle: {
        position: 'absolute',
        width:SCREEN_WIDTH
    }
};
export default Deck;

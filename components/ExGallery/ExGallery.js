import React, { Component, createRef } from "react";
import {
    Animated,
    StyleSheet,
    View,
    StatusBar,
    BackHandler,
} from "react-native";

import GallerySwiper from "react-native-gallery-swiper";

class ExGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };

        this.props = props;
        this.images = props.images;
        this.id = props.id;
        this.header = props.header;
        this.fadeAnim = new Animated.Value(this.state.visible ? 1 : 0);
        this.initialPage = props.initialPage || 0;

        this.styles = StyleSheet.create({
            container: {
                height: "100%",
                backgroundColor: "black",
                ...props?.style?.container,
            },
            gallery: {
                flex: 1,
                width: "100%",
                height: "100%",
                ...props?.style?.gallery,
            },
            header: {
                position: "absolute",
                top: 0,
                zIndex: 100,
                width: "100%",
                paddingBottom: 8,
                ...props?.style?.header,
            },
        });

        this.gallerySwiper = createRef();
    }

    backAction = () => {
        this.props?.onClose?.();
    };

    animateHeader = () => {
        Animated.timing(this.fadeAnim, {
            toValue: this.state.visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {
        return (
            <View style={this.styles.container}>
                <StatusBar barStyle="light-content" />
                {this.header && (
                    <Animated.View
                        style={{
                            ...this.styles.header,
                            opacity: this.fadeAnim,
                        }}
                    >
                        {this.header}
                    </Animated.View>
                )}
                <GallerySwiper
                    refPage={(component) => (this.gallerySwiper = component)}
                    style={this.styles.gallery}
                    images={this.props.images}
                    initialPage={this.initialPage}
                    initialNumToRender={2}
                    sensitiveScroll={this.props?.sensitiveScroll || false}
                    onPageSelected={(idx) => {
                        this.props?.onPageSelected?.(idx);
                    }}
                    onSingleTapConfirmed={() => {
                        this.setState(
                            {
                                visible: !this.state.visible,
                            },
                            this.animateHeader
                        );

                        this.props?.onSingleTapConfirmed?.();
                    }}
                    onEndReached={() => {
                        this.props?.onEndReached?.();
                    }}
                    onEndReachedThreshold={
                        this.props?.onEndReachedThreshold || 0.5
                    }
                    resizeMode="contain"
                    flatListProps={{
                        windowSize: 3,
                    }}
                />
            </View>
        );
    }
}

export default ExGallery;

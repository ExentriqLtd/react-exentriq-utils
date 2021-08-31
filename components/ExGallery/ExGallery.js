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
            init: false,
            visible: false,
            initialPage: this.props?.initialPage || 0,
            images: this.props.images,
        };

        this.props = props;
        this.fadeAnim = new Animated.Value(this.state.visible ? 1 : 0);

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

        this.gallerySwiper = React.createRef();
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

    componentDidUpdate(prevProps) {
        if (prevProps.images.length < this.props.images.length) {
            this.setState({ images: this.props.images });
        }

        // Check for init and images available to change page to initial page
        if (!this.state.init && this.state.images.length > 0) {
            this.gallerySwiper.current.scrollToPage({
                index: this.props.initialPage,
                immediate: false,
            });

            this.setState({ init: true });
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();

        this.setState({ init: false });
        this.setState({ initialPage: -1 });
        this.setState({ images: [] });
        this.setState({ visible: false });
    }

    render() {
        return (
            <View style={this.styles.container}>
                <StatusBar barStyle="light-content" />
                {this.props.header && (
                    <Animated.View
                        style={{
                            ...this.styles.header,
                            opacity: this.fadeAnim,
                        }}
                    >
                        {this.props.header}
                    </Animated.View>
                )}
                <GallerySwiper
                    ref={this.gallerySwiper}
                    style={this.styles.gallery}
                    images={this.state.images}
                    initialNumToRender={this.state.initialPage + 2}
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

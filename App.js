import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Linking
} from "react-native";
import moment from "moment";
import { Card, Button, Icon } from "react-native-elements";
//https://newsapi.org/v2/top-headlines?country=us&apiKey=af50d0b118a242e9bae35e35c7936b53
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      articles: [],
      page: 1
    };
  }
  componentDidMount = () => this.getNews();
  getNews = async () => {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=af50d0b118a242e9bae35e35c7936b53&page=$(this.state.page)"
    );
    const data = await response.json();
    const articles = this.state.articles.concat(data.articles);
    this.setState({
      articles: articles,
      loading: false,
      page: this.state.page + 1
    });
  };
  renderArticleItem = ({ item: articles }) => {
    return (
      <View style={styles.containerFlex}>
        <Card title={articles.title} image={{ uri: articles.urlToImage }}>
          <View style={styles.row}>
            <Text style={styles.label}>Source</Text>
            <Text style={styles.info}>{articles.source.name}</Text>
          </View>
          <Text>{articles.content}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Published</Text>
            <Text style={styles.info}>
              {moment(articles.publishedAt).format("LLL")}
            </Text>
          </View>
          <Button
            icon={<Icon />}
            title="Read more"
            backgroundColor="#03A9F4"
            onPress={() => this.onPress(articles.url)}
          />
        </Card>
      </View>
    );
  };
  onPress = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URL: ${url}`);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={StyleSheet.container}>
          <ActivityIndicator size="large" loading={this.state.loading} />
          <Text> App </Text>
        </View>
      );
    }
    const { articles } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Articles Count:</Text>
          <Text style={styles.info}>{articles.length}</Text>
        </View>
        <FlatList
          data={articles}
          renderItem={this.renderArticleItem}
          keyExtractor={item => item.title}
          onEndReached={this.getNews}
          onEndReachedThreshold={1}
          //onRefresh={this.getNews}
          ListFooterComponent={
            <ActivityIndicator size="large" loading={this.state.loading} />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  header: {
    height: 30,
    width: "100%",
    backgroundColor: "pink"
  },
  row: {
    flexDirection: "row"
  },
  label: {
    fontSize: 16,
    color: "black",
    marginRight: 10,
    fontWeight: "bold"
  },
  info: {
    fontSize: 16,
    color: "grey"
  }
});

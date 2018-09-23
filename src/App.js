import React from "react";
import "./App.css";
import Spotify from "./util/spotify.js";
const R = require("ramda");

// Renders the results of the search

const AlbumSearchResults = props => {
  const results = props.searchResults || [];
  if (results.length !== 0) {
    return (
      <div className="SearchResults">
        <ul>
          <div className="SearchResults">
            <h1>Search Results: </h1>
            {results.map(album => {
              return (
                <div className="renderedResults">
                  <h2>
                    <li>{album.artists[0].name}</li>
                    <li>{album.name}</li>
                    <img src={album.images[0].url} />
                    <br />
                    <button
                      className="Sell"
                      onClick={e =>
                        props.handleAddToCart(
                          e,
                          album.artists[0].name,
                          album.name,
                          album.images[0].url,
                          album.id
                        )
                      }
                    >
                      Sell
                    </button>
                  </h2>{" "}
                </div>
              );
            })}
          </div>
        </ul>
      </div>
    );
  } else {
    return (
      <div className="emptySearch">
        <h2 />
      </div>
    );
  }
};

// Handles the app's searchbar component
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(type, e) {
    this.props.search(type, e.target.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Search Albums"
          onChange={e => this.handleTermChange("album", e)}
        />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birfWallet: 1000,
      yourWallet: 0,
      searchResults: [],
      thisResult: [],
      trackResults: [],
      trackPop: []
    };
  }

  handleAddToCart = (e, artist, album, images, id) => {
    console.log(artist);
    console.log(album);
    console.log(id);
    this.fetchData(id);
    console.log(this.state.searchResults);
    this.setState({
      thisResult: id
    });
    console.log(this.state.thisResult);
  };

  fetchData = () => {
    let thisId = this.state.thisResult;

    const popSearch = id => {
      Spotify.search("track", undefined, thisId).then(items => {
        this.setState({
          trackResults: items,
          currentSearchType: "album"
        });
      });
    };

    popSearch();
    console.log(this.state.trackResults);
  };

  search = (type, input, id) => {
    Spotify.search(type, input, id).then(searchResults => {
      return this.setState({
        searchResults: searchResults,
        currentSearchType: type
      });
    });
  };

  render() {
    let resultComponent;

    resultComponent = (
      <div>
        <AlbumSearchResults
          searchResults={this.state.searchResults}
          addToCart={this.addToCart}
          handleAddToCart={this.handleAddToCart}
          handleGetTrackPop={this.handleGetTrackPop}
          popResults={this.popResults}
          popSearch={this.popSearch}
        />
      </div>
    );
    return (
      <div>
        <meta name="pinterest" content="nopin" />
        <div className="Header">
          <h1>What d'ya got?</h1>
        </div>
        <div className="Wallets">
          <h2>Birf's wallet: ${this.state.birfWallet}</h2>
          <h2>Your wallet: ${this.state.yourWallet}</h2>
        </div>
        <div className="App">
          <Search search={this.search} />
          {resultComponent}
        </div>
      </div>
    );
  }
}

export default App;

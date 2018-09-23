const client_id = "1a5cb04b911c4b0c8924e6f92be3139a";
const redirect_uri = encodeURIComponent("http://localhost:3000");
let accessToken = undefined;
let expiresIn = undefined;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    }
  },

  async search(type, term, id) {
    this.getAccessToken();

    const query = () => {
      if (type === "album") {
        return `https://api.spotify.com/v1/search?q=${term}&type=${type}`;
      } else if (type === "track") {
        return `https://api.spotify.com/v1/albums/${id}/tracks?offset=0&limit=20`;
      }
    };
    if (type === "track" || "album") {
      return fetch(query(), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (`${type}` === "album" && jsonResponse.albums) {
            return jsonResponse.albums.items;
          } else if (`${type}` === "track" && jsonResponse.items) {
            return jsonResponse.items;
          }
        });
    }
  }
};

export default Spotify;

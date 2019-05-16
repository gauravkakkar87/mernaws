import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: '',
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      //let interval = setInterval(this.getDataFromDb, 1000);
      //this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:4000/products")
      .then(data => data.json())
      .then(res => this.setState({ data: res.reverse() }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    axios
      .post("http://localhost:4000/products", {
        message: message
      })
      .then(this.getDataFromDb);
      this.setState({ message: '' });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    axios.post("http://localhost:4000/products/delete/", {
      data: {
        productId: idTodelete
      }
    }).then(this.getDataFromDb);
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center border border-bottom-0 p-2">
            <h3>Simple App with API</h3>
          </div>
          <div className="col-md-6 border border-right-0 p-3">
            <h5>Create</h5>
            <div className="form-inline">
              <form className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={e => this.setState({ message: e.target.value })}
                  placeholder="add to database"
                  value={this.state.message}
                  style={{ width: "200px" }}
                />
                <input
                  type="submit"
                  className="btn btn-primary ml-2"
                  onClick={() => this.putDataToDB(this.state.message)}
                  value="ADD"
                />
              </form>
            </div>
          </div>
          <div className="col-md-6  border p-3">
            <h5>Responses => {data.length}</h5>
            <ul className="list-group">
              {data.length <= 0
                ? "NO DB ENTRIES YET"
                : data.map(dat => (
                    <li
                      className="list-group-item"
                      style={{ padding: "10px" }}
                      key={data._id}
                    >
                      <span style={{ color: "gray" }}> Name: </span> {dat.title}{" "}
                      <button
                        type="button"
                        className="close"
                        onClick={() => this.deleteFromDB(dat._id)}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

'use strict';
console.log("loading app");
/*
TODOS:
  - use arrow syntax for lulz
  - add share to twitter button
*/

  var getRandom = (arr)=>{
    var len = arr.length-1;
    var num = Math.floor(Math.random() * (len + 1)) + 0;
    return num;
  };

  var App = React.createClass({
    getInitialState: () => {
      return {
        showLoader: true,
        data:[],
        current:{},
        index: 0
      };
    },
    clickHandler: ()=>{
      var _data = this.state.data;
      var newCard = getRandom(this.state.data);

      this.setState({
        current:_data[newCard],
        index: newCard
      });

      window.location="#"+newCard;
    },
    componentDidMount: ()=>{
      //window.location.hash
      var _this=this;
      console.log("app component mounting");

      var request = new XMLHttpRequest();
      var url = "api.json";

      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          var _data = JSON.parse(request.response);
          var rando;

          if (window.location.hash) {
            rando = parseInt(window.location.hash.substr(1));
          }else{
            rando = getRandom(_data.data);
            window.location="#"+rando;
          };
          _this.setState({data:_data.data,
            showLoader:false,
            current:_data.data[rando],
            index: rando
          });
          document.addEventListener('resetCard',_this.clickHandler,false);
        }
      }
      request.open("GET", url, true);
      request.send();
    },
    render: ()=>{
      return (
        <div>
          <p className="loader" data-show={this.state.showLoader}>Loading</p>
          <Card klick={this.clickHandler} data={this.state.current} />
        </div>
      );
    }
  });

  var Card = React.createClass({
    render: ()=>{
      return (
        <div className="card">
         <h1 className="callout">{this.props.data.job}</h1>
         <img onClick={this.props.klick} className = "card-image" src={this.props.data.image} alt={this.props.data.job}/>
         <p><a href={this.props.data.url} target="_blank">View details</a> on the Metropolitan Museum of Art web site.</p>
        </div>
      );
    }
  });

  var Reset = React.createClass({
    clickHandler: ()=>{
      var ev = new Event('resetCard');
      document.dispatchEvent(ev);
    },
    render: ()=>{
      return (
        <button onClick={this.clickHandler}>Discover another "job"</button>
      );
    }
  })

  ReactDOM.render(
    <App />,
    document.getElementById('content')
  );

  ReactDOM.render(
    <Reset />,
    document.getElementById('reset')
  );
